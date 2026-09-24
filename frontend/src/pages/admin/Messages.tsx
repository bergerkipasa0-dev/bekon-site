import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MailOpen, Mail as MailIcon } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages } = useQuery({ queryKey: ["admin-messages"], queryFn: () => apiGet<Message[]>("/admin/messages") });

  const toggle = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => apiPatch(`/admin/messages/${id}`, { read }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div data-testid="admin-messages-page">
      <h1 className="font-heading text-2xl font-bold md:text-3xl">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages reçus via la page Contact.</p>

      <div className="mt-8 space-y-3">
        {(messages ?? []).length === 0 && (
          <p className="rounded-2xl border border-dashed border-edge p-10 text-center text-sm text-muted-foreground">Aucun message pour le moment.</p>
        )}
        {(messages ?? []).map((m) => (
          <article
            key={m.id}
            data-testid={`message-row-${m.id}`}
            className={cn(
              "rounded-2xl border p-5 transition-colors",
              m.read ? "border-edge bg-card/60" : "border-electric/50 bg-card shadow-[0_0_24px_rgba(10,102,255,0.08)]",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{m.name} <span className="ml-2 text-xs text-muted-foreground">{m.email}</span></p>
                <p className="text-xs text-muted-foreground">{m.phone || "—"} · {format(new Date(m.created_at), "dd/MM/yyyy HH:mm")}</p>
              </div>
              <button
                onClick={() => toggle.mutate({ id: m.id, read: !m.read })}
                data-testid={`message-toggle-${m.id}`}
                className="flex items-center gap-1.5 rounded-full border border-edge px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-electric hover:text-electric"
              >
                {m.read ? <MailIcon className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                {m.read ? "Marquer non lu" : "Marquer lu"}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{m.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
