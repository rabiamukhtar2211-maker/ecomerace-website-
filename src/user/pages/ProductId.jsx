import { Link, useParams } from "@/shared/lib/router";
import { Heart, Minus, Plus, Shield, Star, Truck, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SiteLayout from "@/user/components/SiteLayout";
import ProductCard from "@/user/components/ProductCard";
import { getProduct, money, products } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  const { add, wishlist, toggleWish } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");
  if (!product) {
    return <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-3xl">Product not found</h1>
          <Link to="/shop" className="mt-6 inline-block text-accent">Back to shop</Link>
        </div>
      </SiteLayout>;
  }
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="grid gap-4">
            <img src={product.image} alt={product.name} width={900} height={1100} className="w-full rounded-lg object-cover shadow-soft" />
            <div className="grid grid-cols-3 gap-4">
              {[product.image, product.image, product.image].map((src, i) => <img key={i} src={src} alt={`${product.name} view ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-md object-cover opacity-80" />)}
            </div>
          </div>

          <div>
            <p className="eyebrow text-accent">{product.category} · {product.family}</p>
            <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.tagline}</p>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted"}`} />)}
              </span>
              <span className="text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{money(product.price)}</span>
              {product.oldPrice && <span className="text-muted-foreground line-through">{money(product.oldPrice)}</span>}
              <span className="text-xs text-muted-foreground">/ {product.size}</span>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border border-input">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3" aria-label="Decrease">
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3" aria-label="Increase">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
    onClick={() => {
      add(product.id, qty);
      toast.success(`${product.name} \xD7 ${qty} added to bag`);
    }}
    className="flex-1 rounded-md bg-royal px-8 py-4 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow"
  >
                Add to bag — {money(product.price * qty)}
              </button>
              <button
    onClick={() => toggleWish(product.id)}
    aria-label="Wishlist"
    className="grid size-13 place-items-center rounded-md border border-input"
  >
                <Heart className={`size-5 ${wishlist.includes(product.id) ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {product.stock > 10 ? "In stock \u2014 ships today" : `Only ${product.stock} left in the atelier`}
            </p>

            <div className="mt-8 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3">
              <p className="flex items-center gap-2"><Truck className="size-4 text-accent" /> Free express $120+</p>
              <p className="flex items-center gap-2"><Undo2 className="size-4 text-accent" /> 30-day returns</p>
              <p className="flex items-center gap-2"><Shield className="size-4 text-accent" /> Authenticity sealed</p>
            </div>

            <div className="mt-10">
              <div className="flex gap-6 border-b border-border">
                {["details", "notes", "reviews"].map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={`pb-3 text-xs tracking-[0.16em] uppercase ${tab === t ? "border-b-2 border-accent text-foreground" : "text-muted-foreground"}`}
  >
                    {t}
                  </button>)}
              </div>
              <div className="pt-5 text-sm text-muted-foreground">
                {tab === "details" && <ul className="grid gap-2">
                    <li>Size: {product.size}</li>
                    <li>Family: {product.family}</li>
                    <li>Vegan, cruelty free, alcohol denat. free formula</li>
                    <li>Made in our Lahore & Grasse ateliers</li>
                  </ul>}
                {tab === "notes" && <ul className="grid gap-2">
                    {product.notes.map((n) => <li key={n}>• {n}</li>)}
                  </ul>}
                {tab === "reviews" && <div className="grid gap-4">
                    <p>"Exactly what I hoped for — refined, not loud." — Sara A.</p>
                    <p>"Second bottle already. Worth every rupee." — Hina R.</p>
                    <p>"Gorgeous packaging, arrived in 3 days." — Nora W.</p>
                  </div>}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl">You may also love</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </SiteLayout>;
}
var stdin_default = ProductPage;
export {
  stdin_default as default
};
