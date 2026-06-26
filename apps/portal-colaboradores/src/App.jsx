import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { useStore } from "./lib/store";
import { supabaseEnabled, supabase } from "./lib/supabase";
import { bootstrap } from "./lib/db";
import Login from "./pages/Login";
import Catalogo from "./pages/portal/Catalogo";
import Pedido from "./pages/portal/Pedido";
import MeusPedidos from "./pages/portal/MeusPedidos";
import MinhaConta from "./pages/portal/MinhaConta";
import Dashboard from "./pages/admin/Dashboard";
import Importacoes from "./pages/admin/Importacoes";
import Colaboradores from "./pages/admin/Colaboradores";
import CargosKits from "./pages/admin/CargosKits";
import Pedidos from "./pages/admin/Pedidos";
import PedidoFicha from "./pages/admin/PedidoFicha";
import Faturamento from "./pages/admin/Faturamento";

function RequireRole({ role, children }) {
  const session = useStore((s) => s.session);
  if (!session) return <Navigate to="/" replace />;
  if (role && session.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [ready, setReady] = useState(!supabaseEnabled);

  useEffect(() => {
    if (!supabaseEnabled) return;
    let active = true;
    bootstrap().finally(() => { if (active) setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (["SIGNED_IN", "SIGNED_OUT", "TOKEN_REFRESHED"].includes(event)) setTimeout(() => bootstrap(), 0);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-cream text-[13px] text-stone">Carregando…</div>;

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<RequireRole role="colaborador"><Layout /></RequireRole>}>
        <Route path="/portal" element={<Catalogo />} />
        <Route path="/portal/pedido" element={<Pedido />} />
        <Route path="/portal/meus-pedidos" element={<MeusPedidos />} />
        <Route path="/portal/conta" element={<MinhaConta />} />
      </Route>

      <Route element={<RequireRole role="staff"><Layout /></RequireRole>}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/importacoes" element={<Importacoes />} />
        <Route path="/admin/colaboradores" element={<Colaboradores />} />
        <Route path="/admin/cargos" element={<CargosKits />} />
        <Route path="/admin/pedidos" element={<Pedidos />} />
        <Route path="/admin/pedido/:id" element={<PedidoFicha />} />
        <Route path="/admin/faturamento" element={<Faturamento />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
