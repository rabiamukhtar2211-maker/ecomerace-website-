import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Determine whether we're connecting via full connection string (Render/Neon/Supabase) or local config
const isProduction = process.env.NODE_ENV === "production" || !!process.env.DATABASE_URL;

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
      ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
    };

export const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log(" Connected to PostgreSQL Database successfully!");
});

pool.on("error", (err) => {
  console.error(" Unexpected PostgreSQL Client error:", err.message);
});

export const query = (text, params) => pool.query(text, params);