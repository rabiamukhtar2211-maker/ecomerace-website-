import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/shared/lib/products";
import ProductCard from "./ProductCard";
import cd from "../../shared/assets/cd.png";
const sorts = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
];
function ShopGrid({
  title,
  subtitle,
  category,
  eyebrow = "Lumière Aura",
}) {
  const base = useMemo(
    () =>
      category
        ? products.filter((p) => p.category === category)
        : products,
    [category]
  );

  const families = useMemo(
    () => ["All", ...new Set(base.map((p) => p.family))],
    [base]
  );

  const [family, setFamily] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [max, setMax] = useState(300);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    let out = base.filter(
      (p) =>
        (family === "All" || p.family === family) &&
        p.price <= max &&
        (p.name + p.tagline + p.family)
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    if (sort === "Price: Low to High") {
      out = [...out].sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      out = [...out].sort((a, b) => b.price - a.price);
    }

    if (sort === "Top Rated") {
      out = [...out].sort((a, b) => b.rating - a.rating);
    }

    return out;
  }, [base, family, sort, max, query]);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[330px] overflow-hidden text-center text-primary-foreground">
        
        {/* Background Image */}
        <img
          src={cd}
          alt="Lumière Aura Collection"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Transparent Purple/Pink Overlay */}
       <div className="absolute inset-0 bg-gradient-to-r from-[#35104F]/10 via-[#7B247F]/65 to-[#C44991]/80" />

        {/* Soft extra overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[330px] flex-col items-center justify-center px-5">
          <p className="eyebrow text-gold opacity-90">
  {eyebrow}
</p>

          <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 opacity-90 md:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[260px_1fr]">
        
        {/* FILTER SIDEBAR */}
        <aside className="card-lux h-fit p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4 text-accent" />
            Refine
          </p>

          {/* Search */}
          <div className="mt-5">
            <label className="eyebrow text-muted-foreground">
              Search
            </label>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rose, serum, oud…"
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          {/* Family */}
          <div className="mt-6">
            <p className="eyebrow text-muted-foreground">
              Family
            </p>

            <div className="mt-3 grid gap-1.5">
              {families.map((f) => (
                <button
                  key={f}
                  onClick={() => setFamily(f)}
                  className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    family === f
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="eyebrow text-muted-foreground">
              Max price: ${max}
            </p>

            <input
              type="range"
              min={28}
              max={300}
              step={2}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-3 w-full accent-accent"
            />
          </div>
        </aside>

        {/* PRODUCTS */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {list.length} products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {list.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { ShopGrid as default };