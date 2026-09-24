import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionHeading({
  overline,
  title,
  sub,
  align = "left",
}: {
  overline: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-electric">{overline}</p>
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{sub}</p>}
    </motion.div>
  );
}
