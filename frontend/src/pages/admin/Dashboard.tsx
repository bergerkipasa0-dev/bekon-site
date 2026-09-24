import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Inbox, Mail, Shapes, Sparkles } from "lucide-react";
import { apiGet } from "@/lib/api";
import { CATEGORY_LABELS, QUOTE_STATUS_LABELS } from "@/lib/config";
import type { Stats } from "@/lib/types";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: () => apiGet<Stats>("/admin/stats") });

  const cards = [
    { label: "Réalisations", value: stats?.projects, icon: FolderKanban, to: "/admin/projets", testid: "stat-projects" },
    { label: "Publiées", value: stats?.published, icon: Sparkles, to: "/admin/projets", testid: "stat-published" },
    { label: "Demandes", value: stats?.quotes, icon: Inbox, to: "/admin/demandes", testid: "stat-quotes" },
    { label: "Nouvelles", value: stats?.new_quotes, icon: Inbox, to: "/admin/demandes", testid: "stat-new-quotes" },
    { label: "Services", value: stats?.services, icon: Shapes, to: "/admin/services", testid: "stat-services" },
    { label: "Messages", value: stats?.messages, icon: Mail, to: "/admin/messages", testid: "stat-messages" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-heading text-2xl font-bold md:text-3xl">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">Vue d'ensemble de l'activité du studio.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.testid}
            to={c.to}
            data-testid={c.testid}
            className="rounded-2xl border border-edge bg-card p-5 transition-all duration-300 hover:border-electric/60"
          >
            <c.icon className="h-5 w-5 text-electric" />
            <p className="mt-4 font-heading text-3xl font-bold">{c.value ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-edge bg-card p-6" data-testid="latest-quotes">
          <h2 className="font-heading text-lg font-semibold">Dernières demandes</h2>
          <ul className="mt-4 space-y-3">
            {(stats?.latest_quotes ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune demande pour le moment.</li>
            )}
            {(stats?.latest_quotes ?? []).map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 rounded-xl border border-edge/60 bg-panel/40 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{q.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[q.service] ?? q.service} · {format(new Date(q.created_at), "dd/MM/yyyy")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-electric/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-electric">
                  {QUOTE_STATUS_LABELS[q.status] ?? q.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-edge bg-card p-6" data-testid="latest-projects">
          <h2 className="font-heading text-lg font-semibold">Derniers projets</h2>
          <ul className="mt-4 space-y-3">
            {(stats?.latest_projects ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune réalisation. Ajoutez votre premier projet !</li>
            )}
            {(stats?.latest_projects ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-edge/60 bg-panel/40 px-4 py-3">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <span className="shrink-0 rounded-full border border-edge px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[p.category] ?? p.category}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
