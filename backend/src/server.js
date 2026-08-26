import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import { getDashboardStats } from "./controllers/statsController.js";
import { initDatabase } from "./config/initDb.js";
import { query } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & CORS
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: "*" }));

// Increase JSON Body Limit to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/stats", getDashboardStats);

// Healthcheck & DB Diagnostics
app.get("/", async (req, res) => {
  let dbStatus = "unknown";
  let dbError = null;
  let hasDbUrl = !!process.env.DATABASE_URL;

  try {
    const testRes = await query("SELECT COUNT(*) FROM products");
    dbStatus = `connected (products count: ${testRes.rows[0].count})`;
  } catch (e) {
    dbStatus = "failed";
    dbError = e.message;
  }

  res.json({
    status: "online",
    message: "Lumière Aura Atelier API is running!",
    hasDatabaseUrl: hasDbUrl,
    databaseStatus: dbStatus,
    databaseError: dbError,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handlers
app.use((err, req, res, next) => {
  console.error("Express Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.listen(PORT, async () => {
  console.log(` Lumière Aura Backend running on port ${PORT}`);
  // Automatically ensure database schema exists on boot (Render cloud support)
  try {
    await initDatabase();
  } catch (e) {
    console.warn("Database auto-init note:", e.message);
  }
});