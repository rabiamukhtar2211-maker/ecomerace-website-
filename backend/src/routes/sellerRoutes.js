import express from "express";
import {
  getSellerDashboardStats,
  getSellerProducts,
  getSellerOrders,
  getSellerCustomers,
  getSellerSubscription
} from "../controllers/sellerController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// All seller endpoints require JWT token and seller/admin role
router.use(authenticateToken);
router.use(requireRole("seller", "admin"));

router.get("/stats", getSellerDashboardStats);
router.get("/products", getSellerProducts);
router.get("/orders", getSellerOrders);
router.get("/customers", getSellerCustomers);
router.get("/subscription", getSellerSubscription);

export default router;
