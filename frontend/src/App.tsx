import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/SmoothScroll";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import About from "@/pages/About";
import Quote from "@/pages/Quote";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProjects from "@/pages/admin/Projects";
import AdminServices from "@/pages/admin/Services";
import AdminQuotes from "@/pages/admin/Quotes";
import AdminMessages from "@/pages/admin/Messages";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <SmoothScroll>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projets" element={<Portfolio />} />
            <Route path="/projets/:id" element={<ProjectDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/devis" element={<Quote />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projets" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="demandes" element={<AdminQuotes />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
        <Toaster />
      </SmoothScroll>
    </LanguageProvider>
  );
}
