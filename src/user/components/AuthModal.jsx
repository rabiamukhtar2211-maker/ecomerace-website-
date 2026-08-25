import React, { useState } from "react";
import { useAuth } from "@/shared/lib/auth";
import { X, User, Lock, Mail, Store, ShoppingBag, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose }) {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState("buyer"); // 'buyer' or 'seller'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingNotice, setPendingNotice] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPendingNotice(false);

    try {
      if (isRegisterMode) {
        const res = await register({ name, email, password, role });
        if (res.pendingApproval) {
          setPendingNotice(true);
          toast.info("Artisan Seller registration submitted! Your store is pending Admin approval.");
        } else {
          toast.success(`Welcome to Lumière Aura, ${name}!`);
          onClose();
        }
      } else {
        const res = await login(email, password);
        toast.success("Logged in successfully!");
        onClose();
        if (res.user?.role === "seller") {
          navigate("/seller");
        }
      }
    } catch (err) {
      if (err.pendingApproval) {
        setPendingNotice(true);
      }
      toast.error(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-2xl border border-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {isAuthenticated ? (
          // Logged In Profile View
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
              <User className="size-8" />
            </div>
            <h3 className="font-display text-2xl text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              <CheckCircle2 className="size-3.5" /> Role: {user?.role}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {user?.role === "seller" && (
                <button
                  onClick={() => {
                    onClose();
                    navigate("/seller");
                  }}
                  className="w-full rounded-xl bg-royal py-3 font-semibold text-primary-foreground uppercase tracking-widest text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-glow"
                >
                  <Store className="size-4" /> Open Artisan Seller Portal
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    onClose();
                    navigate("/admin");
                  }}
                  className="w-full rounded-xl bg-accent py-3 font-semibold text-accent-foreground uppercase tracking-widest text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Store className="size-4" /> Open Admin Control Panel
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  navigate("/cart");
                }}
                className="w-full rounded-xl border border-border bg-muted/40 py-3 font-medium text-foreground uppercase tracking-widest text-xs transition-colors hover:bg-muted flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="size-4" /> My Bag & Orders
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-destructive/30 text-destructive py-3 font-medium uppercase tracking-widest text-xs transition-colors hover:bg-destructive/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          // Login / Register Form
          <div>
            <div className="text-center mb-6">
              <span className="eyebrow text-accent">Lumière Aura</span>
              <h2 className="font-display text-2xl text-foreground mt-1">
                {isRegisterMode ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isRegisterMode
                  ? "Join our atelier as a client or artisan seller"
                  : "Sign in to access your orders and saved wishlist"}
              </p>
            </div>

            {/* Pending Notice */}
            {pendingNotice && (
              <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Account Pending Admin Approval</p>
                  <p className="mt-0.5 text-[0.7rem] leading-relaxed">
                    Your Seller registration is submitted and awaiting review. The Admin will approve your account from the Admin Control Panel.
                  </p>
                </div>
              </div>
            )}

            {/* Role Selection Tabs (Only in Register Mode) */}
            {isRegisterMode && (
              <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-muted/60 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    role === "buyer"
                      ? "bg-card text-accent shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShoppingBag className="size-3.5" /> Buyer (Client)
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    role === "seller"
                      ? "bg-card text-accent shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Store className="size-3.5" /> Seller (Artisan)
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-[0.72rem] tracking-wider text-muted-foreground uppercase mb-1 font-semibold">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[0.72rem] tracking-wider text-muted-foreground uppercase mb-1 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] tracking-wider text-muted-foreground uppercase mb-1 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-royal py-3 font-semibold text-primary-foreground uppercase tracking-widest text-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-2 cursor-pointer shadow-glow"
              >
                {loading
                  ? "Processing..."
                  : isRegisterMode
                  ? role === "seller"
                    ? "Apply for Seller Account"
                    : "Register as Client"
                  : "Sign In"}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-5 text-center text-xs text-muted-foreground">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setPendingNotice(false);
                    }}
                    className="text-accent underline font-medium hover:opacity-80 cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setPendingNotice(false);
                    }}
                    className="text-accent underline font-medium hover:opacity-80 cursor-pointer"
                  >
                    Register here
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
