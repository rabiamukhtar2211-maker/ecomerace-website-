import { useState, useEffect } from "react";
import { Mail, Trash2, Loader2, RefreshCw, Calendar, Send, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/shared/services/api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      setMessages(res.messages || []);
    } catch (err) {
      console.warn("Failed to fetch messages:", err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenReply = (msg) => {
    setActiveMessage(msg);
    setReplyText(`Dear ${msg.name},\n\nThank you for reaching out to Lumière Aura. Regarding your inquiry on "${msg.subject || "our collection"}", `);
    setReplyModalOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await api.replyMessage(activeMessage.id, replyText);
      toast.success(res.message || `Reply dispatched to ${activeMessage.email}!`);
      setReplyModalOpen(false);
      fetchMessages();
    } catch (err) {
      toast.error(err.message || "Failed to send email reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete message.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Client Inquiries & Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.length} messages received. Replies are delivered directly to customer email.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Messages
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
          Loading client messages from PostgreSQL...
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="card-lux py-16 text-center text-muted-foreground">
          <Mail className="mx-auto size-10 text-muted-foreground/50 mb-3" />
          <p className="text-base font-medium text-foreground">No client messages yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            When clients submit the Contact page form, their inquiries will arrive here.
          </p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {messages.map((m) => (
            <div key={m.id} className="card-lux p-5 flex flex-col justify-between border border-border">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">{m.subject || "General Inquiry"}</h3>
                      {m.status === "Replied" && (
                        <span className="inline-flex items-center gap-1 text-[0.65rem] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold uppercase tracking-wider">
                          <CheckCircle2 className="size-3" /> Replied
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-accent">{m.name}</span>
                      <span>·</span>
                      <span className="text-foreground">{m.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="rounded-md border border-input p-2 text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete inquiry"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-4 p-3.5 bg-muted/40 rounded-xl text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {m.message}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/80 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleOpenReply(m)}
                  className="rounded-md bg-royal px-4 py-2 text-xs text-primary-foreground font-semibold uppercase tracking-wider shadow-glow hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Send className="size-3.5" /> Reply to Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= REPLY MODAL ================= */}
      {replyModalOpen && activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl">Reply to {activeMessage.name}</h2>
                <p className="text-xs text-muted-foreground">
                  Email will be dispatched from <span className="text-accent font-semibold">rabiamukhtar5948@gmail.com</span> to <span className="font-semibold text-foreground">{activeMessage.email}</span>
                </p>
              </div>
              <button onClick={() => setReplyModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="mt-4 space-y-4">
              <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground border border-border">
                <p><strong>Customer Message:</strong> "{activeMessage.message}"</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                  Your Response Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-accent"
                  placeholder="Type your response to the customer..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="rounded-lg border border-input px-4 py-2 text-xs uppercase tracking-wider hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="rounded-lg bg-royal px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingReply ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" /> Send Real Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
