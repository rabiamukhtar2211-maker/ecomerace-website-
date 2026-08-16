import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/user/components/SiteLayout";
import cds from "@/shared/assets/cds.png";
const field = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring";
function Contact() {
  return <SiteLayout>
       <section className="relative min-h-[330px] overflow-hidden text-center text-primary-foreground">
      
        {/* Background Image */}
        <img
          src={cds}
          alt="Lumière Aura"
          className="absolute inset-0 h-full w-full object-cover"
        />
      
        {/* Transparent Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#35104F]/10 via-[#7B247F]/65 to-[#C44991]/80" />
      
        {/* Text */}
        <div className="relative z-10 flex min-h-[330px] flex-col items-center justify-center px-5">
      
         
      
           <p className="eyebrow text-gold opacity-90">
      Lumière Aura
    </p>
      
         <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl">
  Contact Us
</h1>
      
        </div>
      </section>
      
          
       

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_380px]">
        <form
    className="card-lux p-7"
    onSubmit={(e) => {
      e.preventDefault();
      toast.success("Message sent \u2014 we reply within one working day.");
      e.target.reset();
    }}
  >
          <h2 className="text-2xl">Send a message</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Name<input required className={field} /></label>
            <label className="text-xs text-muted-foreground">Email<input required type="email" className={field} /></label>
            <label className="text-xs text-muted-foreground sm:col-span-2">Subject<input required className={field} /></label>
            <label className="text-xs text-muted-foreground sm:col-span-2">
              Message<textarea required rows={6} className={field} />
            </label>
          </div>
          <button className="mt-6 rounded-md bg-royal px-8 py-3.5 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase">
            Send message
          </button>
        </form>

        <aside className="grid gap-4">
          {[
    { icon: MapPin, t: "Flagship boutique", d: "24 Gulberg III, Lahore, Pakistan" },
    { icon: Phone, t: "Phone", d: "+92 300 000 0000" },
    { icon: Mail, t: "Email", d: "care@lumiereaura.com" },
    { icon: Clock, t: "Hours", d: "Mon\u2013Sat, 11:00 \u2013 20:00" }
  ].map((c) => <div key={c.t} className="card-lux flex items-start gap-4 p-6">
              <c.icon className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="text-sm font-semibold">{c.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              </div>
            </div>)}
        </aside>
      </div>
    </SiteLayout>;
}
var stdin_default = Contact;
export {
  stdin_default as default
};
