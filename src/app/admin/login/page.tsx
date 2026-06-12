"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, AlertCircle } from "lucide-react";
import LogoMark from "@/components/LogoMark";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "neon-input w-full rounded-xl px-4 py-3 text-sm";

  return (
    <div
      className="page-animate min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(42,79,255,0.2) 0%, transparent 60%), #0A0E27",
      }}
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="section-reveal relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <LogoMark size={114} priority className="mx-auto mb-4 pulse-glow" />
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
            ADMIN PANEL
          </h1>
          <p className="text-[#B0C4DE] text-sm">Futuristic RUN 2026 · PSTI FEST</p>
        </div>

        <div className="card-animated glass-card rounded-2xl p-8 border border-[#1E3A5F]">
          {error && (
            <div className="flex items-center gap-2 bg-[#FF006E]/10 border border-[#FF006E]/30 rounded-xl p-3 mb-5">
              <AlertCircle size={16} className="text-[#FF006E] flex-shrink-0" />
              <p className="text-[#FF006E] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="stagger-list space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#B0C4DE] mb-1.5">Email Admin</label>
              <input
                type="email"
                className={inp}
                placeholder="email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0C4DE] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inp} pr-10`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0C4DE] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <><Zap size={14} /> MASUK</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
