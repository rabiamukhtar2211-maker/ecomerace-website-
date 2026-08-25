import { Link } from "@/shared/lib/router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import SiteLayout from "@/user/components/SiteLayout";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";

function CartPage() {
  const { detailed, subtotal, setQty, remove } = useCart();
  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 12;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h1 className="text-4xl font-display">Your Shopping Bag</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your handcrafted items before proceeding to checkout.
        </p>

        {detailed.length === 0 ? (
          <div className="card-lux mt-10 p-16 text-center">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold">Your bag is currently empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore our fine fragrances, skincare rituals, and artisan collections.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-xl bg-royal px-8 py-3.5 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase shadow-glow hover:opacity-90 transition-opacity"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-4">
              {detailed.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="card-lux flex flex-col sm:flex-row gap-4 p-4 border border-border"
                >
                  <img
                    src={product.image || "/p-perfume-1.jpg"}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/p-perfume-1.jpg";
                    }}
                    className="size-28 shrink-0 rounded-xl object-cover bg-muted border border-border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold font-display text-foreground hover:text-accent transition-colors">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.family || product.category || "Luxury"} · {product.size || "100 ml"}
                          </p>
                          {product.store_name && (
                            <p className="text-[0.68rem] font-medium text-accent mt-1">
                              Sold by: {product.store_name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(product.id)}
                          aria-label="Remove item"
                          className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="flex items-center rounded-lg border border-input bg-card">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-foreground">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-base font-bold text-foreground">
                        {money(product.price * qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card-lux h-fit p-6 border border-border">
              <h2 className="text-xl font-display font-semibold">Order Summary</h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold text-foreground">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-semibold text-foreground">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Complimentary</span>
                    ) : (
                      money(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-foreground">
                  <dt>Estimated Total</dt>
                  <dd className="text-accent text-lg">{money(subtotal + shipping)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-royal py-4 text-center text-xs font-semibold tracking-[0.2em] text-primary-foreground uppercase shadow-glow hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>
              <p className="mt-4 text-center text-[0.7rem] text-muted-foreground">
                ✨ 3 complimentary luxury samples included with order
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default CartPage;
