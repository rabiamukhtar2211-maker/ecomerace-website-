import SiteLayout from "@/user/components/SiteLayout";
const faqs = [
  { q: "How long does delivery take?", a: "Domestic orders arrive in 1\u20132 working days. International express takes 2\u20134 days and is free above $120." },
  { q: "Can I return an opened parfum?", a: "Yes. If it isn't right for your skin, return within 30 days \u2014 even opened \u2014 for a full refund." },
  { q: "Do you offer samples?", a: "Every order includes three 2 ml samples of your choice, selected at checkout." },
  { q: "Are the formulas suitable for sensitive skin?", a: "All skincare is fragrance-free unless stated and patch-tested on 60 volunteers, including sensitive-skin panels." },
  { q: "How does the refill programme work?", a: "Return three empty bottles to any stockist and your next refill is complimentary." },
  { q: "Which payment methods do you accept?", a: "Visa, Mastercard, Amex, Apple Pay, and cash on delivery within Pakistan." }
];
function Faq() {
  return <SiteLayout>
      <section className="bg-royal py-20 text-center text-primary-foreground">
        <p className="eyebrow text-gold">Help centre</p>
        <h1 className="mt-4 text-5xl">FAQ & shipping</h1>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="grid gap-4">
          {faqs.map((f) => <details key={f.q} className="card-lux p-6">
              <summary className="cursor-pointer text-lg font-medium">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>)}
        </div>
      </div>
    </SiteLayout>;
}
var stdin_default = Faq;
export {
  stdin_default as default
};
