import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "rabia1122",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "lumiere_aura_db",
});

async function migrate() {
  try {
    console.log("🔄 Running Database Schema Migrations for Seller & Multi-Vendor...");

    // 1. Add Seller columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'approved',
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'Artisan Monthly ($29/mo)',
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
      ADD COLUMN IF NOT EXISTS store_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);

    // 2. Add seller_id column to order_items table
    await pool.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS seller_id INT REFERENCES users(id) ON DELETE SET NULL;
    `);

    // 3. Ensure existing sellers have approved status & store_name
    await pool.query(`
      UPDATE users 
      SET approval_status = 'approved', 
          subscription_status = 'active',
          store_name = COALESCE(store_name, name || ' Atelier')
      WHERE role = 'seller' AND approval_status IS NULL;
    `);

    console.log("✅ Database schema migrated successfully!");
  } catch (err) {
    console.error("❌ Migration Error:", err);
  } finally {
    await pool.end();
  }
}

migrate();
