import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { apiGet } from "@/lib/api";
import { CATEGORY_LABELS, DIVISION_ORDER } from "@/lib/config";
import type { Project } from "@/lib/types";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["projects", filter],
    queryFn: () => apiGet<Project[]>(filter === "all" ? "/projects" : `/projects?category=${filter}`),
    retry: false,
  });
  const projects = data ?? [];

  return (
    <div className="pt-28 md:pt-36" data-testid="portfolio-page">
      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionHeading overline={t.portfolio.overline} title={t.portfolio.title} sub={t.portfolio.sub} />

        <Reveal className="mt-10">
          <div className="flex flex-wrap gap-2" data-testid="portfolio-filters">
            {["all", ...DIVISION_ORDER].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                data-testid={`filter-${key}`}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300",
                  filter === key
                    ? "border-electric bg-electric text-white shadow-[0_0_20px_rgba(10,102,255,0.35)]"
                    : "border-edge bg-panel/50 text-muted-foreground hover:border-electric/60 hover:text-foreground",
                )}
              >
                {key === "all" ? t.portfolio.all : CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </Reveal>

        {isLoading ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl border border-edge bg-card" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="portfolio-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-14">
            <div className="rounded-2xl border border-dashed border-edge bg-card/50 p-16 text-center" data-testid="portfolio-empty">
              <p className="mx-auto max-w-md text-sm text-muted-foreground">{t.portfolio.empty}</p>
              <Link to="/devis">
                <Button className="mt-6 rounded-full bg-electric font-semibold text-white hover:bg-[#0052CC]" data-testid="portfolio-empty-cta">
                  {t.portfolio.emptyCta}
                </Button>
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
