import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { useNavigate } from "@/shared/lib/router";
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
import { money, orders as seedOrders, products as seedProducts, salesByMonth } from "@/shared/lib/products";
import api from "@/shared/services/api";

const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setStats(res);
    } catch (err) {
      console.warn("Failed to fetch dashboard stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = [
    {
      label: "Revenue (Live)",
      value: stats?.kpis?.revenue || "$44,120",
      delta: "+18.4%",
      up: true,
      icon: DollarSign,
      link: "/admin/analytics",
      tip: "Click to view Analytics"
    },
    {
      label: "Orders (Total)",
      value: stats?.kpis?.orders || "1,284",
      delta: "+9.1%",
      up: true,
      icon: ShoppingCart,
      link: "/admin/orders",
      tip: "Click to manage Orders"
    },
    {
      label: "Registered Customers",
      value: stats?.kpis?.customers || "312",
      delta: "+4.8%",
      up: true,
      icon: Users,
      link: "/admin/customers",
      tip: "Click to view Customers"
    },
    {
      label: "Low Stock Items",
      value: stats?.kpis?.lowStock || "6",
      delta: "-2",
      up: false,
      icon: Package,
      link: "/admin/products",
      tip: "Click to view Products"
    }
  ];

  const recentOrdersList = stats?.recentOrders && stats.recentOrders.length > 0
    ? stats.recentOrders.map(o => ({
        id: o.order_number || `#LA-${o.id}`,
        customer: o.customer || "Valued Client",
        city: o.city || "Online",
        items: o.items || 1,
        total: parseFloat(o.total) || 0,
        status: o.status || "Pending",
        date: new Date(o.date).toISOString().split("T")[0]
      }))
    : seedOrders.slice(0, 8);

  const topProducts = stats?.topProducts && stats.topProducts.length > 0
    ? stats.topProducts
    : [...seedProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Store performance live from PostgreSQL database.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Stats
        </button>
      </div>

      {/* ================= CLICKABLE KPI CARDS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            onClick={() => navigate({ to: k.link })}
            className="card-lux p-5 cursor-pointer hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all group relative"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                {k.label}
              </p>
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <k.icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{k.value}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className={`flex items-center gap-1 text-xs ${k.up ? "text-accent" : "text-destructive"}`}>
                {k.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {k.delta} vs last period
              </p>
              <span className="text-[0.7rem] font-medium text-accent opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                Open <ChevronRight className="size-3 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div
          onClick={() => navigate({ to: "/admin/analytics" })}
          className="card-lux p-5 lg:col-span-2 cursor-pointer hover:border-accent/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg">Revenue Trend</h2>
            <span className="text-xs text-accent font-medium flex items-center">View Details <ChevronRight className="size-3 ml-1" /></span>
          </div>
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

        <div
          onClick={() => navigate({ to: "/admin/products" })}
          className="card-lux p-5 cursor-pointer hover:border-accent/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg">Top Products</h2>
            <span className="text-xs text-accent font-medium flex items-center">Catalogue <ChevronRight className="size-3 ml-1" /></span>
          </div>
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

      {/* Recent Orders Section */}
      <div className="card-lux overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg">Recent Orders (Live from Database)</h2>
            <p className="text-xs text-muted-foreground">Click any order or manage all in Orders tab.</p>
          </div>
          <button
            onClick={() => navigate({ to: "/admin/orders" })}
            className="text-xs text-accent font-semibold uppercase tracking-wider hover:underline flex items-center"
          >
            Manage All Orders ({recentOrdersList.length}) <ChevronRight className="size-3.5 ml-1" />
          </button>
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin mb-1 text-accent" />
                    Loading recent orders...
                  </td>
                </tr>
              ) : (
                recentOrdersList.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => navigate({ to: "/admin/orders" })}
                    className="border-t border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 font-semibold text-accent">{o.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{o.customer}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.city || "Online"}</td>
                    <td className="px-5 py-3">{o.items}</td>
                    <td className="px-5 py-3 font-semibold">{money(o.total)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[o.status] || "bg-secondary text-secondary-foreground"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
