import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/Marquee";
import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();
  return (
    <div className="pt-28 md:pt-36" data-testid="about-page">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading overline={t.about.overline} title={t.about.title} sub={t.about.sub} />

        <div className="mt-20 space-y-2 pb-10">
          {t.about.chapters.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.06}>
              <article
                className="group grid gap-6 border-t border-edge py-12 transition-colors duration-500 hover:bg-panel/30 md:grid-cols-[120px_1fr] md:px-6"
                data-testid={`about-chapter-${c.num}`}
              >
                <span className="font-heading text-5xl font-bold text-edge transition-colors duration-500 group-hover:text-electric md:text-6xl">
                  {c.num}
                </span>
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{c.title}</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <article className="grid gap-6 border-y border-edge py-12 md:grid-cols-[120px_1fr] md:px-6" data-testid="about-values">
              <span className="font-heading text-5xl font-bold text-electric md:text-6xl">04</span>
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{t.about.valuesTitle}</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {t.about.values.map((v, i) => (
                    <Reveal key={v} delay={i * 0.06}>
                      <span className="rounded-full border border-edge bg-panel px-5 py-2.5 font-heading text-sm font-semibold transition-all duration-300 hover:border-electric hover:text-electric">
                        {v}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
      <div className="pb-10">
        <Marquee items={t.marquee} />
      </div>
    </div>
  );
}
