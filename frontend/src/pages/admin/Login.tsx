import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Zap, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost, ApiError } from "@/lib/api";
import { beginSession } from "@/lib/session";
import type { AdminUser } from "@/lib/types";

function formatError(err: unknown): string {
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | null)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e) => e?.msg ?? String(e)).join(" ");
  }
  return "Connexion impossible. Réessayez.";
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiPost<AdminUser>("/auth/login", { email, password });
      beginSession();
      navigate("/admin");
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5" data-testid="admin-login-page">
      <div className="noise-overlay" aria-hidden />
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-edge md:grid-cols-2">
        <div className="hero-glow hidden flex-col justify-between p-10 md:flex">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-electric text-white">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-xl font-bold">BEKON</span>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold leading-tight tracking-tight">
              BEKON <span className="text-electric">Admin</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Gérez vos réalisations, services et demandes de devis — sans toucher au code.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-electric" />
            Accès sécurisé — réservé à l'administrateur
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card p-8 md:p-10"
        >
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-electric text-white">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-lg font-bold">BEKON Admin</span>
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold md:mt-0">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">Entrez vos identifiants administrateur.</p>
          <form onSubmit={submit} className="mt-8 space-y-4" data-testid="admin-login-form">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              data-testid="admin-login-email"
              className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60"
            />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              data-testid="admin-login-password"
              className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60"
            />
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive" data-testid="admin-login-error">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              data-testid="admin-login-submit"
              className="w-full rounded-full bg-electric py-6 font-heading font-semibold text-white hover:bg-[#0052CC]"
            >
              <Lock className="mr-1 h-4 w-4" />
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
