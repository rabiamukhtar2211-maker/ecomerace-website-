import bcrypt from "bcryptjs";
import { query } from "./db.js";

const initialProducts = [
  { slug: "noir-eclat", name: "Noir Éclat", tagline: "Midnight rose & oud", price: 189, category: "Perfume", family: "Oriental", size: "100 ml", rating: 4.9, reviews: 412, stock: 24, image: "/p-perfume-3.jpg", badge: "Bestseller", notes: ["Bulgarian Rose", "Oud", "Vanilla Absolute"] },
  { slug: "velvet-orchid", name: "Velvet Orchid", tagline: "Plum, orchid, amber", price: 164, category: "Perfume", family: "Floral", size: "90 ml", rating: 4.8, reviews: 318, stock: 31, image: "/p-perfume-1.jpg", badge: "New", notes: ["Purple Orchid", "Plum", "Amber"] },
  { slug: "rose-imperial", name: "Rose Impérial", tagline: "Petal-soft signature", price: 148, category: "Perfume", family: "Floral", size: "75 ml", rating: 4.7, reviews: 596, stock: 44, image: "/p-perfume-2.jpg", notes: ["Rose de Mai", "Peony", "White Musk"] },
  { slug: "amethyst-veil", name: "Amethyst Veil", tagline: "Iris & violet leaf", price: 172, category: "Perfume", family: "Powdery", size: "100 ml", rating: 4.6, reviews: 208, stock: 18, image: "/p-perfume-1.jpg", notes: ["Iris", "Violet Leaf", "Sandalwood"] },
  { slug: "pink-suede", name: "Pink Suede", tagline: "Warm leather blush", price: 158, category: "Perfume", family: "Woody", size: "90 ml", rating: 4.5, reviews: 141, stock: 12, image: "/p-perfume-2.jpg", badge: "Limited", notes: ["Suede", "Raspberry", "Tonka"] },
  { slug: "nuit-de-lilas", name: "Nuit de Lilas", tagline: "Lilac after rain", price: 136, category: "Perfume", family: "Floral", size: "75 ml", rating: 4.4, reviews: 97, stock: 52, image: "/p-perfume-3.jpg", notes: ["Lilac", "Green Fig", "Cedar"] },
  { slug: "orchid-noir-intense", name: "Orchid Noir Intense", tagline: "Deeper, darker, richer", price: 214, category: "Perfume", family: "Oriental", size: "100 ml", rating: 4.9, reviews: 265, stock: 9, image: "/p-perfume-3.jpg", badge: "Bestseller", notes: ["Black Orchid", "Patchouli", "Incense"] },
  { slug: "berry-mirage", name: "Berry Mirage", tagline: "Juicy pink haze", price: 124, category: "Perfume", family: "Fruity", size: "50 ml", rating: 4.3, reviews: 188, stock: 60, image: "/p-perfume-2.jpg", notes: ["Blackcurrant", "Lychee", "Musk"] },
  { slug: "saffron-plum", name: "Saffron & Plum", tagline: "Spiced gourmand", price: 178, category: "Perfume", family: "Spicy", size: "90 ml", rating: 4.7, reviews: 156, stock: 21, image: "/p-perfume-1.jpg", notes: ["Saffron", "Damson Plum", "Benzoin"] },
  { slug: "aura-blanche", name: "Aura Blanche", tagline: "Clean skin veil", price: 132, category: "Perfume", family: "Musky", size: "75 ml", rating: 4.5, reviews: 233, stock: 38, image: "/p-perfume-1.jpg", notes: ["White Musk", "Cotton", "Bergamot"] },
  { slug: "mauve-oud", name: "Mauve Oud", tagline: "Royal resin", price: 246, category: "Perfume", family: "Oriental", size: "100 ml", rating: 5.0, reviews: 84, stock: 6, image: "/p-perfume-3.jpg", badge: "Limited", notes: ["Cambodian Oud", "Rose", "Leather"] },
  { slug: "petale-rose", name: "Pétale Rose", tagline: "Everyday romance", price: 98, category: "Perfume", family: "Floral", size: "50 ml", rating: 4.4, reviews: 402, stock: 75, image: "/p-perfume-2.jpg", notes: ["Rose Petals", "Pear", "Vanilla"] },
  
  // Skincare
  { slug: "glow-serum", name: "Hydra Glow Serum", tagline: "5% niacinamide + HA", price: 68, category: "Skincare", family: "Serum", size: "30 ml", rating: 4.9, reviews: 731, stock: 90, image: "/p-skin-1.jpg", badge: "Bestseller", notes: ["Niacinamide", "Hyaluronic Acid", "Panthenol"] },
  { slug: "radiance-cream", name: "Radiance Cream", tagline: "48h barrier moisture", price: 74, category: "Skincare", family: "Moisturiser", size: "50 ml", rating: 4.8, reviews: 522, stock: 66, image: "/p-skin-2.jpg", notes: ["Ceramides", "Squalane", "Peptides"] },
  { slug: "lilac-toner", name: "Lilac Dew Toner", tagline: "Balancing essence mist", price: 42, category: "Skincare", family: "Toner", size: "150 ml", rating: 4.6, reviews: 289, stock: 120, image: "/p-skin-3.jpg", notes: ["Lilac Extract", "PHA", "Glycerin"] },
  { slug: "night-renewal-oil", name: "Night Renewal Oil", tagline: "Overnight resurfacing", price: 86, category: "Skincare", family: "Facial Oil", size: "30 ml", rating: 4.7, reviews: 198, stock: 33, image: "/p-skin-1.jpg", badge: "New", notes: ["Rosehip", "Bakuchiol", "Vitamin E"] },
  { slug: "velvet-cleanser", name: "Velvet Cream Cleanser", tagline: "Milky, non-stripping", price: 38, category: "Skincare", family: "Cleanser", size: "180 ml", rating: 4.5, reviews: 610, stock: 140, image: "/p-skin-2.jpg", notes: ["Oat Milk", "Amino Acids", "Chamomile"] },
  { slug: "rose-clay-mask", name: "Rose Clay Mask", tagline: "10-minute clarity", price: 46, category: "Skincare", family: "Mask", size: "75 ml", rating: 4.4, reviews: 175, stock: 84, image: "/p-skin-3.jpg", notes: ["Pink Clay", "Kaolin", "Rose Water"] },
  { slug: "vitamin-c-drops", name: "Vitamin C Drops", tagline: "12% brightening", price: 62, category: "Skincare", family: "Serum", size: "20 ml", rating: 4.6, reviews: 344, stock: 58, image: "/p-skin-1.jpg", notes: ["THD Ascorbate", "Ferulic Acid", "Vitamin E"] },
  { slug: "eye-lift-gel", name: "Amethyst Eye Gel", tagline: "Depuff & smooth", price: 54, category: "Skincare", family: "Eye Care", size: "15 ml", rating: 4.5, reviews: 261, stock: 71, image: "/p-skin-3.jpg", notes: ["Caffeine", "Peptides", "Cucumber"] },
  { slug: "retinal-night", name: "Retinal 0.1% Night", tagline: "Firming resurfacer", price: 92, category: "Skincare", family: "Treatment", size: "30 ml", rating: 4.8, reviews: 143, stock: 27, image: "/p-skin-1.jpg", badge: "New", notes: ["Retinal", "Ceramides", "Allantoin"] },
  { slug: "body-souffle", name: "Rose Body Soufflé", tagline: "Whipped silk finish", price: 48, category: "Skincare", family: "Body", size: "200 ml", rating: 4.7, reviews: 231, stock: 95, image: "/p-skin-2.jpg", notes: ["Shea Butter", "Rose Oil", "Niacinamide"] },
  { slug: "spf-veil", name: "Invisible SPF 50 Veil", tagline: "Weightless daily shield", price: 56, category: "Skincare", family: "Sunscreen", size: "50 ml", rating: 4.6, reviews: 388, stock: 110, image: "/p-skin-3.jpg", notes: ["SPF 50 PA++++", "Vitamin E", "Squalane"] },
  { slug: "lip-balm-plum", name: "Plum Lip Treatment", tagline: "Overnight lip mask", price: 28, category: "Skincare", family: "Lip Care", size: "15 ml", rating: 4.4, reviews: 456, stock: 160, image: "/p-skin-2.jpg", notes: ["Plum Oil", "Lanolin", "Shea"] },

  // Gift Sets
  { slug: "gift-signature", name: "Signature Discovery Set", tagline: "5 × 10 ml icons", price: 118, category: "Gift Set", family: "Discovery", size: "5 × 10 ml", rating: 4.9, reviews: 214, stock: 40, image: "/p-perfume-1.jpg", badge: "Bestseller", notes: ["Noir Éclat", "Velvet Orchid", "Rose Impérial"] },
  { slug: "gift-glow-ritual", name: "Glow Ritual Kit", tagline: "Cleanse, serum, cream", price: 156, category: "Gift Set", family: "Skincare Kit", size: "3 pieces", rating: 4.8, reviews: 167, stock: 28, image: "/p-skin-2.jpg", notes: ["Velvet Cleanser", "Hydra Glow", "Radiance Cream"] },
  { slug: "gift-midnight", name: "Midnight Luxe Coffret", tagline: "Parfum + body duo", price: 232, category: "Gift Set", family: "Luxury", size: "2 pieces", rating: 4.9, reviews: 92, stock: 15, image: "/p-perfume-3.jpg", badge: "Limited", notes: ["Orchid Noir", "Rose Body Soufflé"] },
  { slug: "gift-bridal", name: "Bridal Aura Box", tagline: "Curated for the day", price: 268, category: "Gift Set", family: "Luxury", size: "4 pieces", rating: 5.0, reviews: 61, stock: 10, image: "/p-perfume-2.jpg", notes: ["Rose Impérial", "Radiance Cream", "Lip Treatment"] },
  { slug: "gift-mothers", name: "Fleur Celebration Set", tagline: "Petals & powder", price: 142, category: "Gift Set", family: "Discovery", size: "3 pieces", rating: 4.7, reviews: 88, stock: 36, image: "/p-perfume-2.jpg", notes: ["Pétale Rose", "Rose Clay Mask", "Lip Treatment"] }
];

export async function initDatabase() {
  try {
    console.log("🛠️ Initializing PostgreSQL Schema & Tables...");

    // 1. Users Table
    await query(`
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
    await query(`
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
    await query(`
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
    await query(`
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

    // 5. Inquiries Table
    await query(`
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

    // 6. Seed Default Accounts
    const defaultHash = await bcrypt.hash("password123", 10);
    const rabiaHash = await bcrypt.hash("rabia1122", 10);

    // Official Boutique Admin
    await query(`
      INSERT INTO users (name, email, password, role, approval_status, subscription_status, store_name)
      VALUES ('Lumière Atelier', 'seller@lumiere.com', $1, 'seller', 'approved', 'active', 'Lumière Official Atelier')
      ON CONFLICT (email) DO NOTHING;
    `, [defaultHash]);

    // Staff Admin
    await query(`
      INSERT INTO users (name, email, password, role, approval_status, subscription_status, store_name)
      VALUES ('Rabia Mukhtar (Admin)', 'rabia5848@gmail.com', $1, 'admin', 'approved', 'active', 'Lumière Headquarters')
      ON CONFLICT (email) DO UPDATE SET role = 'admin', password = $1;
    `, [rabiaHash]);

    // Secondary Admin Manager
    await query(`
      INSERT INTO users (name, email, password, role, approval_status, subscription_status, store_name)
      VALUES ('Admin Manager', 'admin@lumiere.com', $1, 'admin', 'approved', 'active', 'Lumière Headquarters')
      ON CONFLICT (email) DO NOTHING;
    `, [defaultHash]);

    // Verified Artisan Seller: rabo (seharkhan5848@gmail.com)
    await query(`
      INSERT INTO users (name, email, password, role, approval_status, subscription_status, store_name, phone)
      VALUES ('Rabia Mukhtar', 'seharkhan5848@gmail.com', $1, 'seller', 'approved', 'active', 'rabo', '+92 300 0000000')
      ON CONFLICT (email) DO UPDATE SET 
        role = 'seller',
        approval_status = 'approved',
        subscription_status = 'active',
        store_name = 'rabo';
    `, [rabiaHash]);

    // 7. Seed Initial Products if empty
    const productCountRes = await query("SELECT COUNT(*) FROM products");
    const count = parseInt(productCountRes.rows[0].count, 10);

    if (count === 0) {
      console.log("🌸 Seeding luxury catalogue into PostgreSQL...");
      const sellerRes = await query("SELECT id FROM users WHERE role = 'seller' ORDER BY id ASC LIMIT 1");
      const sellerId = sellerRes.rows[0]?.id || 1;

      for (const p of initialProducts) {
        await query(`
          INSERT INTO products (seller_id, slug, name, tagline, description, price, category, family, size, rating, reviews, stock, image, badge, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (slug) DO NOTHING;
        `, [
          sellerId,
          p.slug,
          p.name,
          p.tagline,
          `${p.name} — ${p.tagline}. A ${p.family.toLowerCase()} composition crafted in small batches with sustainably sourced ingredients.`,
          p.price,
          p.category,
          p.family,
          p.size,
          p.rating,
          p.reviews,
          p.stock,
          p.image,
          p.badge || null,
          JSON.stringify(p.notes || [])
        ]);
      }
      console.log(`✅ Seeded ${initialProducts.length} luxury products successfully!`);
    }

    console.log("✅ PostgreSQL schema, users & catalogue ready!");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  }
}