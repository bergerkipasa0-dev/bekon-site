import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiGet, ApiError } from "@/lib/api";
import { CATEGORY_LABELS, fileUrl } from "@/lib/config";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { data: project, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => apiGet<Project>(`/projects/${id}`),
    retry: false,
  });

  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 pt-28" data-testid="project-not-found">
        <p className="text-muted-foreground">{t.project.notFound}</p>
        <Link to="/projets">
          <Button variant="outline" className="rounded-full border-edge bg-transparent">{t.project.back}</Button>
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-5 pt-36 md:px-8">
        <div className="aspect-[16/8] animate-pulse rounded-2xl border border-edge bg-card" />
      </div>
    );
  }

  const meta: [string, string | null | undefined][] = [
    [t.project.client, project.client],
    [t.project.year, project.year],
    [t.project.software, project.software.length ? project.software.join(" · ") : null],
    [t.project.servicesLabel, project.services.length ? project.services.join(" · ") : null],
  ];

  return (
    <div className="pt-28 md:pt-36" data-testid="project-detail-page">
      <div className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <Reveal>
          <Link
            to="/projets"
            data-testid="project-back"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-electric"
          >
            <ArrowLeft className="h-4 w-4" /> {t.project.back}
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-electric px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {CATEGORY_LABELS[project.category] ?? project.category}
            </span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-edge bg-panel px-3 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{project.title}</h1>
        </Reveal>

        {project.image_path && (
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-edge">
              <img src={fileUrl(project.image_path)} alt={project.title} className="w-full object-cover" />
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
          <Reveal delay={0.15}>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
              {project.description}
            </p>
            {project.gallery.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t.project.gallery}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((g) => (
                    <img key={g} src={fileUrl(g)} alt={`${project.title} — galerie`} loading="lazy" className="rounded-xl border border-edge object-cover" />
                  ))}
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-2xl border border-edge bg-card p-6">
              <dl className="space-y-4">
                {meta.filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-sm text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              {project.figma_url && (
                <a href={project.figma_url} target="_blank" rel="noreferrer" data-testid="project-figma-link">
                  <Button variant="outline" className="mt-6 w-full rounded-full border-edge bg-transparent hover:border-electric hover:text-electric">
                    {t.project.figma} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
              <Link to={`/devis?service=${project.category}`} data-testid="project-similar-cta">
                <Button className="group mt-3 w-full rounded-full bg-electric font-semibold text-white hover:bg-[#0052CC]">
                  {t.project.similar}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
