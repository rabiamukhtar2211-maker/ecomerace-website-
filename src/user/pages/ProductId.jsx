import { Link, useParams } from "@/shared/lib/router";
import { Heart, Minus, Plus, Shield, Star, Truck, Undo2, Loader2, Store, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import SiteLayout from "@/user/components/SiteLayout";
import ProductCard from "@/user/components/ProductCard";
import { getProduct as getLocalProduct, money, products as localProducts } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
import api from "@/shared/services/api";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const { add, wishlist, toggleWish } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // 1. Fetch live product from PostgreSQL database
        const res = await api.getProductById(id);
        if (res.product) {
          const p = res.product;
          const mappedProduct = {
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
            image: p.image || "/p-perfume-1.jpg",
            badge: p.badge,
            store_name: p.store_name || "Lumière Atelier",
            seller_name: p.seller_name,
            notes: Array.isArray(p.notes) ? p.notes : ["Signature Accord", "Luxury Essence"],
          };
          setProduct(mappedProduct);
          setActiveImage(mappedProduct.image);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Falling back to local product record:", err.message);
      }

      // 2. Fallback to local products only if DB query fails or offline
      const local = getLocalProduct(id);
      if (local) {
        setProduct(local);
        setActiveImage(local.image);
      }
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-32 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-accent mb-3" />
          <p className="text-sm text-muted-foreground">Loading bespoke luxury product...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-3xl font-display">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This product may have been archived or removed.</p>
          <Link to="/shop" className="mt-6 inline-block text-accent font-semibold underline">
            Back to shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const mainDisplayImage = activeImage || product.image || "/p-perfume-1.jpg";
  const related = localProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-6 sm:py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="mt-6 sm:mt-8 grid gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Product Gallery */}
          <div className="grid gap-3 sm:gap-4">
            <div className="relative aspect-square sm:aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-soft border border-border">
              <img
                src={mainDisplayImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/p-perfume-1.jpg";
                }}
                className="size-full object-cover transition-all duration-500"
              />
            </div>

            {/* Thumbnail Preview Selector */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[mainDisplayImage, mainDisplayImage, mainDisplayImage].map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className="aspect-square w-full rounded-xl overflow-hidden border border-border/80 bg-muted cursor-pointer hover:border-accent transition-colors"
                >
                  <img
                    src={src}
                    alt={`${product.name} preview ${i + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/p-perfume-1.jpg";
                    }}
                    className="size-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="eyebrow text-accent text-xs">{product.category} · {product.family}</p>
              {product.stock < 10 && (
                <span className="text-xs text-destructive font-semibold">Only {product.stock} left in stock</span>
              )}
            </div>

            <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{product.tagline}</p>

            {/* Seller / Store Identity Card */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-lg bg-royal text-primary-foreground font-semibold">
                  <Store className="size-4" />
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">Sold & Dispatched by</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm leading-tight">
                    {product.store_name || "Lumière Official Atelier"}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[0.65rem] sm:text-[0.68rem] font-semibold text-accent border border-accent/30">
                <Sparkles className="size-3" /> Verified Artisan
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs sm:text-sm">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3.5 sm:size-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted"}`} />
                ))}
              </span>
              <span className="text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            </div>

            <div className="mt-4 sm:mt-6 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold text-foreground">{money(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">{money(product.oldPrice)}</span>
              )}
              <span className="text-xs text-muted-foreground">/ {product.size}</span>
            </div>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center rounded-xl border border-input bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Decrease"
                >
                  <Minus className="size-3.5 sm:size-4" />
                </button>
                <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Increase"
                >
                  <Plus className="size-3.5 sm:size-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) add(product);
                  toast.success(`Added ${qty} × ${product.name} to bag`);
                }}
                className="flex-1 rounded-xl bg-royal py-3 sm:py-3.5 text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all cursor-pointer"
              >
                Add to bag · {money(product.price * qty)}
              </button>

              <button
                onClick={() => {
                  toggleWish(product.id);
                  toast.success(wishlist.includes(product.id) ? "Removed from wishlist" : "Saved to wishlist");
                }}
                className="rounded-xl border border-input p-3 sm:p-3.5 hover:bg-muted text-foreground cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`size-4 sm:size-5 ${wishlist.includes(product.id) ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 border-t border-border pt-5 sm:pt-6 text-[0.68rem] sm:text-xs text-muted-foreground">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2">
                <Truck className="size-4 text-accent shrink-0" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2">
                <Shield className="size-4 text-accent shrink-0" />
                <span>100% Authentic</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2">
                <Undo2 className="size-4 text-accent shrink-0" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Olfactory / Product details tab */}
        <div className="mt-12 sm:mt-16 border-t border-border pt-8 sm:pt-10">
          <div className="flex gap-6 sm:gap-8 border-b border-border text-xs sm:text-sm">
            {["details", "notes", "shipping"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2.5 sm:pb-3 font-medium uppercase tracking-[0.14em] transition-all cursor-pointer ${
                  tab === t ? "border-b-2 border-accent text-accent font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="py-5 sm:py-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {tab === "details" && (
              <p>
                Handcrafted with rare essences and organic botanicals. Formulated for longevity and delicate skin tolerance. Phthalate-free, vegan, and cruelty-free.
              </p>
            )}
            {tab === "notes" && (
              <div className="flex flex-wrap gap-2">
                {product.notes?.map((n) => (
                  <span key={n} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground font-medium">
                    {n}
                  </span>
                ))}
              </div>
            )}
            {tab === "shipping" && (
              <p>
                Dispatched directly from the verified artisan within 24-48 hours. Secure temperature-controlled packaging guaranteed.
              </p>
            )}
          </div>
        </div>

        {/* Related items (2-column on mobile) */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-16 border-t border-border pt-10 sm:pt-12">
            <h2 className="text-xl sm:text-2xl font-display">You may also admire</h2>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default ProductPage;
