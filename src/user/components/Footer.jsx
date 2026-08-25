import { Link } from "@/shared/lib/router";
import { Instagram, Facebook, Twitter, Mail, Store, Shield } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-24 bg-royal text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">LUMIÈRE</p>
          <p className="eyebrow mt-1 opacity-80">Aura Atelier</p>
          <p className="mt-5 max-w-xs text-sm opacity-80">
            Hand-blended fragrance and dermatologist-tested skincare, composed in our atelier since 2014.
          </p>
          <div className="mt-6 flex gap-4 opacity-90">
            <Instagram className="size-5" />
            <Facebook className="size-5" />
            <Twitter className="size-5" />
            <Mail className="size-5" />
          </div>
        </div>

        <div>
          <h4 className="eyebrow opacity-70">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li><Link to="/perfumes">Perfumes</Link></li>
            <li><Link to="/skincare">Skincare</Link></li>
            <li><Link to="/gifts">Gift Sets</Link></li>
            <li><Link to="/shop">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow opacity-70">Portals & House</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li><Link to="/seller-login" className="text-[#F6C76B] font-medium hover:underline flex items-center gap-1.5"><Store className="size-3.5" /> Artisan Seller Portal</Link></li>
            <li><Link to="/admin-login" className="hover:underline flex items-center gap-1.5"><Shield className="size-3.5" /> Staff Admin Panel</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/faq">FAQ & Shipping</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow opacity-70">Aura Letters</h4>
          <p className="mt-4 text-sm opacity-80">New launches, private sales, layering guides.</p>
          <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full rounded-l-md bg-primary-foreground/10 px-4 py-3 text-sm placeholder:text-primary-foreground/50 focus:outline-none"
            />
            <button className="rounded-r-md bg-rose-grad px-4 text-xs tracking-[0.15em] uppercase">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-5 py-6 text-center text-xs opacity-70 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Lumière Aura Atelier. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/seller-login" className="hover:underline text-[#F6C76B]">Seller Login</Link>
          <span>·</span>
          <Link to="/admin-login" className="hover:underline">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
