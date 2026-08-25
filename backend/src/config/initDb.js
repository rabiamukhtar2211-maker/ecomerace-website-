import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      database: process.env.DB_NAME || "lumiere_aura_db",
    };

export async function initDatabase() {
  const pool = new Pool(poolConfig);

  try {
    console.log("🛠️ Initializing PostgreSQL Schema & Tables...");

    // 1. Users Table (with Multi-vendor & Seller Columns)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'buyer',
        approval_status VARCHAR(50) DEFAULT 'approved',
        subscription_status VARCHAR(50) DEFAULT 'active',
        subscription_plan VARCHAR(100) DEFAULT 'Artisan Monthly ($29/mo)',
        subscription_expires_at TIMESTAMP WITH TIME ZONE,
        store_name VARCHAR(150),
        phone VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id INT REFERENCES users(id) ON DELETE SET NULL,
        slug VARCHAR(100) UNIQUE,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        old_price NUMERIC(10, 2),
        category VARCHAR(100) NOT NULL,
        family VARCHAR(100),
        size VARCHAR(50),
        rating NUMERIC(3, 2) DEFAULT 5.0,
        reviews INT DEFAULT 0,
        stock INT DEFAULT 20,
        image TEXT,
        badge VARCHAR(50),
        notes JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Orders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        address TEXT,
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        payment_method VARCHAR(50) DEFAULT 'Cash on Delivery (COD)',
        items_count INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Order Items Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id) ON DELETE SET NULL,
        seller_id INT REFERENCES users(id) ON DELETE SET NULL,
        product_name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        total NUMERIC(10, 2) NOT NULL
      );
    `);

    // 5. Inquiries & Contact Messages Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        topic VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Unread',
        reply TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Ensure default Admin & Seller user exists
    const adminCheck = await pool.query("SELECT id FROM users WHERE email = 'seller@lumiere.com' OR email = 'admin@lumiere.com'");
    if (adminCheck.rows.length === 0) {
      const hash = await bcrypt.hash("password123", 10);
      await pool.query(`
        INSERT INTO users (name, email, password, role, approval_status, subscription_status, store_name)
        VALUES ('Lumière Atelier', 'seller@lumiere.com', $1, 'seller', 'approved', 'active', 'Lumière Official Atelier')
      `, [hash]);
      console.log(" Default official boutique seller account created.");
    }

    console.log("✅ PostgreSQL schema & tables ready!");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  } finally {
    await pool.end();
  }
}

// Auto-run if executed directly via node initDb.js
if (process.argv[1]?.includes("initDb.js")) {
  initDatabase();
}