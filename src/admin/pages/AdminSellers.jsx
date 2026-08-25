import { useState, useEffect } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Loader2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Package,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { money } from "@/shared/lib/products";
import api from "@/shared/services/api";

const approvalBadge = {
  approved: "bg-accent/15 text-accent border-accent/30",
  pending: "bg-gold/25 text-foreground border-gold/40 animate-pulse",
  rejected: "bg-destructive/15 text-destructive border-destructive/30"
};

const subBadge = {
  active: "bg-accent/15 text-accent",
  suspended: "bg-destructive/15 text-destructive",
  expired: "bg-muted text-muted-foreground"
};

function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // 'all' | 'pending' | 'active' | 'suspended'

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await api.getAllSellers();
      setSellers(res.sellers || []);
    } catch (err) {
      console.warn("Failed to fetch sellers:", err.message);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApproval = async (sellerId, status) => {
    try {
      const res = await api.updateSellerApproval(sellerId, status);
      toast.success(res.message || `Seller marked as ${status}!`);
      setSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, approval_status: status } : s))
      );
    } catch (err) {
      toast.error(err.message || "Failed to update seller approval.");
    }
  };

  const handleSubscriptionToggle = async (sellerId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await api.updateSellerSubscription(sellerId, nextStatus);
      toast.success(res.message || `Subscription ${nextStatus}!`);
      setSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, subscription_status: nextStatus } : s))
      );
    } catch (err) {
      toast.error(err.message || "Failed to toggle subscription.");
    }
  };

  const pendingCount = sellers.filter((s) => s.approval_status === "pending").length;

  const filtered = sellers.filter((s) => {
    if (tab === "pending") return s.approval_status === "pending";
    if (tab === "active") return s.subscription_status === "active" && s.approval_status === "approved";
    if (tab === "suspended") return s.subscription_status === "suspended";
    return true;
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Seller & Artisan Control</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve seller applications, monitor store performance, and manage monthly subscriptions.
          </p>
        </div>
        <button
          onClick={fetchSellers}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Sellers
        </button>
      </div>

      {/* Filter Tabs with Notification Badge */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("all")}
          className={`rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all cursor-pointer ${
            tab === "all"
              ? "bg-royal text-primary-foreground shadow-sm font-semibold"
              : "bg-card text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          All Sellers ({sellers.length})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`relative rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all cursor-pointer ${
            tab === "pending"
              ? "bg-gold text-foreground shadow-sm font-semibold"
              : "bg-card text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          Pending Requests
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center size-5 rounded-full bg-accent text-accent-foreground text-[0.65rem] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("active")}
          className={`rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all cursor-pointer ${
            tab === "active"
              ? "bg-royal text-primary-foreground shadow-sm font-semibold"
              : "bg-card text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          Active Subscriptions
        </button>
        <button
          onClick={() => setTab("suspended")}
          className={`rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all cursor-pointer ${
            tab === "suspended"
              ? "bg-destructive text-destructive-foreground shadow-sm font-semibold"
              : "bg-card text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          Suspended
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
          Loading sellers from PostgreSQL...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card-lux py-16 text-center text-muted-foreground">
          <Store className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <p className="text-base font-medium text-foreground">No sellers found under "{tab}"</p>
          <p className="text-xs text-muted-foreground mt-1">
            When artisans register with the Seller role, their stores will appear here.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="card-lux p-5 border border-border flex flex-col justify-between hover:border-accent/50 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-xl bg-royal text-base text-primary-foreground font-display font-semibold">
                      {s.store_name ? s.store_name[0] : "A"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base leading-tight">
                        {s.store_name || `${s.name}'s Atelier`}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.name} · <span className="text-foreground">{s.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-wider border ${
                      approvalBadge[s.approval_status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.approval_status === "pending" && <Clock className="size-3" />}
                    {s.approval_status === "approved" && <ShieldCheck className="size-3" />}
                    {s.approval_status === "rejected" && <XCircle className="size-3" />}
                    {s.approval_status}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-wider ${
                      subBadge[s.subscription_status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    Sub: {s.subscription_status}
                  </span>
                </div>

                {/* Stats & Plan Grid */}
                <dl className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-xs border border-border/60">
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <Package className="size-3 text-accent" /> Active Products
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{s.products_count || 0} items</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="size-3 text-accent" /> Total Sales
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-accent">{money(parseFloat(s.total_sales) || 0)}</dd>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-border/40 text-[0.7rem] text-muted-foreground">
                    Plan: <strong className="text-foreground">{s.subscription_plan}</strong>
                  </div>
                </dl>
              </div>

              {/* Action Controls */}
              <div className="mt-5 space-y-2 pt-3 border-t border-border">
                {/* Pending Approval Controls */}
                {s.approval_status === "pending" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproval(s.id, "approved")}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="size-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproval(s.id, "rejected")}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold uppercase tracking-wider text-destructive-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      <XCircle className="size-3.5" /> Reject
                    </button>
                  </div>
                )}

                {/* Subscription Controls for Approved Sellers */}
                {s.approval_status === "approved" && (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubscriptionToggle(s.id, s.subscription_status)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        s.subscription_status === "active"
                          ? "border border-destructive/40 text-destructive hover:bg-destructive/10"
                          : "bg-royal text-primary-foreground shadow-glow hover:opacity-90"
                      }`}
                    >
                      {s.subscription_status === "active" ? (
                        <>
                          <PauseCircle className="size-3.5" /> Suspend Subscription
                        </>
                      ) : (
                        <>
                          <PlayCircle className="size-3.5" /> Reactivate Subscription
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSellers;
