import { Link } from "@/shared/lib/router";
import { ArrowRight, Award, Leaf, Sparkles, Star, Truck } from "lucide-react";
import SiteLayout from "@/user/components/SiteLayout";
import ProductCard from "@/user/components/ProductCard";
import { products } from "@/shared/lib/products";
import hero from "@/shared/assets/hero-perfume.jpg";
import skinHero from "@/shared/assets/hero-skincare.jpg";
const bestsellers = products.filter((p) => p.badge === "Bestseller").slice(0, 4);
const newIn = products.filter((p) => p.badge === "New" || p.badge === "Limited").slice(0, 4);
const reviews = [
  { name: "Ayesha K.", text: "Noir \xC9clat lasts all day and I get compliments every single time. Packaging feels like a gift.", role: "Verified buyer" },
  { name: "L\xE9a D.", text: "The Hydra Glow Serum calmed my redness in two weeks. Nothing else came close.", role: "Verified buyer" },
  { name: "Marion B.", text: "Ordered the Midnight coffret for my sister \u2014 she called me crying. Perfect.", role: "Verified buyer" }
];
function Home() {
  return <SiteLayout>
      {
    /* Hero */
  }
      <section className="relative isolate overflow-hidden">
        <img
    src={hero}
    alt="Lumière Aura signature parfum on violet silk"
    width={1600}
    height={1200}
    className="absolute inset-0 size-full object-cover"
  />
        <div className="absolute inset-0 bg-veil" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-24 text-primary-foreground">
          <p className="eyebrow text-gold">Atelier since 2014</p>
          <h1 className="mt-5 max-w-2xl text-5xl leading-[1.05] md:text-7xl">
            Wear the night.<br />
            <span className="text-gradient">Glow by morning.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm opacity-90 md:text-base">
            Two houses under one roof: concentrated parfums matured for six weeks, and clinically dosed
            skincare built for a calm, luminous barrier.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
    to="/perfumes"
    className="inline-flex items-center gap-2 rounded-md bg-rose-grad px-7 py-4 text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow"
  >
              Shop parfums <ArrowRight className="size-4" />
            </Link>
            <Link
    to="/skincare"
    className="rounded-md border border-primary-foreground/40 px-7 py-4 text-[0.72rem] tracking-[0.2em] uppercase backdrop-blur-sm"
  >
              Skin rituals
            </Link>
          </div>
        </div>
      </section>

      {
    /* Trust bar */
  }
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
    { icon: Truck, t: "Free express over $120", s: "Worldwide, 2\u20134 days" },
    { icon: Sparkles, t: "3 samples per order", s: "Choose at checkout" },
    { icon: Leaf, t: "Clean & cruelty free", s: "Vegan formulations" },
    { icon: Award, t: "Awarded 2025", s: "Best niche fragrance" }
  ].map((f) => <div key={f.t} className="flex items-start gap-3">
              <f.icon className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="text-sm font-semibold">{f.t}</p>
                <p className="text-xs text-muted-foreground">{f.s}</p>
              </div>
            </div>)}
        </div>
      </section>

      {
    /* Categories */
  }
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="text-center">
          <p className="eyebrow text-accent">Explore</p>
          <h2 className="mt-3 text-4xl">Three ways to begin</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
    { to: "/perfumes", label: "Parfums", img: hero, copy: "12 signatures, from oud to lilac" },
    { to: "/skincare", label: "Skincare", img: skinHero, copy: "Serums, creams, SPF & masks" },
    { to: "/gifts", label: "Gift sets", img: skinHero, copy: "Coffrets wrapped in silk" }
  ].map((c) => <Link key={c.to} to={c.to} className="group relative isolate block overflow-hidden rounded-lg shadow-soft">
              <img src={c.img} alt={c.label} loading="lazy" className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-veil" />
              <div className="absolute bottom-6 left-6 text-primary-foreground">
                <h3 className="text-2xl">{c.label}</h3>
                <p className="mt-1 text-xs opacity-85">{c.copy}</p>
              </div>
            </Link>)}
        </div>
      </section>

      {
    /* Bestsellers */
  }
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Loved most</p>
            <h2 className="mt-2 text-4xl">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-xs tracking-[0.18em] text-accent uppercase">
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {
    /* Editorial split */
  }
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
          <img src={skinHero} alt="Lumière Aura skincare ritual" loading="lazy" className="rounded-lg shadow-soft" />
          <div>
            <p className="eyebrow text-accent">The ritual</p>
            <h2 className="mt-3 text-4xl">Skin first, scent second</h2>
            <p className="mt-5 text-sm text-muted-foreground">
              Fragrance sits differently on a hydrated barrier. Our dermatologists built a four-step ritual
              that prepares skin so your parfum blooms softer and lasts longer.
            </p>
            <ul className="mt-6 grid gap-3 text-sm">
              {["Cleanse with Velvet Cream", "Layer Hydra Glow Serum", "Seal with Radiance Cream", "Mist, then apply parfum"].map((s, i) => <li key={s} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-royal text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {s}
                </li>)}
            </ul>
            <Link to="/journal" className="mt-8 inline-block rounded-md bg-royal px-6 py-3 text-[0.7rem] tracking-[0.2em] text-primary-foreground uppercase">
              Read the guide
            </Link>
          </div>
        </div>
      </section>

      {
    /* New in */
  }
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="text-center">
          <p className="eyebrow text-accent">Fresh from the atelier</p>
          <h2 className="mt-3 text-4xl">New & limited</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {newIn.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {
    /* Reviews */
  }
      <section className="bg-royal py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <p className="eyebrow text-gold">4.8 average · 6,200 reviews</p>
            <h2 className="mt-3 text-4xl">Words from our clients</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => <figure key={r.name} className="rounded-lg bg-primary-foreground/8 p-7 backdrop-blur-sm">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-gold text-gold" />)}
                </div>
                <blockquote className="mt-4 text-sm opacity-90">"{r.text}"</blockquote>
                <figcaption className="mt-5 text-xs opacity-70">
                  {r.name} · {r.role}
                </figcaption>
              </figure>)}
          </div>
        </div>
      </section>
    </SiteLayout>;
}
var stdin_default = Home;
export {
  stdin_default as default
};
