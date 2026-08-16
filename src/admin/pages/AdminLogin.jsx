import { useNavigate } from "@/shared/lib/router";
import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

import cd from "@/shared/assets/cd.png";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@lumiere.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5">

      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}
      <img
        src={cd}
        alt="Lumière Aura"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* =====================================================
          TRANSPARENT OVERLAY
         
      ===================================================== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#35104F]/20 via-[#7B247F]/10 to-[#C44991]/5" />

      {/* Very soft overlay */}
      <div className="absolute inset-0 bg-black/2" />


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (
            email === "admin@lumiere.com" &&
            password === "admin123"
          ) {
            localStorage.setItem("aura_admin", "1");
            navigate({ to: "/admin" });
          } else {
            setError("Invalid staff credentials.");
          }
        }}
        className="
          relative z-10
          w-full max-w-sm
          rounded-lg
          border border-white/25
          bg-white/10
          p-8
          shadow-2xl
          backdrop-blur-[3px]
        "
      >

        {/* =====================================================
            LOGO
        ===================================================== */}
        <div className="flex items-center gap-3">

          <span
            className="
              grid size-10 place-items-center
              rounded-md
              bg-[#7B247F]/70
              text-white
              shadow-md
            "
          >
            <ShieldCheck className="size-5" />
          </span>

          <div>
            <p className="font-display text-lg tracking-[0.16em] text-white">
              LUMIÈRE
            </p>

            <p className="eyebrow text-[#F6C76B]">
              Control panel
            </p>
          </div>

        </div>


        {/* =====================================================
            TITLE
        ===================================================== */}
        <h1 className="mt-8 text-2xl text-white">
          Staff sign in
        </h1>

        <p className="mt-1 text-xs text-white/75">
          Authorised personnel only.
        </p>


        {/* =====================================================
            EMAIL
        ===================================================== */}
        <label className="mt-6 block text-xs text-white/85">

          Work email

          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="
              mt-2 w-full
              rounded-md
              border border-white/30
              bg-white/10
              px-3 py-2.5
              text-sm text-white
              outline-none
              placeholder:text-white/50
              focus:border-white/60
              focus:bg-white/15
            "
          />

        </label>


        {/* =====================================================
            PASSWORD
        ===================================================== */}
        <label className="mt-4 block text-xs text-white/85">

          Password

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="
              mt-2 w-full
              rounded-md
              border border-white/30
              bg-white/10
              px-3 py-2.5
              text-sm text-white
              outline-none
              placeholder:text-white/50
              focus:border-white/60
              focus:bg-white/15
            "
          />

        </label>


        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}
        {error && (
          <p className="mt-3 text-xs text-red-200">
            {error}
          </p>
        )}


        {/* =====================================================
            SIGN IN BUTTON
        ===================================================== */}
        <button
          type="submit"
          className="
            mt-6
            flex w-full
            items-center justify-center
            gap-2
            rounded-md
            bg-[#7B247F]/75
            py-3.5
            text-[0.72rem]
            tracking-[0.2em]
            text-white
            uppercase
            transition-all
            hover:bg-[#C44991]/80
          "
        >
          <Lock className="size-3.5" />
          Sign in
        </button>


        {/* =====================================================
            DEMO ACCESS
        ===================================================== */}
        <p
          className="
            mt-5
            rounded-md
            border border-white/20
            bg-white/10
            p-3
            text-center
            text-[0.7rem]
            text-white/75
          "
        >
          Demo access — admin@lumiere.com / admin123
        </p>

      </form>
    </div>
  );
}

export default AdminLogin;