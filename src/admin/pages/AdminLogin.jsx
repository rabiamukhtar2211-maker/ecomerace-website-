import { useNavigate, Link } from "@/shared/lib/router";
import { useState } from "react";
import { Lock, ShieldCheck, Store, ArrowRight } from "lucide-react";

import cd from "@/shared/assets/cd.png";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const validAdmins = [
      "rabia5848@gmail.com",
      "rabiamukhtar5848@gmail.com",
      "admin@lumiere.com"
    ];

    const validPasswords = ["rabia1122", "admin123", "password123"];

    if (validAdmins.includes(cleanEmail) && validPasswords.includes(cleanPass)) {
      localStorage.setItem("aura_admin", "1");
      localStorage.setItem("la_role", "admin");
      navigate({ to: "/admin" });
    } else {
      setError("Invalid admin credentials. Please verify your email and password.");
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      {/* Background */}
      <img
        src={cd}
        alt="Lumière Aura"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#35104F]/60 via-[#7B247F]/40 to-[#24102F]/70 backdrop-blur-xs" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-md text-white"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#7B247F] text-white shadow-md">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <p className="font-display text-xl tracking-[0.16em] text-white">LUMIÈRE</p>
            <p className="eyebrow text-[#F6C76B]">Platform Control Panel</p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold">Staff & Admin Sign In</h1>
        <p className="mt-1 text-xs text-white/75">
          Authorized atelier administrators and management only.
        </p>

        {/* Email */}
        <label className="mt-5 block text-xs font-medium text-white/85">
          Admin Email
          <input
            type="email"
            required
            autoComplete="off"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder=""
            className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-white/70"
          />
        </label>

        {/* Password */}
        <label className="mt-4 block text-xs font-medium text-white/85">
          Password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder=""
            className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-white/70"
          />
        </label>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-300 bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 text-xs font-semibold tracking-[0.18em] uppercase text-primary-foreground shadow-glow hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Lock className="size-3.5" /> Enter Admin Panel
        </button>

        {/* Dedicated Switcher to Seller Portal */}
        <div className="mt-6 pt-5 border-t border-white/15 text-center">
          <p className="text-xs text-white/70">Are you an artisan selling your creations?</p>
          <Link
            to="/seller-login"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-xs font-semibold text-[#F6C76B] transition-colors w-full"
          >
            <Store className="size-3.5" /> Go to Artisan Seller Portal <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;