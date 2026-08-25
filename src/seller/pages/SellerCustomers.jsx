import { useState, useEffect } from "react";
import { Mail, Loader2, RefreshCw, Users, Send, X } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/shared/lib/products";
import api from "@/shared/services/api";

const tierColor = {
  Platinum: "bg-royal text-primary-foreground",
  Gold: "bg-gold/30 text-foreground",
  Silver: "bg-secondary text-secondary-foreground",
  Bronze: "bg-muted text-muted-foreground"
};

function SellerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.warn("Failed to fetch seller customers:", err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenEmailModal = (customer) => {
    setActiveCustomer(customer);
    setSubject("A Message from Your Artisan Atelier (Lumière Aura)");
    setEmailBody(`Dear ${customer.name},\n\nThank you for choosing our artisan collection. Regarding your recent order, `);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailBody.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setSendingEmail(true);
    try {
      const res = await api.sendCustomerEmail({
        toEmail: activeCustomer.email,
        toName: activeCustomer.name,
        subject,
        message: emailBody
      });
      toast.success(res.message || `Email sent successfully to ${activeCustomer.email}!`);
      setIsEmailModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to dispatch email.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">My Client Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} buyers who have purchased items crafted by your atelier.
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh List
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
          Loading your store customers from PostgreSQL...
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="card-lux py-16 text-center text-muted-foreground">
          <Users className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <p className="text-base font-medium text-foreground">No customer orders yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            When clients purchase your products, their details will appear exclusively here.
          </p>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {customers.map((c) => (
            <div key={c.email} className="card-lux p-5 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full bg-royal text-sm text-primary-foreground font-semibold">
                      {c.name ? c.name.split(" ").map((n) => n[0]).join("") : "C"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[0.65rem] tracking-[0.1em] uppercase font-semibold ${tierColor[c.tier] || "bg-muted text-muted-foreground"}`}>
                    {c.tier}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-2 text-center text-xs rounded-xl bg-muted/40 p-3 border border-border/60">
                  <div>
                    <dt className="text-muted-foreground">Store Orders</dt>
                    <dd className="mt-1 text-base font-bold text-foreground">{c.orders}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total Spent</dt>
                    <dd className="mt-1 text-base font-bold text-accent">{money(c.spent)}</dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEmailModal(c)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-2.5 text-xs tracking-[0.14em] uppercase text-primary-foreground shadow-glow hover:opacity-90 transition-all cursor-pointer font-semibold"
              >
                <Mail className="size-3.5" /> Email Client
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= EMAIL COMPOSE MODAL ================= */}
      {isEmailModalOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl">Contact {activeCustomer.name}</h2>
                <p className="text-xs text-muted-foreground">
                  Send real email directly to <span className="font-semibold text-foreground">{activeCustomer.email}</span>
                </p>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Email Subject
                </label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="rounded-lg border border-input px-4 py-2 text-xs uppercase tracking-wider hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="rounded-lg bg-royal px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  {sendingEmail ? (
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

export default SellerCustomers;
