import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import SiteLayout from "@/user/components/SiteLayout";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
const field = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring";
function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const [done, setDone] = useState(false);
  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 12;
  if (done) {
    return <SiteLayout>
        <div className="mx-auto max-w-lg px-5 py-28 text-center">
          <CheckCircle2 className="mx-auto size-14 text-accent" />
          <h1 className="mt-6 text-4xl">Order confirmed</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Thank you. A confirmation and tracking link are on their way to your inbox. Your parfum is
            wrapped in violet tissue and leaves the atelier today.
          </p>
        </div>
      </SiteLayout>;
  }
  return <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h1 className="text-4xl">Checkout</h1>
        <form
    className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"
    onSubmit={(e) => {
      e.preventDefault();
      clear();
      setDone(true);
    }}
  >
          <div className="grid gap-8">
            <section className="card-lux p-6">
              <h2 className="text-xl">Contact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-muted-foreground">Full name<input required className={field} /></label>
                <label className="text-xs text-muted-foreground">Email<input required type="email" className={field} /></label>
                <label className="text-xs text-muted-foreground">Phone<input required className={field} /></label>
                <label className="text-xs text-muted-foreground">City<input required className={field} /></label>
              </div>
            </section>

            <section className="card-lux p-6">
              <h2 className="text-xl">Shipping address</h2>
              <div className="mt-4 grid gap-4">
                <label className="text-xs text-muted-foreground">Street address<input required className={field} /></label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-muted-foreground">Postal code<input required className={field} /></label>
                  <label className="text-xs text-muted-foreground">State<input className={field} /></label>
                  <label className="text-xs text-muted-foreground">Country<input required className={field} /></label>
                </div>
              </div>
            </section>

            <section className="card-lux p-6">
              <h2 className="text-xl">Payment</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <label className="flex items-center gap-3"><input type="radio" name="pay" defaultChecked className="accent-accent" /> Credit / debit card</label>
                <label className="flex items-center gap-3"><input type="radio" name="pay" className="accent-accent" /> Cash on delivery</label>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-muted-foreground sm:col-span-2">Card number<input placeholder="4242 4242 4242 4242" className={field} /></label>
                <label className="text-xs text-muted-foreground">Expiry<input placeholder="MM/YY" className={field} /></label>
                <label className="text-xs text-muted-foreground">CVC<input placeholder="123" className={field} /></label>
              </div>
            </section>
          </div>

          <aside className="card-lux h-fit p-6">
            <h2 className="text-xl">Your order</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {detailed.map(({ product, qty }) => <li key={product.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{product.name} × {qty}</span>
                  <span>{money(product.price * qty)}</span>
                </li>)}
              {detailed.length === 0 && <li className="text-muted-foreground">Bag is empty.</li>}
            </ul>
            <dl className="mt-5 grid gap-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(subtotal + shipping)}</dd></div>
            </dl>
            <button className="mt-6 w-full rounded-md bg-royal py-4 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow">
              Place order
            </button>
          </aside>
        </form>
      </div>
    </SiteLayout>;
}
var stdin_default = Checkout;
export {
  stdin_default as default
};
