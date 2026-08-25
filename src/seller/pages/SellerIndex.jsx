import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { useNavigate } from "@/shared/lib/router";
import { money } from "@/shared/lib/products";
import api from "@/shared/services/api";
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

const statusColor = {
  Delivered: "bg-accent/15 text-accent",
  Shipped: "bg-primary/12 text-primary",
  Processing: "bg-gold/25 text-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-destructive/12 text-destructive"
};

function SellerIndex() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerStats();
      setStats(res);
    } catch (err) {
      console.warn("Failed to fetch seller stats:", err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = [
    {
      label: "My Sales Revenue",
      value: stats?.kpis?.revenue || "$0.00",
      icon: DollarSign,
      link: "/seller/orders",
      color: "text-accent"
    },
    {
      label: "My Orders",
      value: stats?.kpis?.orders || "0",
      icon: ShoppingCart,
      link: "/seller/orders",
      color: "text-primary"
    },
    {
      label: "My Client Base",
      value: stats?.kpis?.customers || "0",
      icon: Users,
      link: "/seller/customers",
      color: "text-accent"
    },
    {
      label: "Active Products",
      value: stats?.kpis?.products || "0",
      icon: Package,
      link: "/seller/products",
      color: "text-gold"
    }
  ];

  const recentOrders = stats?.recentOrders || [];
  const topProducts = stats?.topProducts || [];

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Artisan Workspace Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live sales volume, customer inquiries, and products performance for your store.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Stats
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            onClick={() => navigate({ to: k.link })}
            className="card-lux p-5 cursor-pointer hover:border-accent hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground group-hover:text-foreground font-medium">
                {k.label}
              </p>
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <k.icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{k.value}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-accent">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="size-3.5" /> Artisan Store Performance
              </span>
              <span className="text-[0.68rem] opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Products & Orders Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <div className="card-lux p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">My Top Products</h2>
            <button
              onClick={() => navigate({ to: "/seller/products" })}
              className="text-xs text-accent uppercase tracking-wider font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {topProducts.length === 0 && !loading && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No products created yet. Add your first bespoke fragrance!
            </div>
          )}

          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/60">
                <img
                  src={p.image || "/p-perfume-1.jpg"}
                  alt={p.name}
                  className="size-11 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate text-foreground">{p.name}</p>
                  <p className="text-[0.68rem] text-muted-foreground mt-0.5">
                    Stock: {p.stock} units · Rating: ★ {p.rating}
                  </p>
                </div>
                <p className="font-semibold text-xs text-accent">{money(parseFloat(p.price))}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="card-lux p-5 lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold">Recent Store Orders</h2>
                <p className="text-xs text-muted-foreground">Orders containing items crafted by your atelier.</p>
              </div>
              <button
                onClick={() => navigate({ to: "/seller/orders" })}
                className="text-xs text-accent uppercase tracking-wider font-semibold hover:underline"
              >
                Manage Orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary/60 text-left uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Order #</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">City</th>
                    <th className="px-3 py-2">Your Items</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        <Loader2 className="mx-auto size-5 animate-spin mb-1 text-accent" />
                        Loading orders...
                      </td>
                    </tr>
                  )}
                  {!loading && recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No orders placed for your products yet.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    recentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                        <td className="px-3 py-2.5 font-semibold text-accent">{o.order_number || `#LA-${o.id}`}</td>
                        <td className="px-3 py-2.5 font-medium">{o.customer}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{o.city || "Online"}</td>
                        <td className="px-3 py-2.5">{o.items} items</td>
                        <td className="px-3 py-2.5 font-semibold">{money(parseFloat(o.seller_total))}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                              statusColor[o.status] || "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerIndex;
