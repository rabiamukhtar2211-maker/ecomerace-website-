import { Link } from "@/shared/lib/router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
function ProductCard({ product }) {
  const { add, wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(product.id);
  return <article className="group card-lux overflow-hidden">
      <div className="relative aspect-4/5 overflow-hidden bg-muted">
       <Link to={`/product/${product.id}`}>
          <img
    src={product.image}
    alt={product.name}
    loading="lazy"
    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
        </Link>
        {product.badge && <span className="absolute top-3 left-3 rounded-full bg-royal px-3 py-1 text-[0.6rem] tracking-[0.16em] text-primary-foreground uppercase">
            {product.badge}
          </span>}
        <button
    aria-label="Add to wishlist"
    onClick={() => {
      toggleWish(product.id);
      toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
    }}
    className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-card/90 text-foreground transition-colors hover:text-accent"
  >
          <Heart className={`size-4 ${wished ? "fill-accent text-accent" : ""}`} />
        </button>
        <button
    onClick={() => {
      add(product.id);
      toast.success(`${product.name} added to bag`);
    }}
    className="absolute inset-x-3 bottom-3 translate-y-14 rounded-md bg-royal py-3 text-[0.7rem] tracking-[0.18em] text-primary-foreground uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
  >
          Add to bag
        </button>
      </div>

      <div className="p-4">
        <p className="eyebrow text-muted-foreground">{product.family}</p>
        <h3 className="mt-1 text-lg">
          <Link to="/product/$id" params={{ id: product.id }}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{money(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{money(product.oldPrice)}</span>}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>
      </div>
    </article>;
}
export {
  ProductCard as default
};
