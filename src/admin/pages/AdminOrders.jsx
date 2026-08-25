import { useState, useEffect } from "react";
import { Eye, Loader2, RefreshCw, X, Package, MapPin, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/shared/lib/products";
import api from "@/shared/services/api";

const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};

function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // View Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      if (res.orders) {
        const mapped = res.orders.map((o) => ({
          id: o.order_number || `#LA-${o.id}`,
          dbId: o.id,
          customer: o.customer_name,
          email: o.email,
          date: new Date(o.created_at).toLocaleDateString(),
          items: o.items_count || (Array.isArray(o.items) ? o.items.length : 1),
          total: Number(o.total_amount),
          status: o.status || "Pending",
          city: o.city,
          address: o.address,
          payment_method: o.payment_method,
          itemsList: o.items || []
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.warn("Failed to fetch orders:", err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    try {
      if (order.dbId) {
        await api.updateOrderStatus(order.dbId, newStatus);
      }
      setRows((r) => r.map((x) => (x.id === order.id ? { ...x, status: newStatus } : x)));
      toast.success(`${order.id} marked ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update order status.");
    }
  };

  const list = rows.filter((o) => filter === "All" || o.status === filter);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Orders Fulfilment</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total orders recorded live in PostgreSQL database.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Orders
        </button>
      </div>

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

      <div className="card-lux overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Order #</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
                  Loading live orders from PostgreSQL...
                </td>
              </tr>
            )}
            {!loading &&
              list.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-semibold text-accent">{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{o.customer}</p>
                    <p className="text-xs text-muted-foreground">{o.email} {o.city ? `· ${o.city}` : ""}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{o.date}</td>
                  <td className="px-5 py-3">{o.items} items</td>
                  <td className="px-5 py-3 font-bold text-foreground">{money(o.total)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs border border-border font-semibold cursor-pointer ${
                        statusColor[o.status] || "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {statuses.slice(1).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="rounded-md border border-input p-2 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                      title="View order details"
                      aria-label="View order"
                    >
                      <Eye className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No orders found under "{filter}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl">Order Details: {selectedOrder.id}</h2>
                <p className="text-xs text-muted-foreground">Placed on {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                <div>
                  <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block">Customer</span>
                  <strong className="text-foreground text-sm">{selectedOrder.customer}</strong>
                  <p className="text-muted-foreground mt-0.5">{selectedOrder.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block">Payment & Status</span>
                  <p className="font-semibold text-foreground">{selectedOrder.payment_method || "COD"}</p>
                  <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 font-bold ${statusColor[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-xl border border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block flex items-center gap-1">
                  <MapPin className="size-3 text-accent" /> Delivery Address
                </span>
                <p className="text-foreground mt-1 text-sm">{selectedOrder.address} {selectedOrder.city ? `· ${selectedOrder.city}` : ""}</p>
              </div>

              <div>
                <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block mb-2 font-semibold">
                  Items Purchased ({selectedOrder.itemsList?.length || selectedOrder.items})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.itemsList && selectedOrder.itemsList.length > 0 ? (
                    selectedOrder.itemsList.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-background border border-border/60">
                        <div>
                          <p className="font-semibold text-foreground">{it.product_name}</p>
                          <p className="text-[0.68rem] text-muted-foreground">Qty: {it.quantity} × {money(parseFloat(it.price))}</p>
                        </div>
                        <span className="font-bold text-accent">{money(parseFloat(it.total))}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 rounded-lg bg-background text-muted-foreground">
                      {selectedOrder.items} item(s) included in parcel.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border text-sm">
                <span className="font-semibold text-foreground">Grand Total:</span>
                <span className="font-display font-bold text-lg text-accent">{money(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-royal px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground font-semibold cursor-pointer shadow-glow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
