import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { apiGet } from "@/lib/api";
import { DIVISION_META, DIVISION_ORDER } from "@/lib/config";
import type { Service } from "@/lib/types";

export default function Services() {
  const { t } = useI18n();
  const location = useLocation();
  const { data: apiServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiGet<Service[]>("/services"),
    retry: false,
  });

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [location.hash]);

  return (
    <div className="pt-28 md:pt-36" data-testid="services-page">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading overline={t.servicesPage.overline} title={t.servicesPage.title} sub={t.servicesPage.sub} />

        <div className="mt-20 space-y-24 pb-24">
          {DIVISION_ORDER.map((key, idx) => {
            const fallback = t.divisions[key];
            const api = apiServices?.find((s) => s.key === key);
            const name = api?.name || fallback.name;
            const tagline = api?.tagline || fallback.tagline;
            const summary = api?.summary || fallback.summary;
            const items = api && api.items.length > 0 ? api.items : fallback.items;
            const image = api?.image_url || DIVISION_META[key].image;
            const reversed = idx % 2 === 1;
            return (
              <section key={key} id={key} data-testid={`service-section-${key}`} className="scroll-mt-28">
                <div className={`grid items-center gap-10 lg:grid-cols-2 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <Reveal>
                    <div className="group relative overflow-hidden rounded-2xl border border-edge">
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 font-mono text-xs text-electric backdrop-blur">
                        {DIVISION_META[key].num}
                      </span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-electric">{tagline}</p>
                    <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{name}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{summary}</p>
                    <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {t.servicesPage.included}
                    </h3>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {key === "custom" && (
                      <div className="mt-8">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                          {t.servicesPage.finitionsTitle}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {t.servicesPage.finitions.map((f) => (
                            <span key={f} className="rounded-full border border-edge bg-panel px-3.5 py-1.5 text-xs font-medium text-foreground/80">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Link to={`/devis?service=${key}`} data-testid={`service-quote-${key}`}>
                      <Button className="group mt-9 rounded-full bg-electric px-6 font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_28px_rgba(10,102,255,0.45)]">
                        {t.servicesPage.quoteCta}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </Reveal>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
