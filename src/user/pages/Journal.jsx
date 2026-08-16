import SiteLayout from "@/user/components/SiteLayout";
import hero from "@/shared/assets/hero-perfume.jpg";
import skin from "@/shared/assets/hero-skincare.jpg";
import cd from "@/shared/assets/cd.png";
const posts = [
  { t: "How to layer oud without overwhelming a room", c: "Perfumery", img: hero, min: 6 },
  { t: "Niacinamide vs vitamin C: what to use when", c: "Skincare", img: skin, min: 8 },
  { t: "Why your parfum fades by lunch (and the fix)", c: "Perfumery", img: hero, min: 5 },
  { t: "Building a four-step evening ritual", c: "Skincare", img: skin, min: 7 },
  { t: "Inside Grasse: harvesting Rose de Mai", c: "Atelier", img: hero, min: 9 },
  { t: "Retinal, gently: a two-week ramp-up plan", c: "Skincare", img: skin, min: 6 }
];
function Journal() {
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
           Read
          </p>
      
          <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl">
            The Journal
          </h1>
      
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 opacity-90 md:text-base">
           Notes from our perfumers and dermatologists — practical, never preachy.
          </p>
      
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3">
        {posts.map((p) => <article key={p.t} className="card-lux group overflow-hidden">
            <img src={p.img} alt={p.t} loading="lazy" className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="p-6">
              <p className="eyebrow text-accent">{p.c} · {p.min} min read</p>
              <h2 className="mt-3 text-2xl leading-snug">{p.t}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A short, useful read with exactly the steps we use in the atelier.
              </p>
            </div>
          </article>)}
      </div>
    </SiteLayout>;
}
var stdin_default = Journal;
export {
  stdin_default as default
};
