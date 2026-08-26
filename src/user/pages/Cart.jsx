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
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-display">Your Shopping Bag</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Review your handcrafted items before proceeding to checkout.
        </p>

        {detailed.length === 0 ? (
          <div className="card-lux mt-8 sm:mt-10 p-10 sm:p-16 text-center rounded-2xl">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold">Your bag is currently empty</h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Explore our fine fragrances, skincare rituals, and artisan collections.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-xl bg-royal px-7 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase shadow-glow hover:opacity-90 transition-opacity"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-3 sm:gap-4">
              {detailed.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="card-lux flex gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-2xl"
                >
                  <img
                    src={product.image || "/p-perfume-1.jpg"}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/p-perfume-1.jpg";
                    }}
                    className="size-20 sm:size-28 shrink-0 rounded-xl object-cover bg-muted border border-border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold font-display text-foreground hover:text-accent transition-colors leading-snug">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h2>
                          <p className="text-[0.68rem] sm:text-xs text-muted-foreground mt-0.5">
                            {product.family || product.category || "Luxury"} · {product.size || "100 ml"}
                          </p>
                          {product.store_name && (
                            <p className="text-[0.62rem] sm:text-[0.68rem] font-medium text-accent mt-0.5">
                              Sold by: {product.store_name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(product.id)}
                          aria-label="Remove item"
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/60">
                      <div className="flex items-center rounded-lg border border-input bg-card">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="px-2.5 py-1 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs font-semibold text-foreground">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="px-2.5 py-1 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-foreground">
                        {money(product.price * qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="card-lux h-fit p-5 sm:p-6 rounded-2xl border border-border">
              <h2 className="text-lg sm:text-xl font-display">Order Summary</h2>
              <dl className="mt-4 grid gap-2.5 border-t border-border pt-4 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal ({detailed.length} items)</dt>
                  <dd className="font-medium text-foreground">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Standard Delivery</dt>
                  <dd className="font-medium text-foreground">{shipping === 0 ? "Free" : money(shipping)}</dd>
                </div>
                {shipping === 0 && (
                  <p className="text-[0.68rem] text-accent font-medium">
                    ✨ Complimentary shipping applied!
                  </p>
                )}
                <div className="flex justify-between text-base font-bold border-t border-border pt-3 mt-1 text-foreground">
                  <dt>Estimated Total</dt>
                  <dd className="text-accent">{money(subtotal + shipping)}</dd>
                </div>
              </dl>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase shadow-glow hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>
              <p className="mt-3 text-center text-[0.68rem] text-muted-foreground">
                🔒 Safe & encrypted. Cash on Delivery (COD) available.
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default CartPage;
