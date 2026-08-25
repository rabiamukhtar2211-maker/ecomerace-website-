import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Middleware for optional token extraction
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.split(" ")[1]) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
};

// Protected / Admin routes
router.post("/", optionalAuth, createProduct);
router.put("/:id", optionalAuth, updateProduct);
router.delete("/:id", optionalAuth, deleteProduct);

export default router;