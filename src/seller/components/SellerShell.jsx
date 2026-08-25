import { Link, Outlet, useNavigate, useRouterState } from "@/shared/lib/router";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  Users,
  Bell,
  Menu,
  X,
  Sparkles,
  Store,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/lib/auth";

import sidebar from "@/shared/assets/sidebar.png";

const links = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "My Products", icon: Boxes },
  { to: "/seller/orders", label: "My Orders", icon: Package },
  { to: "/seller/customers", label: "My Customers", icon: Users },
  { to: "/seller/subscription", label: "Subscription", icon: CreditCard },
];

function SellerShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Check if logged in user is a seller or admin
    const token = localStorage.getItem("la_token");
    const role = localStorage.getItem("la_role");

    if (!token || (role !== "seller" && role !== "admin")) {
      navigate({ to: "/seller-login" });
    } else {
      setReady(true);
    }
  }, [navigate, pathname]);

  if (!ready) {
    return <div className="min-h-screen bg-[#FBF3FA]" />;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/seller-login" });
  };

  const storeName = user?.store_name || "Artisan Atelier";

  return (
    <div className="min-h-screen bg-[#FBF3FA]">

      {/* =====================================================
          DESKTOP SIDEBAR (Matches AdminShell 1:1)
      ===================================================== */}
      <aside
        className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-hidden lg:flex"
        style={{
          backgroundImage: `url(${sidebar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Soft purple overlay */}
        <div className="absolute inset-0 bg-[#24102F]/10" />

        {/* Sidebar Content */}
        <div className="relative z-10 flex h-full w-full flex-col p-5 text-white">

          {/* Logo */}
          <div className="mb-8">
            <p className="font-display text-xl tracking-[0.18em]">
              LUMIÈRE
            </p>

            <p className="eyebrow text-[#F6C76B] flex items-center gap-1.5 mt-0.5">
              <Sparkles className="size-3" /> Artisan Portal
            </p>
          </div>

          {/* Store Badge */}
          <div className="mb-6 rounded-md bg-[#C44991]/25 p-3 border border-white/15 backdrop-blur-xs">
            <p className="eyebrow text-[#F6C76B] text-[0.62rem]">Store Profile</p>
            <p className="font-semibold text-sm text-white truncate mt-0.5">{storeName}</p>
            <div className="mt-1 flex items-center gap-1.5 text-[0.65rem] text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Verified Artisan Seller
            </div>
          </div>

          {/* Navigation */}
          <nav className="grid gap-1">
            {links.map((l) => {
              const active =
                l.to === "/seller"
                  ? pathname === "/seller"
                  : pathname.startsWith(l.to);

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-[#C44991]/35 text-white shadow-sm font-semibold"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <l.icon className="size-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Links & Logout */}
          <div className="mt-auto space-y-1 pt-4 border-t border-white/15">
            <Link
              to="/shop"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-xs text-white/75 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ShoppingBag className="size-4" />
              View Luxury Shop
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className="fixed left-0 top-0 z-50 h-screen w-72 overflow-hidden lg:hidden"
            style={{
              backgroundImage: `url(${sidebar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-[#24102F]/85" />

            <div className="relative z-10 flex h-full flex-col p-5 text-white">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="font-display text-xl tracking-[0.18em]">
                    LUMIÈRE
                  </p>
                  <p className="eyebrow text-[#F6C76B]">
                    Artisan Portal
                  </p>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-2 hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="grid gap-1">
                {links.map((l) => {
                  const active =
                    l.to === "/seller"
                      ? pathname === "/seller"
                      : pathname.startsWith(l.to);

                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all ${
                        active
                          ? "bg-[#C44991]/35 text-white font-semibold"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <l.icon className="size-4" />
                      {l.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 rounded-md px-3 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* =====================================================
          MAIN AREA (Matches AdminShell 1:1)
      ===================================================== */}
      <div className="min-h-screen lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E9D8EA] bg-white/95 px-4 backdrop-blur-md sm:px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-[#5D3A6E] hover:bg-[#F5E8F5] lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h2 className="font-semibold text-sm text-[#35104F]">{storeName}</h2>
              <p className="text-xs text-[#8A6A91]">Artisan Seller Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#7B247F] text-xs text-white font-semibold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AT"}
            </div>
            <div className="hidden text-xs leading-tight sm:block text-right">
              <p className="font-semibold text-[#35104F]">{user?.name || "Artisan"}</p>
              <p className="text-[#8A6A91]">{user?.email || "seller@lumiere.com"}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SellerShell;
