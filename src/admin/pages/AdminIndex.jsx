import { ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { money, orders, products, salesByMonth } from "@/shared/lib/products";
const kpis = [
  { label: "Revenue (30d)", value: "$44,120", delta: "+18.4%", up: true, icon: DollarSign },
  { label: "Orders (30d)", value: "1,284", delta: "+9.1%", up: true, icon: ShoppingCart },
  { label: "New customers", value: "312", delta: "+4.8%", up: true, icon: Users },
  { label: "Low stock items", value: "6", delta: "-2", up: false, icon: Package }
];
const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};
function Dashboard() {
  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  return <div className="grid gap-6">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Store performance for the last 30 days.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <div key={k.label} className="card-lux p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <k.icon className="size-4 text-accent" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{k.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-accent" : "text-destructive"}`}>
              {k.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {k.delta} vs last period
            </p>
          </div>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-lux p-5 lg:col-span-2">
          <h2 className="text-lg">Revenue trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByMonth}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-lux p-5">
          <h2 className="text-lg">Top products by reviews</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts.map((p) => ({ name: p.name.split(" ")[0], reviews: p.reviews }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="reviews" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-lux overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg">Recent orders</h2>
          <span className="text-xs text-muted-foreground">{orders.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{o.id}</td>
                  <td className="px-5 py-3">{o.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.city}</td>
                  <td className="px-5 py-3">{o.items}</td>
                  <td className="px-5 py-3">{money(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusColor[o.status]}`}>{o.status}</span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
var stdin_default = Dashboard;
export {
  stdin_default as default
};
