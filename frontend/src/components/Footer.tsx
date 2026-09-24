import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE, whatsappUrl } from "@/lib/config";

export function Footer() {
  const { t } = useI18n();
  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/services", label: t.nav.services },
    { to: "/projets", label: t.nav.portfolio },
    { to: "/a-propos", label: t.nav.about },
    { to: "/devis", label: t.nav.quote },
    { to: "/contact", label: t.nav.contact },
  ];
  const divisions = [
    t.divisions.custom.name,
    t.divisions.brand.name,
    t.divisions.design.name,
    t.divisions.digital.name,
  ];

  return (
    <footer className="border-t border-edge bg-panel/30" data-testid="main-footer">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-electric text-white">
                <Zap className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-heading text-xl font-bold">BEKON</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.footer.navTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-electric">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.footer.divisionsTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              {divisions.map((d) => (
                <li key={d} className="text-sm text-muted-foreground">{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.footer.contactTitle}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-electric">{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="transition-colors hover:text-electric">{CONTACT_PHONE}</a>
              </li>
              <li>
                <a href={whatsappUrl(t.whatsappMessage)} target="_blank" rel="noreferrer" className="transition-colors hover:text-electric">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">{t.footer.rights}</p>
          <Link to="/admin/login" className="text-xs text-muted-foreground transition-colors hover:text-electric" data-testid="footer-admin-link">
            {t.footer.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
