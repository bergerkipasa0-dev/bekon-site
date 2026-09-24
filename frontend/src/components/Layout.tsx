import { Outlet } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useI18n } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/config";

export default function Layout() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="noise-overlay" aria-hidden />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <a
        href={whatsappUrl(t.whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        data-testid="whatsapp-float"
        aria-label="Discuter sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
