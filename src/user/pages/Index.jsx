import { Link } from "@/shared/lib/router";
import { ArrowRight, Award, Leaf, Sparkles, Star, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import SiteLayout from "@/user/components/SiteLayout";
import ProductCard from "@/user/components/ProductCard";
import { products as localProducts } from "@/shared/lib/products";
import api from "@/shared/services/api";
import hero from "@/shared/assets/hero-perfume.jpg";
import skinHero from "@/shared/assets/hero-skincare.jpg";

const reviews = [
  { name: "Ayesha K.", text: "Noir Éclat lasts all day and I get compliments every single time. Packaging feels like a gift.", role: "Verified buyer" },
  { name: "Léa D.", text: "The Hydra Glow Serum calmed my redness in two weeks. Nothing else came close.", role: "Verified buyer" },
  { name: "Marion B.", text: "Ordered the Midnight coffret for my sister — she called me crying. Perfect.", role: "Verified buyer" }
];

function Home() {
  const [liveProducts, setLiveProducts] = useState(localProducts);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await api.getProducts();
        if (res.products && res.products.length > 0) {
          const mapped = res.products.map((p) => ({
            id: p.slug || String(p.id),
            dbId: p.id,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            price: Number(p.price),
            oldPrice: p.old_price ? Number(p.old_price) : undefined,
            category: p.category,
            family: p.family || "Luxury",
            size: p.size || "100 ml",
            rating: Number(p.rating || 5.0),
            reviews: p.reviews || 0,
            stock: p.stock || 20,
            image: p.image,
            badge: p.badge,
            store_name: p.store_name,
            seller_name: p.seller_name,
            notes: Array.isArray(p.notes) ? p.notes : [],
          }));
          setLiveProducts(mapped);
        }
      } catch (err) {
        console.warn("Using local products on home:", err.message);
      }
    }
    loadLiveProducts();
  }, []);

  const bestsellers = liveProducts.filter((p) => p.badge === "Bestseller").slice(0, 4);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers : liveProducts.slice(0, 4);
  const newIn = liveProducts.filter((p) => p.badge === "New" || p.badge === "Limited").slice(0, 4);
  const displayNewIn = newIn.length > 0 ? newIn : liveProducts.slice(4, 8);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Lumière Aura signature parfum on violet silk"
          width={1600}
          height={1200}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-veil" />
        <div className="relative mx-auto flex min-h-[72vh] sm:min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-16 sm:py-24 text-primary-foreground">
          <p className="eyebrow text-gold text-xs sm:text-sm">Atelier since 2014</p>
          <h1 className="mt-3 sm:mt-5 max-w-2xl text-4xl sm:text-6xl md:text-7xl leading-[1.08] font-display">
            Wear the night.<br />
            <span className="text-gradient">Glow by morning.</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-lg text-xs sm:text-sm md:text-base leading-relaxed opacity-90">
            Two houses under one roof: concentrated parfums matured for six weeks, and clinically dosed
            skincare built for a calm, luminous barrier.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/perfumes"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-grad px-6 sm:px-7 py-3.5 sm:py-4 text-[0.68rem] sm:text-[0.72rem] tracking-[0.2em] text-primary-foreground uppercase shadow-glow font-semibold"
            >
              Shop parfums <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/skincare"
              className="rounded-xl border border-primary-foreground/40 px-6 sm:px-7 py-3.5 sm:py-4 text-[0.68rem] sm:text-[0.72rem] tracking-[0.2em] uppercase backdrop-blur-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Skin rituals
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-5 py-6 sm:py-8 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Free express over $120", s: "Worldwide, 2–4 days" },
            { icon: Sparkles, t: "3 samples per order", s: "Choose at checkout" },
            { icon: Leaf, t: "Clean & cruelty free", s: "Vegan formulations" },
            { icon: Award, t: "Awarded 2025", s: "Best niche fragrance" }
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-2.5 sm:gap-3">
              <f.icon className="mt-0.5 size-4 sm:size-5 text-accent shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold">{f.t}</p>
                <p className="text-[0.68rem] sm:text-xs text-muted-foreground">{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20">
        <div className="text-center">
          <p className="eyebrow text-accent text-xs">Explore</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display">Three ways to begin</h2>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            { to: "/perfumes", label: "Parfums", img: hero, copy: "12 signatures, from oud to lilac" },
            { to: "/skincare", label: "Skincare", img: skinHero, copy: "Serums, creams, SPF & masks" },
            { to: "/gifts", label: "Gift sets", img: skinHero, copy: "Coffrets wrapped in silk" }
          ].map((c) => (
            <Link key={c.to} to={c.to} className="group relative isolate block overflow-hidden rounded-2xl shadow-soft aspect-[4/3] sm:aspect-auto sm:h-80">
              <img src={c.img} alt={c.label} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-veil" />
              <div className="absolute bottom-5 left-5 text-primary-foreground">
                <h3 className="text-xl sm:text-2xl font-display">{c.label}</h3>
                <p className="mt-1 text-xs opacity-85">{c.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 pb-14 sm:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent text-xs">Loved most</p>
            <h2 className="mt-1 text-2xl sm:text-4xl font-display">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold tracking-[0.14em] text-accent uppercase hover:underline">
            View all →
          </Link>
        </div>
        {/* 2-Column Mobile Grid & 4-Column Desktop Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {displayBestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="bg-secondary/60 py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 px-4 sm:px-5 md:grid-cols-2">
          <img src={skinHero} alt="Lumière Aura skincare ritual" loading="lazy" className="rounded-2xl shadow-soft w-full" />
          <div>
            <p className="eyebrow text-accent text-xs">The ritual</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-display">Skin first, scent second</h2>
            <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Fragrance sits differently on a hydrated barrier. Our dermatologists built a four-step ritual
              that prepares skin so your parfum blooms softer and lasts longer.
            </p>
            <ul className="mt-5 sm:mt-6 grid gap-2.5 sm:gap-3 text-xs sm:text-sm">
              {["Cleanse with Velvet Cream", "Layer Hydra Glow Serum", "Seal with Radiance Cream", "Mist, then apply parfum"].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-full bg-royal text-[0.65rem] sm:text-xs text-primary-foreground font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <Link to="/journal" className="mt-6 sm:mt-8 inline-block rounded-xl bg-royal px-6 py-3 text-[0.68rem] sm:text-[0.7rem] tracking-[0.2em] text-primary-foreground uppercase font-semibold shadow-glow">
              Read the guide
            </Link>
          </div>
        </div>
      </section>

      {/* New in */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20">
        <div className="text-center">
          <p className="eyebrow text-accent text-xs">Fresh from the atelier</p>
          <h2 className="mt-1 text-2xl sm:text-4xl font-display">New & limited</h2>
        </div>
        {/* 2-Column Mobile Grid & 4-Column Desktop Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {displayNewIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-royal py-14 sm:py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
          <div className="text-center">
            <p className="eyebrow text-gold text-xs">4.8 average · 6,200 reviews</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-display">Words from our clients</h2>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-2xl bg-primary-foreground/8 p-5 sm:p-7 backdrop-blur-sm border border-white/10">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 sm:size-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-3 text-xs sm:text-sm opacity-90 leading-relaxed">"{r.text}"</blockquote>
                <figcaption className="mt-4 text-[0.7rem] sm:text-xs opacity-70">
                  {r.name} · {r.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Home;
