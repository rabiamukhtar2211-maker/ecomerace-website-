import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Clock, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import api from "@/shared/services/api";

function SellerSubscription() {
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerSubscription();
      setSubData(res.subscription);
    } catch (err) {
      console.warn("Failed to fetch subscription:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const features = [
    "Unlimited luxury product catalogue listings",
    "Seamless placement in main Lumière Aura shop",
    "Automated real-time customer email invoices",
    "Direct client inquiry & customer messaging",
    "Dedicated artisan sales & revenue dashboard",
    "Full SSL encrypted buyer checkout support"
  ];

  return (
    <div className="grid gap-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display">Artisan Monthly Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your boutique seller membership, billing status, and membership features.
        </p>
      </div>

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
          Loading membership status...
        </div>
      )}

      {!loading && subData && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Card */}
          <div className="card-lux p-6 md:col-span-2 flex flex-col justify-between border-accent/40 shadow-soft">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-3.5" /> Current Plan
                  </span>
                  <h2 className="text-2xl font-bold text-foreground mt-1">
                    {subData.plan || "Artisan Monthly ($29/mo)"}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    subData.status === "active"
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  Status: {subData.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-accent" /> Days Remaining
                  </p>
                  <p className="text-3xl font-display font-bold text-foreground mt-2">
                    {subData.days_left || 30} <span className="text-xs text-muted-foreground font-normal">days</span>
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-accent" /> Billing Cycle
                  </p>
                  <p className="text-base font-semibold text-foreground mt-2">
                    Auto-Renews Monthly
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Artisan Membership Perks Included:
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 text-xs text-foreground">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Managed by Lumière Aura Concierge</span>
              <span className="text-foreground font-medium">Store: {subData.store_name}</span>
            </div>
          </div>

          {/* Concierge Support Note */}
          <div className="card-lux p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" /> Administrative Access
              </h3>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                As per Lumière Aura platform policy, the Administration retains the right to activate, pause, or suspend seller store memberships to ensure highest quality luxury standards.
              </p>
              <div className="mt-4 rounded-xl bg-muted/50 p-3.5 text-xs border border-border/60 text-muted-foreground">
                <p>
                  Need to upgrade your subscription plan or request custom fee arrangements?
                </p>
                <p className="mt-2 font-medium text-accent">
                  Contact admin@lumiere.com
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border text-[0.7rem] text-muted-foreground">
              Member in good standing · SSL Secured
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerSubscription;
