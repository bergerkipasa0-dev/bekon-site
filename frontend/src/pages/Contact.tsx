import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SiInstagram, SiBehance, SiDribbble } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";
import { apiPost } from "@/lib/api";
import { CONTACT_EMAIL, CONTACT_PHONE, whatsappUrl } from "@/lib/config";

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiPost("/messages", form);
      toast.success(t.contact.sent);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error(t.contact.error);
    } finally {
      setSending(false);
    }
  };

  const channels = [
    { icon: MessageCircle, label: t.contact.whatsappLabel, value: CONTACT_PHONE, href: whatsappUrl(t.whatsappMessage), testid: "contact-whatsapp" },
    { icon: Phone, label: t.contact.phoneLabel, value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`, testid: "contact-phone" },
    { icon: Mail, label: t.contact.emailLabel, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, testid: "contact-email" },
    { icon: MapPin, label: t.contact.locationLabel, value: t.contact.locationValue, href: null, testid: "contact-location" },
  ];

  return (
    <div className="pt-28 md:pt-36" data-testid="contact-page">
      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionHeading overline={t.contact.overline} title={t.contact.title} sub={t.contact.sub} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t.contact.channels}</h2>
              <div className="mt-5 space-y-3">
                {channels.map((c) => {
                  const inner = (
                    <div className="flex items-center gap-4 rounded-2xl border border-edge bg-card p-5 transition-all duration-300 hover:border-electric/70 hover:shadow-[0_12px_36px_rgba(10,102,255,0.12)]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-panel text-electric">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{c.label}</span>
                        <span className="mt-0.5 block text-sm font-medium">{c.value}</span>
                      </span>
                    </div>
                  );
                  return c.href ? (
                    <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" data-testid={c.testid}>
                      {inner}
                    </a>
                  ) : (
                    <div key={c.label} data-testid={c.testid}>{inner}</div>
                  );
                })}
              </div>
              <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t.contact.socialsLabel}</h2>
              <div className="mt-5 flex gap-3">
                {[
                  { icon: SiInstagram, label: "Instagram" },
                  { icon: SiBehance, label: "Behance" },
                  { icon: SiDribbble, label: "Dribbble" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    data-testid={`contact-social-${s.label.toLowerCase()}`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-card text-muted-foreground transition-all duration-300 hover:border-electric hover:text-electric"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={submit} className="rounded-3xl border border-edge bg-card p-6 md:p-8" data-testid="contact-form">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.name} data-testid="contact-name" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.email} data-testid="contact-email-input" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
              </div>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.contact.phone} data-testid="contact-phone-input" className="mt-4 border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
              <Textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.messagePlaceholder} data-testid="contact-message" className="mt-4 border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
              <Button
                type="submit"
                disabled={sending}
                data-testid="contact-submit"
                className="group mt-6 w-full rounded-full bg-electric py-6 font-heading font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_32px_rgba(10,102,255,0.5)]"
              >
                {sending ? t.contact.sending : t.contact.send}
                <Send className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
