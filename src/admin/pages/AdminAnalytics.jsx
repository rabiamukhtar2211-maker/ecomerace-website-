import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import { products, salesByMonth } from "@/shared/lib/products";
const split = ["Perfume", "Skincare", "Gift Set"].map((c) => ({
  name: c,
  value: products.filter((p) => p.category === c).length
}));
const colors = ["var(--primary)", "var(--accent)", "var(--gold)"];
const channels = [
  { channel: "Organic search", share: "38%", revenue: "$16,780" },
  { channel: "Instagram", share: "27%", revenue: "$11,910" },
  { channel: "Email (Aura Letters)", share: "19%", revenue: "$8,380" },
  { channel: "Boutique walk-in", share: "11%", revenue: "$4,850" },
  { channel: "Referral", share: "5%", revenue: "$2,200" }
];
function Analytics() {
  return <div className="grid gap-6">
      <div>
        <h1 className="text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Where growth is coming from this quarter.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-lux p-5 lg:col-span-2">
          <h2 className="text-lg">Monthly revenue</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-lux p-5">
          <h2 className="text-lg">Catalogue mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {split.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-lux overflow-x-auto">
        <div className="border-b border-border p-5">
          <h2 className="text-lg">Revenue by channel</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Share</th>
              <th className="px-5 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => <tr key={c.channel} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{c.channel}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.share}</td>
                <td className="px-5 py-3">{c.revenue}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
var stdin_default = Analytics;
export {
  stdin_default as default
};
