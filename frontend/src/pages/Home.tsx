import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Cpu, PenTool, Layers, MonitorSmartphone } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { apiGet } from "@/lib/api";
import { DIVISION_META, DIVISION_ORDER } from "@/lib/config";
import type { Project } from "@/lib/types";

const ICONS = { custom: Cpu, brand: PenTool, design: Layers, digital: MonitorSmartphone };

export default function Home() {
  const { t } = useI18n();
  const { data: featured } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => apiGet<Project[]>("/projects?featured=true"),
    retry: false,
  });
  const { data: recent } = useQuery({
    queryKey: ["projects", "recent"],
    queryFn: () => apiGet<Project[]>("/projects"),
    retry: false,
  });
  const projects = (featured && featured.length > 0 ? featured : recent ?? []).slice(0, 6);

  return (
    <div data-testid="home-page">
      <Hero />
      <Marquee items={t.marquee} slow />

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32" data-testid="services-section">
        <SectionHeading overline={t.home.servicesOverline} title={t.home.servicesTitle} sub={t.home.servicesSub} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIVISION_ORDER.map((key, i) => {
            const Icon = ICONS[key];
            const d = t.divisions[key];
            return (
              <Reveal key={key} delay={i * 0.08}>
                <Link
                  to={`/services#${key}`}
                  data-testid={`service-card-${key}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-electric/70 hover:shadow-[0_24px_60px_rgba(10,102,255,0.16)]"
                >
                  <span className="pointer-events-none absolute -right-4 -top-6 font-heading text-8xl font-bold text-edge/40 transition-colors duration-500 group-hover:text-electric/20">
                    {DIVISION_META[key].num}
                  </span>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-edge bg-panel text-electric transition-all duration-500 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-6 font-heading text-xl font-bold tracking-tight">{d.name}</h3>
                  <p className="relative mt-1 text-xs font-medium uppercase tracking-[0.16em] text-electric">{d.tagline}</p>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{d.summary}</p>
                  <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-electric">
                    {t.home.explore}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-edge bg-panel/20 py-24 md:py-32" data-testid="featured-section">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading overline={t.home.featuredOverline} title={t.home.featuredTitle} />
            <Reveal delay={0.1}>
              <Link to="/projets" data-testid="featured-view-all">
                <Button variant="outline" className="rounded-full border-edge bg-transparent transition-colors hover:border-electric hover:text-electric">
                  {t.home.viewAll}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>
          {projects.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="featured-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <Reveal className="mt-14">
              <div className="rounded-2xl border border-dashed border-edge bg-card/50 p-14 text-center" data-testid="featured-empty">
                <p className="mx-auto max-w-md text-sm text-muted-foreground">{t.home.empty}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32" data-testid="manifesto-section">
        <SectionHeading overline={t.home.manifestoOverline} title={t.home.manifestoTitle} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-edge bg-edge md:grid-cols-3">
          {t.home.manifesto.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col bg-background p-8 transition-colors duration-500 hover:bg-panel/60">
                <span className="font-mono text-sm text-electric">{c.num}</span>
                <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-edge bg-panel/20 py-24 md:py-32" data-testid="process-section">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading overline={t.home.processOverline} title={t.home.processTitle} align="center" />
          <div className="mt-16 flex flex-wrap items-stretch justify-center gap-3">
            {t.home.process.map((step, i) => (
              <Reveal key={step} delay={i * 0.07}>
                <div className="flex items-center gap-3">
                  <div className="group rounded-xl border border-edge bg-card px-5 py-4 text-center transition-all duration-300 hover:border-electric hover:shadow-[0_0_24px_rgba(10,102,255,0.2)]">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-electric">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-sm font-semibold md:text-base">{step}</span>
                  </div>
                  {i < t.home.process.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-edge md:block" aria-hidden />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32" data-testid="cta-section">
        <Reveal>
          <div className="hero-glow relative overflow-hidden rounded-3xl border border-edge p-12 text-center md:p-20">
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              {t.home.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">{t.home.ctaSub}</p>
            <Link to="/devis" data-testid="cta-start-project">
              <Button
                size="lg"
                className="group mt-9 rounded-full bg-electric px-8 font-heading text-base font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_40px_rgba(10,102,255,0.55)]"
              >
                {t.home.ctaButton}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
