import express from "express";
import {
  register,
  login,
  getProfile,
  getCustomers,
  getAllSellers,
  updateSellerApproval,
  updateSellerSubscription,
  sendDirectEmailToCustomer
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Authenticated
router.get("/me", authenticateToken, getProfile);

// Admin Customer Management
router.get("/customers", getCustomers);
router.post("/send-customer-email", sendDirectEmailToCustomer);

// Admin Seller Management
router.get("/sellers", getAllSellers);
router.patch("/sellers/:id/approval", updateSellerApproval);
router.patch("/sellers/:id/subscription", updateSellerSubscription);

export default router;