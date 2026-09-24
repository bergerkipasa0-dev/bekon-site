import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const inputCls = "border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60";

interface FormState {
  key: string;
  name: string;
  tagline: string;
  summary: string;
  items: string;
  image_url: string;
  active: boolean;
  order: number;
}

const emptyForm: FormState = { key: "", name: "", tagline: "", summary: "", items: "", image_url: "", active: true, order: 0 };

export default function AdminServices() {
  const qc = useQueryClient();
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => apiGet<Service[]>("/admin/services") });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        key: form.key.trim(),
        name: form.name,
        tagline: form.tagline,
        summary: form.summary,
        items: form.items.split(",").map((x) => x.trim()).filter(Boolean),
        image_url: form.image_url || null,
        active: form.active,
        order: form.order,
      };
      if (editing) return apiPut(`/admin/services/${editing.id}`, payload);
      return apiPost("/admin/services", payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Service mis à jour" : "Service créé");
      setOpen(false);
      invalidate();
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/services/${id}`),
    onSuccess: () => {
      toast.success("Service supprimé");
      invalidate();
    },
  });

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ key: s.key, name: s.name, tagline: s.tagline, summary: s.summary, items: s.items.join(", "), image_url: s.image_url ?? "", active: s.active, order: s.order });
    setOpen(true);
  };

  return (
    <div data-testid="admin-services-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les pôles et prestations affichés sur le site.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }} data-testid="service-add-button" className="rounded-full bg-electric font-semibold text-white hover:bg-[#0052CC]">
          <Plus className="mr-1 h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(services ?? []).map((s) => (
          <div key={s.id} className="rounded-2xl border border-edge bg-card p-6" data-testid={`service-row-${s.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-bold">{s.name}</p>
                <p className="text-xs uppercase tracking-wider text-electric">{s.tagline}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", s.active ? "bg-emerald-500/15 text-emerald-400" : "bg-panel text-muted-foreground")}>
                {s.active ? "Actif" : "Inactif"}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{s.summary}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(s)} data-testid={`service-edit-${s.id}`} className="rounded-full border-edge bg-transparent">
                <Pencil className="mr-1 h-3.5 w-3.5" /> Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { if (window.confirm(`Supprimer « ${s.name} » ?`)) remove.mutate(s.id); }}
                data-testid={`service-delete-${s.id}`}
                className="rounded-full border-edge bg-transparent text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-edge bg-card sm:max-w-xl" data-testid="service-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{editing ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="Clé (ex : custom)" data-testid="service-form-key" className={inputCls} disabled={!!editing} />
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom *" data-testid="service-form-name" className={inputCls} />
            </div>
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Slogan" data-testid="service-form-tagline" className={inputCls} />
            <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Description" rows={3} data-testid="service-form-summary" className={inputCls} />
            <Input value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="Prestations (séparées par des virgules)" data-testid="service-form-items" className={inputCls} />
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="URL de l'image" data-testid="service-form-image" className={inputCls} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} data-testid="service-form-active" className="h-4 w-4 accent-[#0A66FF]" />
                Service actif
              </label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Ordre" data-testid="service-form-order" className={cn(inputCls, "w-24")} />
            </div>
          </div>
          <Button onClick={() => save.mutate()} disabled={!form.name.trim() || !form.key.trim() || save.isPending} data-testid="service-form-submit" className="mt-4 w-full rounded-full bg-electric py-6 font-heading font-semibold text-white hover:bg-[#0052CC]">
            {save.isPending ? "Enregistrement…" : editing ? "Enregistrer" : "Créer le service"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
