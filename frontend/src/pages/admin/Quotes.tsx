import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { apiGet, apiPatch } from "@/lib/api";
import { CATEGORY_LABELS, QUOTE_STATUS_LABELS } from "@/lib/config";
import type { Quote } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUSES = Object.keys(QUOTE_STATUS_LABELS);

export default function AdminQuotes() {
  const qc = useQueryClient();
  const { data: quotes } = useQuery({ queryKey: ["admin-quotes"], queryFn: () => apiGet<Quote[]>("/admin/quotes") });
  const [selected, setSelected] = useState<Quote | null>(null);

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiPatch(`/admin/quotes/${id}`, { status }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["admin-quotes"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => toast.error("Erreur"),
  });

  return (
    <div data-testid="admin-quotes-page">
      <h1 className="font-heading text-2xl font-bold md:text-3xl">Demandes de devis</h1>
      <p className="mt-1 text-sm text-muted-foreground">Toutes les demandes envoyées via le formulaire « Démarrer un projet ».</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-edge">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge bg-panel/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5">Client</th>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-5 py-3.5">Budget</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody>
              {(quotes ?? []).map((q) => (
                <tr key={q.id} className="border-b border-edge/50 transition-colors hover:bg-panel/30" data-testid={`quote-row-${q.id}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{CATEGORY_LABELS[q.service] ?? q.service}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{q.budget || "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{format(new Date(q.created_at), "dd/MM/yyyy")}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={q.status}
                      onChange={(e) => setStatus.mutate({ id: q.id, status: e.target.value })}
                      data-testid={`quote-status-${q.id}`}
                      className={cn(
                        "h-8 rounded-full border px-3 text-xs font-semibold",
                        q.status === "new" ? "border-electric bg-electric/15 text-electric" : "border-edge bg-panel text-muted-foreground",
                      )}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{QUOTE_STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelected(q)} aria-label="Voir la fiche" data-testid={`quote-view-${q.id}`} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-panel hover:text-electric">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(quotes ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Aucune demande reçue pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-edge bg-card sm:max-w-xl" data-testid="quote-detail-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Demande de {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</p><p className="mt-1">{selected.email}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Téléphone</p><p className="mt-1">{selected.phone || "—"}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="mt-1">{selected.whatsapp || "—"}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Ville</p><p className="mt-1">{selected.city || "—"}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Budget</p><p className="mt-1">{selected.budget || "À définir"}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Délai</p><p className="mt-1">{selected.deadline || "—"}</p></div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Description</p>
                <p className="mt-1 whitespace-pre-line rounded-xl border border-edge bg-panel/40 p-4 text-muted-foreground">{selected.description}</p>
              </div>
              {selected.files.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Fichiers joints</p>
                  <ul className="mt-2 space-y-2">
                    {selected.files.map((f) => (
                      <li key={f.path}>
                        <a href={`/api/files/${f.path}`} target="_blank" rel="noreferrer" data-testid={`quote-file-${f.filename}`} className="flex items-center gap-2 rounded-lg border border-edge bg-panel/40 px-3 py-2 text-xs transition-colors hover:border-electric hover:text-electric">
                          <Download className="h-3.5 w-3.5" /> {f.filename}
                          <span className="ml-auto text-muted-foreground">{Math.round(f.size / 1024)} Ko</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                onClick={() => window.open(`mailto:${selected.email}?subject=Votre projet — BEKON Studio`)}
                variant="outline"
                data-testid="quote-reply-button"
                className="w-full rounded-full border-edge bg-transparent hover:border-electric hover:text-electric"
              >
                Répondre par e-mail
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
