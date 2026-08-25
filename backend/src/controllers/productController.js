import { query } from "../config/db.js";

// 📦 GET ALL PRODUCTS (With filters & sorting)
export const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let sql = `
      SELECT p.*, COALESCE(u.store_name, 'Lumière Atelier') AS store_name, u.name AS seller_name
      FROM products p
      LEFT JOIN users u ON u.id = p.seller_id
      WHERE (u.subscription_status = 'active' OR u.subscription_status IS NULL OR p.seller_id IS NULL OR u.role = 'admin')
    `;
    const params = [];

    if (category && category !== "All") {
      const cleanCat = category.toLowerCase().includes("perfume") ? "Perfume" 
                     : category.toLowerCase().includes("skin") ? "Skincare" 
                     : category.toLowerCase().includes("gift") ? "Gift Set" 
                     : category;
      params.push(`%${cleanCat}%`);
      sql += ` AND p.category ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.name ILIKE $${params.length} OR p.tagline ILIKE $${params.length} OR p.description ILIKE $${params.length} OR u.store_name ILIKE $${params.length})`;
    }

    if (sort === "price-low") {
      sql += " ORDER BY p.price ASC";
    } else if (sort === "price-high") {
      sql += " ORDER BY p.price DESC";
    } else if (sort === "rating") {
      sql += " ORDER BY p.rating DESC";
    } else {
      sql += " ORDER BY p.id DESC";
    }

    const result = await query(sql, params);
    return res.json({ count: result.rows.length, products: result.rows });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};

// 🔍 GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let result;

    if (!isNaN(id) && Number.isInteger(Number(id))) {
      result = await query(
        `SELECT p.*, COALESCE(u.store_name, 'Lumière Atelier') AS store_name, u.name AS seller_name
         FROM products p
         LEFT JOIN users u ON u.id = p.seller_id
         WHERE p.id = $1`,
        [parseInt(id, 10)]
      );
    } else {
      result = await query(
        `SELECT p.*, COALESCE(u.store_name, 'Lumière Atelier') AS store_name, u.name AS seller_name
         FROM products p
         LEFT JOIN users u ON u.id = p.seller_id
         WHERE p.slug = $1`,
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.json({ product: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product details." });
  }
};

// ➕ CREATE NEW PRODUCT (Seller / Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, tagline, description, price, old_price, category, family, size, stock, image, badge, notes } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);
    
    // Get seller id from authenticated request (JWT) or fallback to first seller
    let sellerId = req.user ? req.user.id : null;
    if (!sellerId) {
      const sellerRes = await query("SELECT id FROM users WHERE role = 'seller' OR role = 'admin' ORDER BY id ASC LIMIT 1");
      if (sellerRes.rows.length > 0) {
        sellerId = sellerRes.rows[0].id;
      }
    }

    const result = await query(
      `INSERT INTO products 
       (seller_id, slug, name, tagline, description, price, old_price, category, family, size, stock, image, badge, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [
        sellerId,
        slug,
        name,
        tagline || "",
        description || `${name} — ${tagline || "Luxury collection"}. Blended in small batches with sustainably sourced ingredients.`,
        parseFloat(price),
        old_price ? parseFloat(old_price) : null,
        category,
        family || "Luxury",
        size || "100 ml",
        stock ? parseInt(stock, 10) : 20,
        image || "/p-perfume-1.jpg",
        badge || null,
        JSON.stringify(notes || [])
      ]
    );

    return res.status(201).json({
      message: "Product created successfully in PostgreSQL!",
      product: result.rows[0]
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ error: "Failed to create product in database." });
  }
};

// 🔄 UPDATE PRODUCT (Supports both integer ID and slug string safely)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagline, description, price, old_price, category, family, size, stock, image, badge } = req.body;

    const isNumericId = !isNaN(id) && Number.isInteger(Number(id));
    const whereClause = isNumericId ? "id = $12" : "slug = $12";
    const lookupParam = isNumericId ? parseInt(id, 10) : id;

    const result = await query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           tagline = COALESCE($2, tagline),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           old_price = COALESCE($5, old_price),
           category = COALESCE($6, category),
           family = COALESCE($7, family),
           size = COALESCE($8, size),
           stock = COALESCE($9, stock),
           image = COALESCE($10, image),
           badge = COALESCE($11, badge)
       WHERE ${whereClause}
       RETURNING *`,
      [
        name,
        tagline,
        description,
        price ? parseFloat(price) : null,
        old_price ? parseFloat(old_price) : null,
        category,
        family,
        size,
        stock ? parseInt(stock, 10) : null,
        image,
        badge,
        lookupParam
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in database." });
    }

    return res.json({
      message: "Product updated successfully!",
      product: result.rows[0]
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ error: "Failed to update product in database: " + error.message });
  }
};

// ❌ DELETE PRODUCT (By ID or Slug)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let result;

    if (!isNaN(id) && Number.isInteger(Number(id))) {
      result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [parseInt(id, 10)]);
    } else {
      result = await query("DELETE FROM products WHERE slug = $1 RETURNING id", [id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in database." });
    }

    return res.json({ message: "Product removed from database successfully!" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ error: "Failed to delete product." });
  }
};