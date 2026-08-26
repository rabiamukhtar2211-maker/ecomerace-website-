import { Link } from "@/shared/lib/router";
import { Heart, Menu, Search, ShoppingBag, User, X, Sparkles, LogIn } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/shared/lib/cart";
import { useAuth } from "@/shared/lib/auth";
import AuthModal from "./AuthModal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  { to: "/perfumes", label: "Perfumes" },
  { to: "/skincare", label: "Skincare" },
  { to: "/gifts", label: "Gifts & Sets" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" }
];

function Navbar() {
  const { count, wishlist } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        {/* Announcement Bar */}
        <div className="bg-royal py-1.5 sm:py-2 text-center text-[0.62rem] sm:text-[0.68rem] tracking-[0.16em] sm:tracking-[0.22em] text-primary-foreground uppercase flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4 overflow-hidden">
          <span className="truncate">Complimentary shipping over $120 · 3 luxury samples with every order</span>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5">
          {/* Hamburger Mobile */}
          <button
            className="lg:hidden p-1.5 text-foreground hover:text-accent transition-colors cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex flex-col leading-none text-center lg:text-left">
            <span className="font-display text-xl sm:text-2xl tracking-[0.2em] text-foreground">LUMIÈRE</span>
            <span className="eyebrow text-[0.55rem] sm:text-[0.65rem] text-accent tracking-[0.2em]">Aura Atelier</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[0.78rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-accent font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Icons Toolbar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link to="/shop" aria-label="Search" className="p-1 text-muted-foreground hover:text-accent transition-colors">
              <Search className="size-4.5 sm:size-5" />
            </Link>

            {/* Customer Account Button */}
            <button
              onClick={() => setAuthOpen(true)}
              aria-label="Account"
              className="flex items-center gap-1.5 p-1 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
            >
              <User className="size-4.5 sm:size-5" />
              {isAuthenticated && (
                <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-accent">
                  {user?.name?.split(" ")[0]}
                </span>
              )}
            </button>

            <Link to="/wishlist" aria-label="Wishlist" className="relative p-1 text-muted-foreground hover:text-accent transition-colors">
              <Heart className="size-4.5 sm:size-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-accent text-[0.58rem] text-accent-foreground font-bold shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" aria-label="Cart" className="relative p-1 text-foreground hover:text-accent transition-colors">
              <ShoppingBag className="size-4.5 sm:size-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-accent text-[0.58rem] text-accent-foreground font-bold shadow-xs">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="border-t border-border bg-card/98 px-5 py-5 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-muted px-4 py-2.5 text-xs text-muted-foreground"
              >
                <span>Search perfumes, skincare, gifts…</span>
                <Search className="size-4 text-accent" />
              </Link>
            </div>

            <nav className="grid gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold tracking-[0.14em] text-foreground uppercase hover:bg-muted transition-colors"
                >
                  <span>{n.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-border/80 pt-4 flex items-center justify-between">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                  <Sparkles className="size-4" /> Signed in as {user?.name}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider cursor-pointer"
                >
                  <LogIn className="size-4" /> Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Navbar;
