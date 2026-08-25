import express from "express";
import { createOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", authenticateToken, requireRole("seller", "admin"), getAllOrders);
router.patch("/:id/status", authenticateToken, requireRole("seller", "admin"), updateOrderStatus);

export default router;