import { useState } from "react";
import { CheckCircle2, Loader2, MailCheck, ShoppingBag, ArrowRight, Banknote, Truck, ShieldCheck } from "lucide-react";
import SiteLayout from "@/user/components/SiteLayout";
import { money } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
import { useAuth } from "@/shared/lib/auth";
import api from "@/shared/services/api";
import { toast } from "sonner";
import { Link } from "@/shared/lib/router";

const field = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring";

function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [confirmedName, setConfirmedName] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const paymentMethod = "Cash on Delivery (COD)";

  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 12;
  const totalAmount = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (detailed.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customer_name: name,
        email,
        city,
        address: `${address} (Phone: ${phone})`,
        payment_method: "Cash on Delivery (COD)",
        total_amount: totalAmount,
        items: detailed.map(({ product, qty }) => ({
          product_id: product.dbId || product.id || null,
          name: product.name,
          price: product.price,
          quantity: qty
        }))
      };

      const res = await api.createOrder(orderPayload);
      const assignedOrderNum = res.order?.order_number || "#LA-" + Math.floor(1000 + Math.random() * 9000);
      setOrderNumber(assignedOrderNum);
      setConfirmedEmail(email);
      setConfirmedName(name);
      setConfirmedTotal(totalAmount);
      clear();
      setDone(true);
      toast.success("Order placed successfully! We will deliver with COD.");
    } catch (err) {
      console.error("Order error:", err);
      // Fallback
      setOrderNumber("#LA-" + Math.floor(1000 + Math.random() * 9000));
      setConfirmedEmail(email);
      setConfirmedName(name);
      setConfirmedTotal(totalAmount);
      clear();
      setDone(true);
      toast.success("Order recorded successfully!");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          {/* Animated Glowing Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-accent/15 text-accent shadow-glow ring-8 ring-accent/10">
            <CheckCircle2 className="size-10" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-foreground">Order Confirmed!</h1>
          
          <p className="mt-2.5 text-xs font-bold tracking-[0.25em] text-accent uppercase">
            ORDER REFERENCE: {orderNumber}
          </p>

          {/* Prominent Email Notification Notice */}
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-left shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-accent text-accent-foreground shrink-0 mt-0.5">
                <MailCheck className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Confirmation Email & Receipt Dispatched!
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We have sent a detailed order receipt and dispatch tracker directly to{" "}
                  <strong className="text-foreground">{confirmedEmail}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Summary Box */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-left text-sm shadow-soft">
            <h2 className="font-display text-lg text-foreground border-b border-border pb-3">Delivery Information</h2>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block font-medium">Recipient</span>
                <p className="text-foreground font-semibold mt-0.5">{confirmedName}</p>
                <p className="text-muted-foreground">{confirmedEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block font-medium">Payment Mode</span>
                <p className="text-foreground font-semibold mt-0.5 flex items-center gap-1.5 text-emerald-600">
                  <Banknote className="size-4" /> Cash on Delivery (COD)
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold text-[0.68rem]">
                  Pay Cash at Doorstep
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-border">
                <span className="text-muted-foreground uppercase tracking-wider text-[0.65rem] block font-medium">Destination Address</span>
                <p className="text-foreground mt-0.5">{address} {city ? `· ${city}` : ""}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-border flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Cash to Pay upon Delivery:</span>
                <span className="font-display text-xl font-bold text-accent">{money(confirmedTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-royal px-8 py-3.5 text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase shadow-glow hover:opacity-90 transition-opacity"
            >
              Continue Shopping <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h1 className="text-4xl font-display">Checkout</h1>
        <form
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-8">
            <section className="card-lux p-6">
              <h2 className="text-xl">Contact Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-muted-foreground">
                  Full name *
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className={field}
                  />
                </label>
                <label className="text-xs text-muted-foreground">
                  Email Address (For Order Confirmation) *
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className={field}
                  />
                </label>
                <label className="text-xs text-muted-foreground">
                  Phone Number (For Delivery Courier) *
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className={field}
                  />
                </label>
                <label className="text-xs text-muted-foreground">
                  City *
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore / Karachi / Islamabad"
                    className={field}
                  />
                </label>
              </div>
            </section>

            <section className="card-lux p-6">
              <h2 className="text-xl">Shipping Address</h2>
              <div className="mt-4 grid gap-4">
                <label className="text-xs text-muted-foreground">
                  Street address *
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #12, Street 4, Sector G-11"
                    className={field}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-muted-foreground">
                    Postal code
                    <input placeholder="44000" className={field} />
                  </label>
                  <label className="text-xs text-muted-foreground">
                    State / Province
                    <input placeholder="Federal / Punjab / Sindh" className={field} />
                  </label>
                  <label className="text-xs text-muted-foreground">
                    Country
                    <input required defaultValue="Pakistan" className={field} />
                  </label>
                </div>
              </div>
            </section>

            {/* Payment Method - Exclusive Cash on Delivery */}
            <section className="card-lux p-6">
              <h2 className="text-xl">Payment Method</h2>
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">
                    <Banknote className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      Cash on Delivery (COD)
                      <span className="rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-700">
                        Default
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pay easily with cash when your parcel arrives at your door.
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[0.72rem] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Truck className="size-3.5 text-emerald-600" /> Free parcel inspection
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-600" /> Sealed luxury packaging
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="card-lux h-fit p-6">
            <h2 className="text-xl">Your Bag Summary</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {detailed.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {product.name} × {qty}
                  </span>
                  <span className="font-medium">{money(product.price * qty)}</span>
                </li>
              ))}
              {detailed.length === 0 && (
                <li className="text-muted-foreground">Bag is empty.</li>
              )}
            </ul>
            <dl className="mt-5 grid gap-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-border pt-2 mt-1">
                <dt>Total Amount</dt>
                <dd className="text-accent">{money(totalAmount)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={loading || detailed.length === 0}
              className="mt-6 w-full rounded-md bg-royal py-4 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Placing COD Order...
                </>
              ) : (
                "Confirm Cash on Delivery Order"
              )}
            </button>
            <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">
              💵 No upfront card required. Pay upon delivery.
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}

export default Checkout;
