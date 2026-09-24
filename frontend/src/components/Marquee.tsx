import { cn } from "@/lib/utils";

export function Marquee({ items, slow = false }: { items: string[]; slow?: boolean }) {
  return (
    <div className="relative overflow-hidden border-y border-edge bg-panel/40 py-5" data-testid="editorial-marquee">
      <div className={cn("flex w-max whitespace-nowrap", slow ? "animate-marquee-slow" : "animate-marquee")}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="font-heading text-sm tracking-[0.25em] text-muted-foreground uppercase md:text-base">
                  {item}
                </span>
                <span className="mx-8 inline-block h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
