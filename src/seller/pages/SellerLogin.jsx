import { useState } from "react";
import { Link, useNavigate } from "@/shared/lib/router";
import { Sparkles, Loader2, Store, Lock, Mail, User, Phone, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/lib/auth";
import api from "@/shared/services/api";
import cd from "@/shared/assets/cd.png";

function SellerLogin() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingNotice, setPendingNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPendingNotice(false);
    setErrorMessage("");

    try {
      if (isRegister) {
        // Register new seller
        const res = await api.register({
          name,
          email,
          password,
          role: "seller",
          store_name: storeName || `${name}'s Atelier`,
          phone
        });

        if (res.pendingApproval) {
          setPendingNotice(true);
          toast.info("Registration submitted! Your account is pending Admin approval.");
        } else {
          toast.success("Registration submitted!");
          setIsRegister(false);
        }
      } else {
        // Login seller
        const res = await authLogin(email, password);

        if (res.user.role !== "seller" && res.user.role !== "admin") {
          setErrorMessage("This account is registered as a Buyer. Please use standard customer login.");
          return;
        }

        toast.success(`Welcome back, ${res.user.name}!`);
        navigate({ to: "/seller" });
      }
    } catch (err) {
      if (err.pendingApproval) {
        setPendingNotice(true);
      } else {
        setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
      }
      toast.error(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      {/* Luxury Background (Matches AdminLogin 1:1) */}
      <img
        src={cd}
        alt="Lumière Aura"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#35104F]/60 via-[#7B247F]/40 to-[#24102F]/70 backdrop-blur-xs" />

      {/* Login Card (Matches AdminLogin 1:1) */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-md text-white">
        {/* Logo & Header */}
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#7B247F] text-white shadow-md">
            <Store className="size-6" />
          </span>
          <div>
            <p className="font-display text-xl tracking-[0.16em] text-white">LUMIÈRE</p>
            <p className="eyebrow text-[#F6C76B] flex items-center gap-1">
              <Sparkles className="size-3" /> Artisan Seller Portal
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold">
          {isRegister ? "Apply as an Artisan" : "Artisan Sign In"}
        </h1>
        <p className="mt-1 text-xs text-white/75">
          {isRegister
            ? "Publish your bespoke fragrance and skincare creations on Lumière."
            : "Authorized atelier partners and verified brand sellers only."}
        </p>

        {/* Tab Switcher */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-white/10 p-1 border border-white/15">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setPendingNotice(false);
              setErrorMessage("");
            }}
            className={`rounded-lg py-2 text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer ${
              !isRegister ? "bg-white/25 text-white shadow-sm" : "text-white/65 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setPendingNotice(false);
              setErrorMessage("");
            }}
            className={`rounded-lg py-2 text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer ${
              isRegister ? "bg-white/25 text-white shadow-sm" : "text-white/65 hover:text-white"
            }`}
          >
            Register Store
          </button>
        </div>

        {/* Pending Approval Notice Banner */}
        {pendingNotice && (
          <div className="mt-4 rounded-xl bg-amber-500/20 border border-amber-400/40 p-4 text-xs text-amber-100 flex items-start gap-3 backdrop-blur-xs">
            <AlertCircle className="size-5 shrink-0 text-[#F6C76B] mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-[#F6C76B]">Account Pending Approval</p>
              <p className="mt-1 leading-relaxed text-[0.72rem] text-white/90">
                Your store registration has been sent to the Admin Control Panel. You will receive immediate access once approved.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="mt-4 text-xs font-medium text-red-200 bg-red-950/50 p-3 rounded-xl border border-red-500/40">
            {errorMessage}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-white/85 mb-1.5">
                  Artisan Full Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/85 mb-1.5">
                  Brand / Store Name *
                </label>
                <input
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Vance Haute Parfumerie"
                  className="w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/85 mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-white/85 mb-1.5">
              Work Email Address *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artisan@atelier.com"
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/85 mb-1.5">
              Secret Password *
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 text-xs font-semibold tracking-[0.18em] uppercase text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Processing...
              </>
            ) : isRegister ? (
              "Submit Store for Admin Approval"
            ) : (
              <>
                <Lock className="size-3.5" /> Enter Artisan Portal
              </>
            )}
          </button>
        </form>

        {/* Footer Switches */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs text-white/75">
          <Link to="/" className="hover:text-white underline">
            Return to Store
          </Link>
          <Link
            to="/admin-login"
            className="inline-flex items-center gap-1.5 text-[#F6C76B] hover:underline font-semibold"
          >
            <ShieldCheck className="size-3.5" /> Platform Admin Sign In <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;
