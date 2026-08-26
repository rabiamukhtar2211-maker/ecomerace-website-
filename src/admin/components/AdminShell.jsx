import { Link, Outlet, useNavigate, useRouterState } from "@/shared/lib/router";
import { Navigate, useLocation } from "react-router-dom";
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
  Mail,
  Store
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/shared/services/api";

import sidebar from "@/shared/assets/sidebar.png";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/sellers", label: "Sellers & Artisans", icon: Store, hasBadge: true },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingSellersCount, setPendingSellersCount] = useState(0);

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("aura_admin") === "1";

  useEffect(() => {
    if (isAdmin) {
      api.getDashboardStats()
        .then((res) => {
          if (res.kpis && res.kpis.pendingSellers) {
            setPendingSellersCount(parseInt(res.kpis.pendingSellers, 10));
          }
        })
        .catch(() => {});
    }
  }, [isAdmin, pathname]);

  // Strict Instant Protection: Block anyone without active admin login
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("aura_admin");
    localStorage.removeItem("la_role");
    localStorage.removeItem("la_token");
    localStorage.removeItem("la_user");
    navigate({ to: "/admin-login" });
  };

  return (
    <div className="min-h-screen bg-[#FBF3FA]">

      {/* =====================================================
          DESKTOP SIDEBAR
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

            <p className="eyebrow text-[#F6C76B]">
              Control Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="grid gap-1">
            {links.map((l) => {
              const active =
                l.to === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(l.to);

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-[#C44991]/35 text-white shadow-sm font-semibold"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <l.icon className="size-4" />
                    {l.label}
                  </div>
                  {l.hasBadge && pendingSellersCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#F6C76B] text-[0.65rem] font-bold text-[#24102F]">
                      {pendingSellersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
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
                    Control Panel
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
                    l.to === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(l.to);

                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-md px-3 py-3 text-sm transition-all ${
                        active
                          ? "bg-[#C44991]/35 text-white font-semibold"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <l.icon className="size-4" />
                        {l.label}
                      </div>
                      {l.hasBadge && pendingSellersCount > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#F6C76B] text-[0.65rem] font-bold text-[#24102F]">
                          {pendingSellersCount}
                        </span>
                      )}
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
          MAIN AREA
      ===================================================== */}
      <div className="min-h-screen lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E9D8EA] bg-white/95 px-4 backdrop-blur-md sm:px-5">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-[#5D3A6E] hover:bg-[#F5E8F5] lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-[#F7E8F6] px-3 py-2">
            <Search className="size-4 shrink-0 text-[#8A6A91]" />
            <input
              placeholder="Search orders, products, customers, sellers…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9A7FA0]"
            />
          </div>

          <button
            onClick={() => navigate({ to: "/admin/sellers" })}
            className="relative shrink-0 rounded-md p-2 hover:bg-[#F7E8F6]"
            title="Pending Seller Requests"
          >
            <Bell className="size-5 text-[#6B4A78]" />
            {pendingSellersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
            )}
          </button>

          <div className="flex shrink-0 items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#7B247F] text-xs text-white font-semibold">
              AM
            </div>
            <div className="hidden text-xs leading-tight xl:block">
              <p className="font-semibold text-[#35104F]">Admin Manager</p>
              <p className="text-[#8A6A91]">admin@lumiere.com</p>
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

export default AdminShell;