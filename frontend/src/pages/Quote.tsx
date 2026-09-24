import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Cpu, PenTool, Layers, MonitorSmartphone, Paperclip, X, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n";
import { submitQuote } from "@/lib/upload";
import { DIVISION_ORDER } from "@/lib/config";
import type { DivisionKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS = { custom: Cpu, brand: PenTool, design: Layers, digital: MonitorSmartphone };
const ALLOWED_EXT = ["jpg", "jpeg", "png", "pdf", "svg", "ai", "psd", "zip"];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Quote() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const initial = params.get("service");
  const [step, setStep] = useState(0);
  const [service, setService] = useState<DivisionKey | null>(
    DIVISION_ORDER.includes(initial as DivisionKey) ? (initial as DivisionKey) : null,
  );
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "", city: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const totalSteps = 6;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const valid: File[] = [];
    for (const f of Array.from(list)) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXT.includes(ext) || f.size > 25 * 1024 * 1024) {
        toast.error(`${f.name} — format ou taille non autorisé`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const canContinue =
    step === 0 ? service !== null
    : step === 1 ? description.trim().length > 3
    : step === 5 ? form.name.trim().length > 1 && /.+@.+\..+/.test(form.email)
    : true;

  const submit = async () => {
    if (!service) return;
    setSending(true);
    try {
      await submitQuote({ service, description, budget, deadline, ...form, files });
      setDone(true);
    } catch {
      toast.error(t.quote.errorGeneric);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-5 pt-28" data-testid="quote-success">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-lg rounded-3xl border border-edge bg-card p-12 text-center"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric/15 text-electric">
            <PartyPopper className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-bold">{t.quote.successTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.quote.successText}</p>
          <Link to="/">
            <Button className="mt-8 rounded-full bg-electric font-semibold text-white hover:bg-[#0052CC]" data-testid="quote-success-home">
              {t.quote.successCta}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36" data-testid="quote-page">
      <div className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        <SectionHeading overline={t.quote.overline} title={t.quote.title} sub={t.quote.sub} />

        <div className="mt-12">
          <div className="flex items-center justify-between gap-1" data-testid="quote-stepper">
            {t.quote.steps.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500",
                    i < step
                      ? "border-electric bg-electric text-white"
                      : i === step
                        ? "border-electric bg-electric/15 text-electric shadow-[0_0_16px_rgba(10,102,255,0.35)]"
                        : "border-edge bg-panel text-muted-foreground",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn("hidden text-[10px] uppercase tracking-wider sm:block", i === step ? "text-electric" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t.quote.stepOf} {step + 1} {t.quote.of} {totalSteps}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-edge bg-card p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {step === 0 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.serviceTitle}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {DIVISION_ORDER.map((key) => {
                      const Icon = ICONS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => setService(key)}
                          data-testid={`quote-service-${key}`}
                          className={cn(
                            "flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300",
                            service === key
                              ? "border-electric bg-electric/10 shadow-[0_0_24px_rgba(10,102,255,0.2)]"
                              : "border-edge bg-panel/50 hover:border-electric/50",
                          )}
                        >
                          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors", service === key ? "bg-electric text-white" : "bg-panel text-electric")}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block font-heading font-semibold">{t.divisions[key].name}</span>
                            <span className="block text-xs text-muted-foreground">{t.divisions[key].tagline}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.descTitle}</h2>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.quote.descPlaceholder}
                    rows={7}
                    data-testid="quote-description"
                    className="mt-6 border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.budgetTitle}</h2>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {t.quote.budgets.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        data-testid={`quote-budget-${b}`}
                        className={cn(
                          "rounded-full border px-6 py-3 font-heading text-sm font-semibold transition-all duration-300",
                          budget === b
                            ? "border-electric bg-electric text-white shadow-[0_0_20px_rgba(10,102,255,0.35)]"
                            : "border-edge bg-panel/50 text-muted-foreground hover:border-electric/60 hover:text-foreground",
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.deadlineTitle}</h2>
                  <Input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder={t.quote.deadlinePlaceholder}
                    data-testid="quote-deadline"
                    className="mt-6 border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.filesTitle}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">{t.quote.filesHint}</p>
                  <input
                    ref={fileInput}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.svg,.ai,.psd,.zip"
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                    data-testid="quote-file-input"
                  />
                  <button
                    onClick={() => fileInput.current?.click()}
                    data-testid="quote-add-files"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-edge bg-panel/40 px-6 py-10 text-sm text-muted-foreground transition-all duration-300 hover:border-electric hover:text-electric"
                  >
                    <Paperclip className="h-4 w-4" /> {t.quote.addFiles}
                  </button>
                  {files.length > 0 && (
                    <ul className="mt-4 space-y-2" data-testid="quote-file-list">
                      {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-xl border border-edge bg-panel/60 px-4 py-2.5 text-sm">
                          <span className="truncate">{f.name}</span>
                          <button
                            onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                            aria-label={`Retirer ${f.name}`}
                            data-testid={`quote-file-remove-${i}`}
                            className="ml-3 text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="font-heading text-xl font-bold md:text-2xl">{t.quote.contactTitle}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={`${t.quote.name} *`} data-testid="quote-name" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={`${t.quote.email} *`} data-testid="quote-email" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.quote.phone} data-testid="quote-phone" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                    <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder={t.quote.whatsapp} data-testid="quote-whatsapp" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder={t.quote.city} data-testid="quote-city" className="border-edge bg-panel/50 text-foreground placeholder:text-muted-foreground/60" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              data-testid="quote-prev"
              className="rounded-full border-edge bg-transparent disabled:opacity-30"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> {t.quote.prev}
            </Button>
            {step < totalSteps - 1 ? (
              <Button
                onClick={() => canContinue && setStep((s) => s + 1)}
                disabled={!canContinue}
                data-testid="quote-next"
                className="group rounded-full bg-electric px-6 font-semibold text-white hover:bg-[#0052CC] disabled:opacity-40"
              >
                {t.quote.next}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={sending || !canContinue}
                data-testid="quote-submit"
                className="rounded-full bg-electric px-7 font-heading font-semibold text-white transition-all duration-300 hover:bg-[#0052CC] hover:shadow-[0_0_32px_rgba(10,102,255,0.5)] disabled:opacity-40"
              >
                {sending ? t.quote.sending : t.quote.submit}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
