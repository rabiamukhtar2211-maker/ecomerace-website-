import express from "express";
import { sendMessage, getAllMessages, replyToMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// Public: Client sends a message from Contact Us page
router.post("/", sendMessage);

// Admin: View all client inquiries
router.get("/", getAllMessages);

// Admin: Reply directly to client via real Email
router.post("/:id/reply", replyToMessage);

// Admin: Delete an inquiry
router.delete("/:id", deleteMessage);

export default router;
