import SiteLayout from "@/user/components/SiteLayout";
import hero from "@/shared/assets/hero-skincare.jpg";
import cd from "@/shared/assets/cd.png";
const stats = [
  { n: "2014", l: "Atelier founded" },
  { n: "36", l: "Compositions released" },
  { n: "180k", l: "Clients worldwide" },
  { n: "100%", l: "Vegan & cruelty free" }
];
function About() {
  return <SiteLayout>
    
    
     <section className="relative min-h-[330px] overflow-hidden text-center text-primary-foreground">

  {/* Background Image */}
  <img
    src={cd}
    alt="Lumière Aura"
    className="absolute inset-0 h-full w-full object-cover"
  />

  {/* Transparent Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#35104F]/10 via-[#7B247F]/65 to-[#C44991]/80" />

  {/* Text */}
  <div className="relative z-10 flex min-h-[330px] flex-col items-center justify-center px-5">

    <p className="eyebrow text-gold opacity-90">
      Since 2014
    </p>

    <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl">
      The house of Lumière
    </h1>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 opacity-90 md:text-base">
      We began with a single rose absolute and a stubborn belief:
      scent should feel like skin, not costume.
    </p>

  </div>
</section>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <img src={hero} alt="Lumière Aura atelier bench" loading="lazy" className="rounded-lg shadow-soft" />
        <div>
          <h2 className="text-4xl">Composed slowly, on purpose</h2>
          <p className="mt-5 text-sm text-muted-foreground">
            Every parfum is macerated for six weeks and filtered by hand. Our skincare lab dose-tests each
            active on 60 volunteers before it earns a bottle. Nothing launches until both teams agree.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            We source Rose de Mai from Grasse, oud from responsibly farmed plantations, and squalane from
            sugarcane — never sharks. Our violet lacquer boxes are FSC certified and refillable.
          </p>
        </div>
      </div>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-4">
          {stats.map((s) => <div key={s.l} className="text-center">
              <p className="font-display text-4xl text-accent">{s.n}</p>
              <p className="eyebrow mt-2 text-muted-foreground">{s.l}</p>
            </div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center text-4xl">What we promise</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
    { t: "Transparent formulas", d: "Full INCI on every carton, actives listed with exact percentages." },
    { t: "Refill, don't rebuy", d: "Return three empties and your fourth refill is on the house." },
    { t: "Human service", d: "A perfumer answers our inbox \u2014 never a script, never a bot." }
  ].map((c) => <div key={c.t} className="card-lux p-7">
              <h3 className="text-2xl">{c.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
            </div>)}
        </div>
      </section>
    </SiteLayout>;
}
var stdin_default = About;
export {
  stdin_default as default
};
