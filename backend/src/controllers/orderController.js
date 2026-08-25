import { query, pool } from "../config/db.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/emailService.js";

// Create / Place New Order
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_name, email, city, address, payment_method, items, total_amount } = req.body;

    if (!customer_name || !email || !items || items.length === 0) {
      return res.status(400).json({ error: "Customer details and items are required." });
    }

    const orderNumber = "#LA-" + Math.floor(1000 + Math.random() * 9000);
    const userId = req.user ? req.user.id : null;

    await client.query("BEGIN");

    // Insert Order into orders table
    const orderRes = await client.query(
      `INSERT INTO orders 
       (order_number, user_id, customer_name, email, city, address, total_amount, status, payment_method, items_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        orderNumber,
        userId,
        customer_name,
        email.toLowerCase().trim(),
        city || "",
        address || "",
        parseFloat(total_amount),
        "Pending",
        payment_method || "Cash On Delivery",
        items.length
      ]
    );

    const newOrder = orderRes.rows[0];

    // Insert Order Items and safely resolve product_id & seller_id from database
    for (const item of items) {
      let resolvedProductId = null;
      let resolvedSellerId = null;

      // Try numeric product_id if valid
      if (item.product_id && !isNaN(item.product_id) && Number.isInteger(Number(item.product_id))) {
        resolvedProductId = parseInt(item.product_id, 10);
      }

      // Query database to find real product_id and seller_id by ID, Slug or Name
      const pRes = await client.query(
        `SELECT id, seller_id FROM products 
         WHERE (id = $1) 
            OR (slug = $2) 
            OR (name ILIKE $3) 
         LIMIT 1`,
        [
          resolvedProductId || 0,
          typeof item.product_id === "string" ? item.product_id : "",
          item.name || item.product_name || ""
        ]
      );

      if (pRes.rows.length > 0) {
        resolvedProductId = pRes.rows[0].id;
        resolvedSellerId = pRes.rows[0].seller_id;
      }

      await client.query(
        `INSERT INTO order_items (order_id, product_id, seller_id, product_name, price, quantity, total) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newOrder.id,
          resolvedProductId,
          resolvedSellerId,
          item.name || item.product_name,
          parseFloat(item.price),
          parseInt(item.quantity, 10),
          parseFloat(item.price) * parseInt(item.quantity, 10)
        ]
      );
    }

    await client.query("COMMIT");

    // Send Real Confirmation Email to Customer in background
    sendOrderConfirmationEmail(newOrder, items).catch((err) =>
      console.error("Order email dispatch error:", err.message)
    );

    return res.status(201).json({
      message: "Order placed successfully in database!",
      order: newOrder
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create Order Error:", error);
    return res.status(500).json({ error: "Failed to place order in database." });
  } finally {
    client.release();
  }
};

// Get Logged In User's Orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT o.*, 
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
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1 OR o.email = $2
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId, req.user.email]
    );

    return res.json({ orders: result.rows });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// 🛡️ GET ADMIN ORDERS (Shows ONLY Admin's own boutique/official atelier orders, NOT third-party seller orders)
export const getAllOrders = async (req, res) => {
  try {
    // Admin orders are items where seller_id is NULL or belongs to Admin (id=1 or role='admin')
    const result = await query(
      `SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.email,
        o.city,
        o.address,
        o.status,
        o.payment_method,
        o.created_at,
        COALESCE(SUM(oi.total), 0) AS total_amount,
        COUNT(oi.id) AS items_count,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'seller_id', oi.seller_id,
            'product_name', oi.product_name,
            'price', oi.price,
            'quantity', oi.quantity,
            'total', oi.total
          )
        ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN users u ON u.id = oi.seller_id
       WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    return res.json({ count: result.rows.length, orders: result.rows });
  } catch (error) {
    console.error("Get Admin Orders Error:", error);
    return res.status(500).json({ error: "Failed to fetch admin orders." });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const updatedOrder = result.rows[0];

    // Send real Status update email to customer
    sendOrderStatusEmail(updatedOrder, status).catch((err) =>
      console.error("Status email error:", err.message)
    );

    return res.json({ message: "Order status updated & email notified!", order: updatedOrder });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ error: "Failed to update order status." });
  }
};