import { toast } from "sonner";
const field = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring";
function Settings() {
  return <div className="grid max-w-3xl gap-6">
      <div>
        <h1 className="text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Store profile, shipping and staff preferences.</p>
      </div>

      <form
    className="grid gap-6"
    onSubmit={(e) => {
      e.preventDefault();
      toast.success("Settings saved.");
    }}
  >
        <section className="card-lux p-6">
          <h2 className="text-xl">Store profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Store name<input defaultValue="Lumière Aura Atelier" className={field} /></label>
            <label className="text-xs text-muted-foreground">Support email<input defaultValue="care@lumiereaura.com" className={field} /></label>
            <label className="text-xs text-muted-foreground">Currency<input defaultValue="USD ($)" className={field} /></label>
            <label className="text-xs text-muted-foreground">Timezone<input defaultValue="Asia/Karachi" className={field} /></label>
          </div>
        </section>

        <section className="card-lux p-6">
          <h2 className="text-xl">Shipping</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Free shipping threshold<input defaultValue="120" className={field} /></label>
            <label className="text-xs text-muted-foreground">Flat rate<input defaultValue="12" className={field} /></label>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-accent" /> Include 3 samples per order</label>
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-accent" /> Offer cash on delivery (Pakistan)</label>
            <label className="flex items-center gap-3"><input type="checkbox" className="accent-accent" /> Pause international orders</label>
          </div>
        </section>

        <section className="card-lux p-6">
          <h2 className="text-xl">Staff notifications</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-accent" /> New order email</label>
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-accent" /> Low stock alert under 15 units</label>
            <label className="flex items-center gap-3"><input type="checkbox" className="accent-accent" /> Weekly revenue digest</label>
          </div>
        </section>

        <button className="w-fit rounded-md bg-royal px-8 py-3.5 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase">
          Save changes
        </button>
      </form>
    </div>;
}
var stdin_default = Settings;
export {
  stdin_default as default
};
