import { Link } from "@/shared/lib/router";
import { Minus, Plus, Trash2 } from "lucide-react";
import SiteLayout from "@/user/components/SiteLayout";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
function CartPage() {
  const { detailed, subtotal, setQty, remove } = useCart();
  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 12;
  return <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h1 className="text-4xl">Your bag</h1>

        {detailed.length === 0 ? <div className="card-lux mt-10 p-16 text-center">
            <p className="text-muted-foreground">Your bag is still empty.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-md bg-royal px-7 py-3 text-[0.7rem] tracking-[0.2em] text-primary-foreground uppercase">
              Start shopping
            </Link>
          </div> : <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              {detailed.map(({ product, qty }) => <div key={product.id} className="card-lux flex gap-4 p-4">
                  <img src={product.image} alt={product.name} loading="lazy" className="size-28 shrink-0 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg">
                          <Link to="/product/$id" params={{ id: product.id }}>{product.name}</Link>
                        </h2>
                        <p className="text-xs text-muted-foreground">{product.family} · {product.size}</p>
                      </div>
                      <button onClick={() => remove(product.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-input">
                        <button onClick={() => setQty(product.id, qty - 1)} className="px-2.5 py-2" aria-label="Decrease">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="px-2.5 py-2" aria-label="Increase">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{money(product.price * qty)}</p>
                    </div>
                  </div>
                </div>)}
            </div>

            <aside className="card-lux h-fit p-6">
              <h2 className="text-xl">Order summary</h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{money(subtotal + shipping)}</dd></div>
              </dl>
              <Link to="/checkout" className="mt-6 block rounded-md bg-royal py-4 text-center text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow">
                Proceed to checkout
              </Link>
              <p className="mt-4 text-center text-xs text-muted-foreground">3 complimentary samples included</p>
            </aside>
          </div>}
      </div>
    </SiteLayout>;
}
var stdin_default = CartPage;
export {
  stdin_default as default
};
