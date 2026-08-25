import { Link } from "@/shared/lib/router";
import { Heart, Star, Store } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";

function ProductCard({ product }) {
  const { add, wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(String(product.id));

  return (
    <article className="group card-lux overflow-hidden rounded-xl border border-border bg-card shadow-xs hover:shadow-md transition-all duration-300">
      {/* Reduced Height Image Container (Square aspect ratio for shorter card height) */}
      <div className="relative aspect-[1/0.95] overflow-hidden bg-muted">
        <Link to={`/product/${product.id}`} className="block size-full">
          <img
            src={product.image || "/p-perfume-1.jpg"}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/p-perfume-1.jpg";
            }}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Gradient Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-royal px-2.5 py-0.5 text-[0.58rem] tracking-[0.14em] text-primary-foreground font-semibold uppercase shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Floating Circular Wishlist Button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => {
            toggleWish(product.id);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-card/90 backdrop-blur-xs text-foreground transition-all hover:scale-110 hover:text-accent cursor-pointer shadow-xs"
        >
          <Heart className={`size-3.5 ${wished ? "fill-accent text-accent" : ""}`} />
        </button>

        {/* Hover Add to Bag */}
        <button
          type="button"
          onClick={() => {
            add(product);
            toast.success(`${product.name} added to bag`);
          }}
          className="absolute inset-x-2.5 bottom-2.5 translate-y-12 rounded-md bg-royal py-2 text-[0.65rem] tracking-[0.18em] text-primary-foreground uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer shadow-glow font-semibold"
        >
          Add to bag
        </button>
      </div>

      {/* Info Section with Compact Height */}
      <div className="p-3 bg-card">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-muted-foreground tracking-[0.16em] text-[0.62rem] uppercase font-medium">
            {product.family || product.category || "Luxury"}
          </p>
          {product.store_name && (
            <span className="inline-flex items-center gap-1 text-[0.6rem] text-accent font-medium truncate max-w-[120px]">
              <Store className="size-2.5 shrink-0" /> {product.store_name}
            </span>
          )}
        </div>

        <h3 className="mt-0.5 font-display text-base text-foreground leading-snug truncate group-hover:text-accent transition-colors">
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <p className="mt-0.5 line-clamp-1 text-[0.72rem] text-muted-foreground">
          {product.tagline || `${product.category} · ${product.size || "100 ml"}`}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-xs">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-foreground">{money(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[0.68rem] text-muted-foreground line-through">{money(product.oldPrice)}</span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[0.72rem] text-muted-foreground font-medium">
            <Star className="size-3 fill-gold text-gold" />
            {product.rating || 5.0}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
