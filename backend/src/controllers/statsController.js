import { query } from "../config/db.js";

// 📊 GET ADMIN DASHBOARD STATS (Scoped for Admin's own boutique products & marketplace overview)
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Admin's Own Revenue (Items sold by Admin/Official Atelier)
    const revenueRes = await query(`
      SELECT COALESCE(SUM(oi.total), 0) AS total_revenue 
      FROM order_items oi
      LEFT JOIN users u ON u.id = oi.seller_id
      WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
    `);
    const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue) || 0;

    // 2. Admin's Own Orders Count
    const ordersCountRes = await query(`
      SELECT COUNT(DISTINCT oi.order_id) AS total_orders 
      FROM order_items oi
      LEFT JOIN users u ON u.id = oi.seller_id
      WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
    `);
    const totalOrders = parseInt(ordersCountRes.rows[0].total_orders, 10) || 0;

    // 3. Registered Customers who purchased Admin's products
    const customersCountRes = await query(`
      SELECT COUNT(DISTINCT o.email) AS total_customers 
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN users u ON u.id = oi.seller_id
      WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
    `);
    const totalCustomers = parseInt(customersCountRes.rows[0].total_customers, 10) || 0;

    // 4. Low Stock Items (Admin's products)
    const lowStockRes = await query(`
      SELECT COUNT(*) AS low_stock 
      FROM products p
      LEFT JOIN users u ON u.id = p.seller_id
      WHERE (p.seller_id IS NULL OR p.seller_id = 1 OR u.role = 'admin') AND p.stock < 15
    `);
    const lowStock = parseInt(lowStockRes.rows[0].low_stock, 10) || 0;

    // 5. Total Sellers & Pending Approvals
    const sellersRes = await query(`
      SELECT 
        COUNT(*) AS total_sellers,
        COUNT(*) FILTER (WHERE approval_status = 'pending') AS pending_sellers
      FROM users 
      WHERE role = 'seller'
    `);
    const totalSellers = parseInt(sellersRes.rows[0].total_sellers, 10) || 0;
    const pendingSellers = parseInt(sellersRes.rows[0].pending_sellers, 10) || 0;

    // 6. Recent Orders for Admin's products (Last 8)
    const recentOrdersRes = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.customer_name AS customer,
        o.email,
        o.city,
        COALESCE(SUM(oi.total), 0) AS total,
        o.status,
        COUNT(oi.id) AS items,
        o.created_at AS date
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN users u ON u.id = oi.seller_id
      WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 8
    `);

    // 7. Top Admin Products
    const topProductsRes = await query(`
      SELECT p.name, p.reviews, p.rating, p.price, p.image 
      FROM products p
      LEFT JOIN users u ON u.id = p.seller_id
      WHERE (p.seller_id IS NULL OR p.seller_id = 1 OR u.role = 'admin')
      ORDER BY p.reviews DESC 
      LIMIT 5
    `);

    // 8. Monthly Sales Aggregation (for Admin's products)
    const monthlySalesRes = await query(`
      SELECT 
        to_char(o.created_at, 'Mon') AS month,
        SUM(oi.total)::numeric AS revenue
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN users u ON u.id = oi.seller_id
      WHERE (oi.seller_id IS NULL OR oi.seller_id = 1 OR u.role = 'admin' OR u.role IS NULL)
      GROUP BY to_char(o.created_at, 'Mon'), date_trunc('month', o.created_at)
      ORDER BY date_trunc('month', o.created_at) ASC
    `);

    const defaultSalesByMonth = [
      { month: "Jan", revenue: 2400 },
      { month: "Feb", revenue: 3800 },
      { month: "Mar", revenue: 5200 },
      { month: "Apr", revenue: 6100 },
      { month: "May", revenue: 7800 },
      { month: "Jun", revenue: 9200 },
      { month: "Jul", revenue: 8400 },
      { month: "Aug", revenue: Math.max(totalRevenue, 11200) },
    ];

    const salesByMonth = monthlySalesRes.rows.length > 0
      ? monthlySalesRes.rows.map(r => ({ month: r.month, revenue: parseFloat(r.revenue) }))
      : defaultSalesByMonth;

    return res.json({
      kpis: {
        revenue: `$${totalRevenue.toLocaleString()}`,
        orders: totalOrders.toString(),
        customers: totalCustomers.toString(),
        lowStock: lowStock.toString(),
        sellers: totalSellers.toString(),
        pendingSellers: pendingSellers.toString()
      },
      recentOrders: recentOrdersRes.rows,
      topProducts: topProductsRes.rows,
      salesByMonth
    });
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
};
