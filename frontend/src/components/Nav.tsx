import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/services", label: t.nav.services },
    { to: "/projets", label: t.nav.portfolio },
    { to: "/a-propos", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-edge/60 bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
      data-testid="main-nav"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" className="group flex items-center gap-2" data-testid="nav-logo" aria-label="BEKON — Accueil">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-electric text-white transition-transform duration-300 group-hover:rotate-12">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">BEKON</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-testid={`nav-link-${link.to === "/" ? "home" : link.to.slice(1)}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground",
                location.pathname === link.to && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-edge bg-panel/60 p-0.5" data-testid="lang-switcher">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-${l}`}
                aria-label={l === "fr" ? "Passer en français" : "Switch to English"}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                  lang === l ? "bg-electric text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <Link to="/devis" className="hidden lg:block" data-testid="nav-cta-start">
            <Button className="rounded-full bg-electric px-5 font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_28px_rgba(10,102,255,0.45)]">
              {t.nav.start}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-edge text-foreground lg:hidden"
                  data-testid="mobile-menu-trigger"
                  aria-label="Ouvrir le menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="border-edge bg-background">
              <nav className="mt-10 flex flex-col gap-2" aria-label="Navigation mobile">
                {links.map((link) => (
                  <SheetClose
                    key={link.to}
                    render={
                      <Link
                        to={link.to}
                        data-testid={`mobile-nav-${link.to === "/" ? "home" : link.to.slice(1)}`}
                        className="rounded-lg px-4 py-3 font-heading text-2xl font-semibold text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <SheetClose render={<Link to="/devis" data-testid="mobile-nav-cta" className="mt-4" />}>
                  <Button className="w-full rounded-full bg-electric py-6 font-heading text-lg font-semibold text-white">
                    {t.nav.start}
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
