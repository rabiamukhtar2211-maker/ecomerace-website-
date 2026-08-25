import { query } from "../config/db.js";

// 📊 GET SELLER DASHBOARD STATS
export const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 1. Seller's Total Sales Revenue
    const revenueRes = await query(
      "SELECT COALESCE(SUM(total), 0) AS total_revenue FROM order_items WHERE seller_id = $1",
      [sellerId]
    );
    const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue) || 0;

    // 2. Seller's Total Orders
    const ordersRes = await query(
      "SELECT COUNT(DISTINCT order_id) AS total_orders FROM order_items WHERE seller_id = $1",
      [sellerId]
    );
    const totalOrders = parseInt(ordersRes.rows[0].total_orders, 10) || 0;

    // 3. Seller's Customers Count
    const customersRes = await query(
      `SELECT COUNT(DISTINCT o.email) AS total_customers 
       FROM orders o 
       JOIN order_items oi ON oi.order_id = o.id 
       WHERE oi.seller_id = $1`,
      [sellerId]
    );
    const totalCustomers = parseInt(customersRes.rows[0].total_customers, 10) || 0;

    // 4. Seller's Active Products Count
    const productsRes = await query(
      "SELECT COUNT(*) AS total_products FROM products WHERE seller_id = $1",
      [sellerId]
    );
    const totalProducts = parseInt(productsRes.rows[0].total_products, 10) || 0;

    // 5. Seller's Recent Orders (with their specific items)
    const recentOrdersRes = await query(
      `SELECT 
        o.id,
        o.order_number,
        o.customer_name AS customer,
        o.email,
        o.city,
        o.status,
        o.created_at AS date,
        COALESCE(SUM(oi.total), 0) AS seller_total,
        COUNT(oi.id) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE oi.seller_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 8`,
      [sellerId]
    );

    // 6. Seller's Top Products
    const topProductsRes = await query(
      `SELECT id, name, reviews, rating, price, stock, image 
       FROM products 
       WHERE seller_id = $1 
       ORDER BY reviews DESC, rating DESC 
       LIMIT 5`,
      [sellerId]
    );

    return res.json({
      kpis: {
        revenue: `$${totalRevenue.toLocaleString()}`,
        orders: totalOrders.toString(),
        customers: totalCustomers.toString(),
        products: totalProducts.toString()
      },
      recentOrders: recentOrdersRes.rows,
      topProducts: topProductsRes.rows
    });
  } catch (error) {
    console.error("Seller Stats Error:", error);
    return res.status(500).json({ error: "Failed to fetch seller dashboard statistics." });
  }
};

// 📦 GET SELLER PRODUCTS
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const result = await query(
      "SELECT * FROM products WHERE seller_id = $1 ORDER BY id DESC",
      [sellerId]
    );
    return res.json({ count: result.rows.length, products: result.rows });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res.status(500).json({ error: "Failed to fetch seller products." });
  }
};

// 🛍️ GET SELLER ORDERS
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const result = await query(
      `SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.email,
        o.city,
        o.address,
        o.status,
        o.created_at,
        COALESCE(SUM(oi.total), 0) AS total_amount,
        COUNT(oi.id) AS items_count,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'price', oi.price,
            'quantity', oi.quantity,
            'total', oi.total
          )
        ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE oi.seller_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [sellerId]
    );

    return res.json({ count: result.rows.length, orders: result.rows });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    return res.status(500).json({ error: "Failed to fetch seller orders." });
  }
};

// 👥 GET SELLER CUSTOMERS (Only buyers who purchased from this seller)
export const getSellerCustomers = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const result = await query(
      `SELECT 
        o.customer_name AS name,
        o.email,
        o.city,
        MAX(o.created_at) AS last_order,
        COUNT(DISTINCT o.id)::int AS orders,
        SUM(oi.total)::numeric AS spent
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE oi.seller_id = $1
       GROUP BY o.customer_name, o.email, o.city
       ORDER BY spent DESC`,
      [sellerId]
    );

    const customersWithTier = result.rows.map((c) => {
      const spent = parseFloat(c.spent) || 0;
      let tier = "Bronze";
      if (spent >= 1000) tier = "Platinum";
      else if (spent >= 500) tier = "Gold";
      else if (spent >= 200) tier = "Silver";

      return {
        ...c,
        spent,
        tier
      };
    });

    return res.json({ count: customersWithTier.length, customers: customersWithTier });
  } catch (error) {
    console.error("Get Seller Customers Error:", error);
    return res.status(500).json({ error: "Failed to fetch seller customers." });
  }
};

// 💳 GET SELLER SUBSCRIPTION DETAILS
export const getSellerSubscription = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const result = await query(
      `SELECT id, name, email, store_name, approval_status, subscription_status, subscription_plan, subscription_expires_at 
       FROM users 
       WHERE id = $1`,
      [sellerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Seller profile not found." });
    }

    const seller = result.rows[0];
    const now = new Date();
    const expiry = seller.subscription_expires_at ? new Date(seller.subscription_expires_at) : null;
    const daysLeft = expiry ? Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))) : 30;

    return res.json({
      subscription: {
        status: seller.subscription_status || "active",
        plan: seller.subscription_plan || "Artisan Monthly ($29/mo)",
        expires_at: seller.subscription_expires_at,
        days_left: daysLeft,
        store_name: seller.store_name
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch subscription status." });
  }
};
