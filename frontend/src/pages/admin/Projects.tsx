import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut, ApiError } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { CATEGORY_LABELS, DIVISION_ORDER, fileUrl } from "@/lib/config";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const inputCls = "border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60";

interface FormState {
  title: string;
  category: string;
  description: string;
  client: string;
  year: string;
  software: string;
  services: string;
  tags: string;
  status: string;
  featured: boolean;
  image_path: string;
  gallery: string[];
  figma_url: string;
}

const emptyForm: FormState = {
  title: "", category: "custom", description: "", client: "", year: "",
  software: "", services: "", tags: "", status: "published", featured: false,
  image_path: "", gallery: [], figma_url: "",
};

const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects } = useQuery({ queryKey: ["admin-projects"], queryFn: () => apiGet<Project[]>("/admin/projects") });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        client: form.client || null,
        year: form.year || null,
        software: split(form.software),
        services: split(form.services),
        tags: split(form.tags),
        status: form.status,
        featured: form.featured,
        image_path: form.image_path || null,
        gallery: form.gallery,
        figma_url: form.figma_url || null,
      };
      if (editing) return apiPut(`/admin/projects/${editing.id}`, payload);
      return apiPost("/admin/projects", payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Réalisation mise à jour" : "Réalisation publiée");
      setOpen(false);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof ApiError ? "Erreur lors de l'enregistrement" : "Erreur"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/projects/${id}`),
    onSuccess: () => {
      toast.success("Réalisation supprimée");
      invalidate();
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, category: p.category, description: p.description,
      client: p.client ?? "", year: p.year ?? "",
      software: p.software.join(", "), services: p.services.join(", "), tags: p.tags.join(", "),
      status: p.status, featured: p.featured, image_path: p.image_path ?? "",
      gallery: p.gallery, figma_url: p.figma_url ?? "",
    });
    setOpen(true);
  };

  const handleUpload = async (file: File, target: "main" | "gallery") => {
    setUploading(true);
    try {
      const { path } = await uploadImage(file);
      if (target === "main") setForm((f) => ({ ...f, image_path: path }));
      else setForm((f) => ({ ...f, gallery: [...f.gallery, path] }));
    } catch {
      toast.error("Upload impossible (format ou taille)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="admin-projects-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">Réalisations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ajoutez, modifiez, publiez ou masquez vos projets.</p>
        </div>
        <Button onClick={openCreate} data-testid="project-add-button" className="rounded-full bg-electric font-semibold text-white hover:bg-[#0052CC]">
          <Plus className="mr-1 h-4 w-4" /> Ajouter une réalisation
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-edge">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge bg-panel/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5">Projet</th>
                <th className="px-5 py-3.5">Catégorie</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5">Mis en avant</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map((p) => (
                <tr key={p.id} className="border-b border-edge/50 transition-colors hover:bg-panel/30" data-testid={`project-row-${p.id}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.image_path ? (
                        <img src={fileUrl(p.image_path)} alt="" className="h-10 w-14 rounded-md object-cover" />
                      ) : (
                        <span className="h-10 w-14 rounded-md bg-panel" />
                      )}
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{CATEGORY_LABELS[p.category] ?? p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", p.status === "published" ? "bg-emerald-500/15 text-emerald-400" : "bg-panel text-muted-foreground")}>
                      {p.status === "published" ? "Publié" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">{p.featured && <Star className="h-4 w-4 fill-electric text-electric" />}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => openEdit(p)} aria-label={`Modifier ${p.title}`} data-testid={`project-edit-${p.id}`} className="mr-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-panel hover:text-electric">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Supprimer « ${p.title} » ?`)) remove.mutate(p.id); }}
                      aria-label={`Supprimer ${p.title}`}
                      data-testid={`project-delete-${p.id}`}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-panel hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(projects ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Aucune réalisation. Cliquez sur « Ajouter une réalisation ».</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-edge bg-card sm:max-w-2xl" data-testid="project-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{editing ? "Modifier la réalisation" : "Ajouter une réalisation"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre du projet *" data-testid="project-form-title" className={inputCls} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="project-form-category" className={cn("h-9 rounded-md border px-3 text-sm", inputCls)}>
              {DIVISION_ORDER.map((c) => <option key={c} value={c}>BEKON {CATEGORY_LABELS[c]}</option>)}
            </select>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} data-testid="project-form-description" className={cn(inputCls, "sm:col-span-2")} />
            <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client" data-testid="project-form-client" className={inputCls} />
            <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Année (ex : 2026)" data-testid="project-form-year" className={inputCls} />
            <Input value={form.software} onChange={(e) => setForm({ ...form, software: e.target.value })} placeholder="Logiciels (séparés par des virgules)" data-testid="project-form-software" className={inputCls} />
            <Input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Services réalisés (virgules)" data-testid="project-form-services" className={inputCls} />
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (virgules)" data-testid="project-form-tags" className={inputCls} />
            <Input value={form.figma_url} onChange={(e) => setForm({ ...form, figma_url: e.target.value })} placeholder="Lien Figma (optionnel)" data-testid="project-form-figma" className={inputCls} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} data-testid="project-form-status" className={cn("h-9 rounded-md border px-3 text-sm", inputCls)}>
              <option value="published">Publié</option>
              <option value="hidden">Masqué</option>
            </select>
            <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} data-testid="project-form-featured" className="h-4 w-4 accent-[#0A66FF]" />
              Mettre en avant sur l'accueil
            </label>

            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image principale</p>
              <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "main"); e.target.value = ""; }} data-testid="project-form-image-input" />
              <div className="flex items-center gap-4">
                {form.image_path && <img src={fileUrl(form.image_path)} alt="Aperçu" className="h-20 w-28 rounded-lg border border-edge object-cover" />}
                <Button type="button" variant="outline" disabled={uploading} onClick={() => imageInput.current?.click()} data-testid="project-form-image-upload" className="rounded-full border-edge bg-transparent">
                  <Upload className="mr-1 h-4 w-4" /> {uploading ? "Upload…" : form.image_path ? "Remplacer" : "Uploader une image"}
                </Button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Galerie</p>
              <input ref={galleryInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => handleUpload(f, "gallery")); e.target.value = ""; }} data-testid="project-form-gallery-input" />
              <div className="flex flex-wrap items-center gap-3">
                {form.gallery.map((g, i) => (
                  <div key={g} className="relative">
                    <img src={fileUrl(g)} alt="" className="h-16 w-24 rounded-lg border border-edge object-cover" />
                    <button onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }))} aria-label="Retirer l'image" className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-white">×</button>
                  </div>
                ))}
                <Button type="button" variant="outline" disabled={uploading} onClick={() => galleryInput.current?.click()} data-testid="project-form-gallery-upload" className="rounded-full border-edge bg-transparent">
                  <Plus className="mr-1 h-4 w-4" /> Ajouter
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={() => save.mutate()}
            disabled={!form.title.trim() || save.isPending || uploading}
            data-testid="project-form-submit"
            className="mt-4 w-full rounded-full bg-electric py-6 font-heading font-semibold text-white hover:bg-[#0052CC]"
          >
            {save.isPending ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Publier la réalisation"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
