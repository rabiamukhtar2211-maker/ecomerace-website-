import { Mail } from "lucide-react";
import { customers, money } from "@/shared/lib/products";
const tierColor = {
  Platinum: "bg-royal text-primary-foreground",
  Gold: "bg-gold/30 text-foreground",
  Silver: "bg-secondary text-secondary-foreground",
  Bronze: "bg-muted text-muted-foreground"
};
function AdminCustomers() {
  return <div className="grid gap-6">
      <div>
        <h1 className="text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} registered clients.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {customers.map((c) => <div key={c.email} className="card-lux p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-royal text-sm text-primary-foreground">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[0.65rem] tracking-[0.1em] uppercase ${tierColor[c.tier]}`}>
                {c.tier}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              <div><dt className="text-muted-foreground">Orders</dt><dd className="mt-1 text-base font-semibold">{c.orders}</dd></div>
              <div><dt className="text-muted-foreground">Spent</dt><dd className="mt-1 text-base font-semibold">{money(c.spent)}</dd></div>
              <div><dt className="text-muted-foreground">Joined</dt><dd className="mt-1 text-base font-semibold">{c.joined.slice(0, 7)}</dd></div>
            </dl>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-input py-2.5 text-xs tracking-[0.14em] uppercase">
              <Mail className="size-3.5" /> Email client
            </button>
          </div>)}
      </div>
    </div>;
}
var stdin_default = AdminCustomers;
export {
  stdin_default as default
};
