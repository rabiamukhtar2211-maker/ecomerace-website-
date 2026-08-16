import { useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { money, orders as seed } from "@/shared/lib/products";
const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};
function AdminOrders() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("All");
  const list = rows.filter((o) => filter === "All" || o.status === filter);
  return <div className="grid gap-6">
      <div>
        <h1 className="text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track fulfilment and update status inline.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => <button
    key={s}
    onClick={() => setFilter(s)}
    className={`rounded-full px-4 py-2 text-xs tracking-[0.12em] uppercase ${filter === s ? "bg-royal text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
  >
            {s}
          </button>)}
      </div>

      <div className="card-lux overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => <tr key={o.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{o.id}</td>
                <td className="px-5 py-3">
                  <p>{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-5 py-3">{o.items}</td>
                <td className="px-5 py-3">{money(o.total)}</td>
                <td className="px-5 py-3">
                  <select
    value={o.status}
    onChange={(e) => {
      const status = e.target.value;
      setRows((r) => r.map((x) => x.id === o.id ? { ...x, status } : x));
      toast.success(`${o.id} marked ${status}`);
    }}
    className={`rounded-full px-3 py-1 text-xs ${statusColor[o.status]}`}
  >
                    {statuses.slice(1).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => toast.info(`Opening ${o.id}`)} className="rounded-md border border-input p-2" aria-label="View order">
                    <Eye className="size-3.5" />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
var stdin_default = AdminOrders;
export {
  stdin_default as default
};
