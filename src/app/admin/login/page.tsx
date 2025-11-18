"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle rate limiting
        if (res.status === 429) {
          setError(data.error || "Demasiados intentos. Por favor intenta más tarde.");
        } else if (res.status === 401) {
          const attemptsMsg = data.attemptsRemaining !== undefined
            ? ` Intentos restantes: ${data.attemptsRemaining}`
            : "";
          setError(`${data.error}${attemptsMsg}`);
        } else {
          setError(data.error || "Error al iniciar sesión");
        }
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="gradient-mesh" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-glow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-tecno-mint text-xl font-bold">TECNO</span>
              <span className="text-tecno-bolt text-xl font-bold">EXPRESS</span>
              <span className="text-tecno-bolt text-2xl">⚡</span>
            </Link>
            <h1 className="text-2xl font-bold text-gradient mb-2">Panel de Administración</h1>
            <p className="text-text-muted text-sm">Inicia sesión para gestionar productos</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-main mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
                placeholder="Ingrese su usuario"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
                placeholder="Ingrese su contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-tecno-cyan hover:text-tecno-mint transition-colors">
              ← Volver a la tienda
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-4 glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">
            🔒 Acceso exclusivo para administradores
          </p>
        </div>
      </div>
    </div>
  );
}
