import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "./ui";
import { useStore } from "../lib/store";
import { logout, currentProfile } from "../lib/auth";

const COLAB = [
  { to: "/portal", label: "Catálogo", end: true },
  { to: "/portal/meus-pedidos", label: "Meus pedidos" },
  { to: "/portal/conta", label: "Minha conta" },
];
const STAFF = [
  { to: "/admin", label: "Painel", end: true },
  { to: "/admin/importacoes", label: "Importações" },
  { to: "/admin/colaboradores", label: "Colaboradores" },
  { to: "/admin/cargos", label: "Cargos & Kits" },
  { to: "/admin/pedidos", label: "Pedidos" },
];

export default function Layout() {
  const session = useStore((s) => s.session);
  const nav = useNavigate();
  const links = session?.role === "staff" ? STAFF : COLAB;
  const profile = currentProfile();

  return (
    <div className="min-h-screen bg-cream">
      <header className="no-print sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to={session?.role === "staff" ? "/admin" : "/portal"}><Logo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive ? "bg-wine/10 text-wine" : "text-ink-soft hover:text-wine"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] text-stone sm:block">
              {session?.role === "staff" ? "Equipe Office" : profile?.nome}
            </span>
            <button
              onClick={async () => { await logout(); nav("/"); }}
              className="inline-flex items-center gap-1 text-[12px] text-ink-soft hover:text-wine"
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
