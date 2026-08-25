import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Eye, Package, Calendar } from "lucide-react";
import { money } from "@/shared/lib/products";
import api from "@/shared/services/api";

const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.warn("Failed to fetch seller orders:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const list = orders.filter((o) => filter === "All" || o.status === filter);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">My Store Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer orders containing handcrafted items from your atelier.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all cursor-pointer ${
              filter === s
                ? "bg-royal text-primary-foreground shadow-sm font-semibold"
                : "bg-card text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card-lux overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Order #</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Shipping Destination</th>
              <th className="px-5 py-3">Your Items</th>
              <th className="px-5 py-3">Your Revenue</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
                  Loading store orders from PostgreSQL...
                </td>
              </tr>
            )}
            {!loading &&
              list.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-semibold text-accent">{o.order_number || `#LA-${o.id}`}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">
                    {o.address} {o.city ? `· ${o.city}` : ""}
                  </td>
                  <td className="px-5 py-3">
                    <div className="space-y-1">
                      {Array.isArray(o.items) &&
                        o.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <strong className="text-foreground">{item.product_name}</strong> × {item.quantity}
                          </div>
                        ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-bold text-foreground">{money(parseFloat(o.total_amount))}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusColor[o.status] || "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  No orders found under "{filter}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerOrders;
