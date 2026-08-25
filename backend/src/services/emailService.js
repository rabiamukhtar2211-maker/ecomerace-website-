import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rabiamukhtar5948@gmail.com";
const SMTP_PASS = (process.env.SMTP_PASS || "").replace(/\s+/g, ""); // strip spaces

// Transporter configuration (Gmail with TLS support)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper function to send email safely
async function sendMailSafely(mailOptions) {
  try {
    if (!SMTP_PASS) {
      console.log(`\n======================================================`);
      console.log(`📧 [EMAIL DISPATCH SIMULATION from ${ADMIN_EMAIL}]`);
      console.log(`TO: ${mailOptions.to}`);
      console.log(`SUBJECT: ${mailOptions.subject}`);
      console.log(`======================================================\n`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"Lumière Aura Atelier" <${ADMIN_EMAIL}>`,
      ...mailOptions,
    });
    console.log(`✅ Live Email dispatched to ${mailOptions.to}! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`⚠️ Email sending notice (${mailOptions.to}):`, err.message);
    return { success: false, error: err.message };
  }
}

// 1. Order Confirmation Email
export const sendOrderConfirmationEmail = async (order, items = []) => {
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EAD8EB;">
        <td style="padding: 12px 0; font-family: 'Helvetica Neue', Arial, sans-serif; color: #24102F;">
          <strong>${item.name || item.product_name}</strong>
          <div style="font-size: 12px; color: #8A6A91;">Quantity: ${item.quantity}</div>
        </td>
        <td style="padding: 12px 0; text-align: right; font-family: 'Helvetica Neue', Arial, sans-serif; color: #24102F; font-weight: 600;">
          $${(parseFloat(item.price) * parseInt(item.quantity, 10)).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="background-color: #FBF3FA; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EAD8EB; overflow: hidden; box-shadow: 0 10px 30px rgba(53, 16, 79, 0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #35104F 0%, #7B247F 60%, #C44991 100%); padding: 35px 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; letter-spacing: 4px; font-weight: 300;">LUMIÈRE</h1>
          <p style="margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #F6C76B; text-transform: uppercase;">Aura Atelier</p>
        </div>

        <!-- Body Content -->
        <div style="padding: 35px 30px;">
          <h2 style="color: #35104F; font-size: 20px; margin-top: 0;">Order Confirmed! ✨</h2>
          <p style="color: #6B4A78; font-size: 14px; line-height: 1.6;">
            Dear <strong>${order.customer_name}</strong>,<br>
            Thank you for choosing Lumière Aura. Your bespoke fragrances and skincare treasures are being carefully prepared and wrapped in violet tissue in our atelier.
          </p>

          <!-- Order Summary Box -->
          <div style="background-color: #FAF2F9; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #EAD8EB;">
            <div style="font-size: 12px; color: #8A6A91; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Order Reference</div>
            <div style="font-size: 18px; font-weight: bold; color: #7B247F;">${order.order_number}</div>
            <div style="font-size: 12px; color: #8A6A91; margin-top: 5px;">Payment: ${order.payment_method || "Cash On Delivery"}</div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="border-bottom: 2px solid #35104F;">
                <th style="text-align: left; padding-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8A6A91;">Item</th>
                <th style="text-align: right; padding-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8A6A91;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding-top: 18px; font-size: 15px; font-weight: bold; color: #35104F;">Grand Total</td>
                <td style="padding-top: 18px; text-align: right; font-size: 18px; font-weight: bold; color: #7B247F;">
                  $${parseFloat(order.total_amount).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Shipping Address -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #EAD8EB;">
            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #35104F; margin-bottom: 4px;">Delivery Address</p>
            <p style="font-size: 13px; color: #6B4A78; margin: 0; line-height: 1.5;">${order.address} ${order.city ? `· ${order.city}` : ""}</p>
          </div>

          <!-- Footer Note -->
          <p style="margin-top: 35px; font-size: 12px; color: #8A6A91; text-align: center; line-height: 1.5;">
            Questions about your order? Reach our atelier concierge anytime at <a href="mailto:${ADMIN_EMAIL}" style="color: #7B247F; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a>.
          </p>
        </div>

        <!-- Footer Bar -->
        <div style="background-color: #24102F; padding: 15px; text-align: center; color: #A088A5; font-size: 11px;">
          © ${new Date().getFullYear()} Lumière Aura Atelier. Handcrafted with luxury in small batches.
        </div>
      </div>
    </div>
  `;

  return sendMailSafely({
    to: order.email,
    subject: `Order Confirmed: ${order.order_number} — Lumière Aura Atelier`,
    html,
  });
};

// 2. Order Status Update Email
export const sendOrderStatusEmail = async (order, newStatus) => {
  const html = `
    <div style="background-color: #FBF3FA; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EAD8EB; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #35104F 0%, #7B247F 100%); padding: 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 3px;">LUMIÈRE AURA</h1>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #F6C76B; text-transform: uppercase;">Order Status Update</p>
        </div>
        <div style="padding: 35px 30px;">
          <p style="font-size: 14px; color: #35104F;">Dear <strong>${order.customer_name}</strong>,</p>
          <p style="font-size: 14px; color: #6B4A78; line-height: 1.6;">
            Your order <strong>${order.order_number}</strong> status has been updated to:
          </p>
          <div style="background: #FAF2F9; border: 1px solid #EAD8EB; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 18px; font-weight: bold; color: #7B247F; text-transform: uppercase; letter-spacing: 1.5px;">${newStatus}</span>
          </div>
          <p style="font-size: 13px; color: #8A6A91; line-height: 1.5;">
            Total: <strong>$${parseFloat(order.total_amount).toFixed(2)}</strong><br>
            Destination: ${order.address} (${order.city || "Pakistan"})
          </p>
        </div>
      </div>
    </div>
  `;

  return sendMailSafely({
    to: order.email,
    subject: `Order Update: ${order.order_number} is now ${newStatus} — Lumière Aura`,
    html,
  });
};

// 3. Client Inquiry Reply Email
export const sendInquiryReplyEmail = async ({ toEmail, toName, subject, replyMessage }) => {
  const html = `
    <div style="background-color: #FBF3FA; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EAD8EB; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #35104F 0%, #7B247F 100%); padding: 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: 3px;">LUMIÈRE AURA</h1>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #F6C76B; text-transform: uppercase;">Concierge Service</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 14px; color: #35104F;">Hello <strong>${toName}</strong>,</p>
          <div style="margin: 20px 0; padding: 20px; background: #FAF2F9; border-left: 4px solid #7B247F; border-radius: 6px; font-size: 14px; color: #24102F; line-height: 1.7; white-space: pre-wrap;">
${replyMessage}
          </div>
          <p style="font-size: 12px; color: #8A6A91; margin-top: 25px;">
            Warm regards,<br>
            <strong>Rabia Mukhtar</strong><br>
            Lumière Aura Atelier (<a href="mailto:${ADMIN_EMAIL}" style="color: #7B247F;">${ADMIN_EMAIL}</a>)
          </p>
        </div>
      </div>
    </div>
  `;

  return sendMailSafely({
    to: toEmail,
    subject: `Re: ${subject || "Inquiry with Lumière Aura"}`,
    html,
  });
};
