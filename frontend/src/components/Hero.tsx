import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { DIVISION_META, DIVISION_ORDER } from "@/lib/config";
import type { DivisionKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useI18n();
  const [active, setActive] = useState<DivisionKey>("custom");
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 20 });
  const glowX = useTransform(mx, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(my, [0, 1], ["20%", "80%"]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const lines = [t.hero.line1, t.hero.line2];

  return (
    <section className="hero-glow relative overflow-hidden" data-testid="hero-section">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#283347 1px, transparent 1px), linear-gradient(90deg, #283347 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-36 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-44">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-edge bg-panel/70 px-4 py-1.5 backdrop-blur"
            data-testid="hero-overline"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t.hero.overline}
            </span>
          </motion.div>

          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className={cn("block", i === 1 && "text-electric")}
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/devis" data-testid="hero-cta-start">
              <Button
                size="lg"
                className="group rounded-full bg-electric px-7 font-heading text-base font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_36px_rgba(10,102,255,0.5)]"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/projets" data-testid="hero-cta-work">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-edge bg-transparent px-7 font-heading text-base text-foreground transition-colors duration-300 hover:border-electric hover:text-electric"
              >
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={() => {
              mx.set(0.5);
              my.set(0.5);
            }}
            className="relative"
            data-testid="hero-showcase"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-2xl border border-edge shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            >
              <motion.div
                className="pointer-events-none absolute inset-0 z-10 opacity-60"
                style={{
                  background: useTransform(
                    [glowX, glowY],
                    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(10,102,255,0.25), transparent 55%)`,
                  ),
                }}
              />
              {DIVISION_ORDER.map((key) => (
                <motion.img
                  key={key}
                  src={DIVISION_META[key].image}
                  alt={t.divisions[key].name}
                  loading="eager"
                  className={cn(
                    "aspect-[4/3] w-full object-cover transition-opacity duration-700",
                    active === key ? "opacity-100" : "absolute inset-0 opacity-0",
                  )}
                  initial={false}
                  animate={{ opacity: active === key ? 1 : 0, scale: active === key ? 1 : 1.06 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background/95 to-transparent p-5">
                <p className="font-heading text-lg font-semibold">{t.divisions[active].name}</p>
                <p className="text-sm text-muted-foreground">{t.divisions[active].tagline}</p>
              </div>
            </motion.div>

            <div className="mt-5 flex flex-wrap gap-2" data-testid="hero-division-switcher">
              {DIVISION_ORDER.map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  data-testid={`hero-switch-${key}`}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                    active === key
                      ? "border-electric bg-electric/15 text-electric"
                      : "border-edge bg-panel/50 text-muted-foreground hover:border-electric/50 hover:text-foreground",
                  )}
                >
                  {DIVISION_META[key].num} · {key}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
