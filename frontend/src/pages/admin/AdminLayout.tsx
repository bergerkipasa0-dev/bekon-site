import { useEffect } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Shapes, Inbox, Mail, LogOut, Zap, Globe } from "lucide-react";
import { useAdmin } from "@/lib/auth";
import { endSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/projets", label: "Réalisations", icon: FolderKanban },
  { to: "/admin/services", label: "Services", icon: Shapes },
  { to: "/admin/demandes", label: "Demandes", icon: Inbox },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminLayout() {
  const { data: user, isLoading, isError } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" data-testid="admin-loading">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-electric" />
      </div>
    );
  }
  if (isError || !user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-background text-foreground" data-testid="admin-layout">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-edge bg-panel/40 p-5 lg:flex">
        <Link to="/admin" className="flex items-center gap-2" data-testid="admin-logo">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-electric text-white">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-heading text-lg font-bold">
            BEKON <span className="text-electric">Admin</span>
          </span>
        </Link>
        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Navigation admin">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`admin-nav-${l.to.split("/").pop()}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                  isActive ? "bg-electric/15 text-electric" : "text-muted-foreground hover:bg-panel hover:text-foreground",
                )
              }
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-edge pt-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="admin-view-site">
            <Globe className="h-4 w-4" /> Voir le site
          </Link>
          <button
            onClick={() => endSession("/admin/login")}
            data-testid="admin-logout"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <div className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-edge bg-background/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Zap className="h-5 w-5 shrink-0 text-electric" />
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold",
                  isActive ? "bg-electric text-white" : "bg-panel text-muted-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button onClick={() => endSession("/admin/login")} aria-label="Déconnexion" className="ml-auto shrink-0 text-muted-foreground" data-testid="admin-logout-mobile">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
