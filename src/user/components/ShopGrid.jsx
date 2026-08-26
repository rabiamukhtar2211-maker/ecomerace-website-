import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, Loader2, ChevronLeft, ChevronRight, RotateCcw, X, Filter } from "lucide-react";
import { products as localProducts } from "@/shared/lib/products";
import api from "@/shared/services/api";
import ProductCard from "./ProductCard";
import cd from "../../shared/assets/cd.png";

const sorts = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
];

const PRODUCTS_PER_PAGE = 9;

function ShopGrid({
  title,
  subtitle,
  category,
  eyebrow = "Lumière Aura",
}) {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch live products from PostgreSQL API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await api.getProducts(category ? { category } : {});
        if (res.products && res.products.length > 0) {
          const mapped = res.products.map((p) => ({
            id: p.slug || String(p.id),
            dbId: p.id,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            price: Number(p.price),
            oldPrice: p.old_price ? Number(p.old_price) : undefined,
            category: p.category,
            family: p.family || "Luxury",
            size: p.size || "100 ml",
            rating: Number(p.rating || 5.0),
            reviews: p.reviews || 0,
            stock: p.stock || 20,
            image: p.image,
            badge: p.badge,
            store_name: p.store_name,
            seller_name: p.seller_name,
            notes: Array.isArray(p.notes) ? p.notes : [],
          }));
          setDbProducts(mapped);
        } else {
          setDbProducts(category ? localProducts.filter((p) => p.category === category) : localProducts);
        }
      } catch (err) {
        console.warn("Using fallback local products:", err.message);
        setDbProducts(category ? localProducts.filter((p) => p.category === category) : localProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  const base = useMemo(() => dbProducts, [dbProducts]);

  const maxProductPrice = useMemo(() => {
    if (base.length === 0) return 50000;
    const highest = Math.max(...base.map((p) => Number(p.price) || 0), 1000);
    return Math.ceil(highest / 100) * 100;
  }, [base]);

  const families = useMemo(
    () => ["All", ...new Set(base.map((p) => p.family).filter(Boolean))],
    [base]
  );

  const [family, setFamily] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [userMax, setUserMax] = useState(null);
  const [query, setQuery] = useState("");

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [family, sort, userMax, query, category]);

  const list = useMemo(() => {
    let out = base.filter(
      (p) =>
        (family === "All" || p.family === family) &&
        (userMax === null || p.price <= userMax) &&
        (p.name + (p.tagline || "") + (p.family || "") + (p.store_name || ""))
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    if (sort === "Price: Low to High") out.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") out.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") out.sort((a, b) => (b.rating || 5) - (a.rating || 5));

    return out;
  }, [base, family, sort, userMax, query]);

  // Pagination calculation
  const totalPages = Math.ceil(list.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, list.length);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return list.slice(start, start + PRODUCTS_PER_PAGE);
  }, [list, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  const hasActiveFilters = family !== "All" || userMax !== null || query;

  return (
    <div className="bg-background text-foreground">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden text-center text-white">
        <img
          src={cd}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Transparent Overlay matching Journal and About */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#35104F]/10 via-[#7B247F]/65 to-[#C44991]/80" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[260px] sm:min-h-[330px] flex-col items-center justify-center px-5 py-12 sm:py-16">
          <p className="eyebrow text-gold opacity-90 text-xs sm:text-sm">{eyebrow}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed opacity-90 md:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 py-8 sm:py-14 lg:grid-cols-[260px_1fr]">
        
        {/* Mobile Filter Toggle & Search Bar */}
        <div className="flex lg:hidden flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collection…"
                className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs outline-none focus:border-ring"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-2.5 text-muted-foreground">
                  <X className="size-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                hasActiveFilters || mobileFilterOpen
                  ? "bg-royal text-primary-foreground border-royal"
                  : "bg-card border-input text-foreground hover:bg-muted"
              }`}
            >
              <Filter className="size-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="size-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Family Chips for Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {families.slice(0, 6).map((f) => (
              <button
                key={f}
                onClick={() => setFamily(f)}
                className={`shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-medium transition-colors ${
                  family === f
                    ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* FILTER SIDEBAR (Desktop & Collapsible on Mobile) */}
        <aside className={`${mobileFilterOpen ? "block" : "hidden"} lg:block card-lux h-fit p-5 rounded-2xl`}>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-accent" />
              Refine Filters
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setFamily("All");
                  setUserMax(null);
                  setQuery("");
                }}
                className="text-[0.68rem] text-accent font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mt-5 hidden lg:block">
            <label className="eyebrow text-muted-foreground">Search Collection</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, brand, store…"
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          {/* Family */}
          <div className="mt-5">
            <p className="eyebrow text-muted-foreground">Fragrance & Skin Family</p>
            <div className="mt-3 grid gap-1.5">
              {families.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFamily(f);
                    setMobileFilterOpen(false);
                  }}
                  className={`rounded-md px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                    family === f
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-muted-foreground text-xs">
                Max: {userMax !== null ? `$${userMax.toLocaleString()}` : "All Prices"}
              </p>
              {userMax !== null && (
                <button
                  onClick={() => setUserMax(null)}
                  className="text-[0.65rem] text-accent hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="range"
              min={10}
              max={maxProductPrice}
              step={Math.max(10, Math.floor(maxProductPrice / 100))}
              value={userMax !== null ? userMax : maxProductPrice}
              onChange={(e) => setUserMax(Number(e.target.value))}
              className="mt-3 w-full accent-accent cursor-pointer"
            />
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div>
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <p className="text-muted-foreground text-xs sm:text-sm">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-accent" /> Loading products...
                </span>
              ) : list.length > 0 ? (
                `Showing ${startIndex}–${endIndex} of ${list.length} products`
              ) : (
                "0 products found"
              )}
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer outline-none font-medium text-foreground"
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 2-Column Mobile & 3-Column Desktop Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {!loading && list.length === 0 && (
            <div className="py-16 text-center text-muted-foreground card-lux p-8 rounded-2xl">
              <p className="text-base font-semibold text-foreground">No products match your active filters.</p>
              <p className="text-xs text-muted-foreground mt-1">Try resetting the filter options above.</p>
              <button
                type="button"
                onClick={() => {
                  setFamily("All");
                  setUserMax(null);
                  setQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-royal px-5 py-2.5 text-xs font-semibold text-primary-foreground uppercase tracking-wider shadow-glow"
              >
                <RotateCcw className="size-3" /> Reset all filters
              </button>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
              <p className="text-xs text-muted-foreground">
                Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="size-4" /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`size-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-royal text-primary-foreground shadow-glow"
                            : "border border-input bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopGrid;