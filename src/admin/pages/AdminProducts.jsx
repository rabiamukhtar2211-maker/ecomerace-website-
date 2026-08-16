import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { money, products as seed } from "@/shared/lib/products";
function AdminProducts() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = rows.filter(
    (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );
  return <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} items in the catalogue.</p>
        </div>
        <button
    onClick={() => toast.success("New product drawer would open here.")}
    className="flex items-center gap-2 rounded-md bg-royal px-5 py-3 text-[0.7rem] tracking-[0.18em] text-primary-foreground uppercase"
  >
          <Plus className="size-4" /> Add product
        </button>
      </div>

      <div className="card-lux flex flex-wrap gap-3 p-4">
        <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search product name…"
    className="min-w-56 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
  />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          {["All", "Perfume", "Skincare", "Gift Set"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card-lux overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} loading="lazy" className="size-11 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.family} · {p.size}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-5 py-3">{money(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock < 15 ? "text-destructive" : ""}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">{p.rating}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toast.info(`Editing ${p.name}`)} className="rounded-md border border-input p-2" aria-label="Edit">
                      <Pencil className="size-3.5" />
                    </button>
                    <button
    onClick={() => {
      setRows((r) => r.filter((x) => x.id !== p.id));
      toast.success(`${p.name} removed`);
    }}
    className="rounded-md border border-input p-2 text-destructive"
    aria-label="Delete"
  >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
var stdin_default = AdminProducts;
export {
  stdin_default as default
};
