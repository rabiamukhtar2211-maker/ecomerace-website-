import { query } from "../config/db.js";
import { sendInquiryReplyEmail } from "../services/emailService.js";

// 📩 Send / Create new Contact Message (from Client)
export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const result = await query(
      `INSERT INTO messages (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name.trim(), email.toLowerCase().trim(), subject ? subject.trim() : "General Inquiry", message.trim()]
    );

    return res.status(201).json({
      message: "Message received! We will reply to your inbox shortly.",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
};

// 📬 Get All Messages (for Admin)
export const getAllMessages = async (req, res) => {
  try {
    const result = await query("SELECT * FROM messages ORDER BY created_at DESC");
    return res.json({ count: result.rows.length, messages: result.rows });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ error: "Failed to fetch messages." });
  }
};

// ✉️ Admin Reply to Inquiry (Sends real email)
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ error: "Reply message text is required." });
    }

    const msgRes = await query("SELECT * FROM messages WHERE id = $1", [id]);
    if (msgRes.rows.length === 0) {
      return res.status(404).json({ error: "Message not found." });
    }

    const msg = msgRes.rows[0];

    // Send real reply email
    await sendInquiryReplyEmail({
      toEmail: msg.email,
      toName: msg.name,
      subject: msg.subject,
      replyMessage,
    });

    await query("UPDATE messages SET status = 'Replied' WHERE id = $1", [id]);

    return res.json({ message: `Reply sent directly to ${msg.email}!` });
  } catch (error) {
    console.error("Reply Error:", error);
    return res.status(500).json({ error: "Failed to send reply email." });
  }
};

// 🗑️ Delete Message (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM messages WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found." });
    }

    return res.json({ message: "Message deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete message." });
  }
};
