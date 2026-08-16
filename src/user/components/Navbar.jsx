import { Link } from "@/shared/lib/router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/shared/lib/cart";
const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/perfumes", label: "Perfumes" },
  { to: "/skincare", label: "Skincare" },
  { to: "/gifts", label: "Gifts" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function Navbar() {
  const { count, wishlist } = useCart();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="bg-royal py-2 text-center text-[0.68rem] tracking-[0.22em] text-primary-foreground uppercase">
        Complimentary shipping over $120 · 3 luxury samples with every order
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5">
        <button
    className="lg:hidden text-foreground"
    onClick={() => setOpen((v) => !v)}
    aria-label="Toggle menu"
  >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-[0.2em] text-foreground">LUMIÈRE</span>
          <span className="eyebrow text-accent">Aura Atelier</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => <Link
    key={n.to}
    to={n.to}
    activeProps={{ className: "text-accent" }}
    className="text-[0.78rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-accent"
  >
              {n.label}
            </Link>)}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/shop" aria-label="Search" className="text-muted-foreground hover:text-accent">
            <Search className="size-5" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative text-muted-foreground hover:text-accent">
            <Heart className="size-5" />
            {wishlist.length > 0 && <span className="absolute -top-2 -right-2 grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                {wishlist.length}
              </span>}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-foreground hover:text-accent">
            <ShoppingBag className="size-5" />
            {count > 0 && <span className="absolute -top-2 -right-2 grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                {count}
              </span>}
          </Link>
        </div>
      </div>

      {open && <nav className="grid gap-1 border-t border-border bg-card px-5 py-4 lg:hidden">
          {nav.map((n) => <Link
    key={n.to}
    to={n.to}
    onClick={() => setOpen(false)}
    className="py-2 text-sm tracking-[0.12em] text-muted-foreground uppercase"
  >
              {n.label}
            </Link>)}
        </nav>}
    </header>;
}
export {
  Navbar as default
};
