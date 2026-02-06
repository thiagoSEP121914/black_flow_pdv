import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "@/shared/components";
import { Header } from "@/shared/components/Header/Header";

const STORAGE_KEY = "nextflow.sidebar.collapsed";

export function MainLayout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  const pageTitles: Record<string, { title: string; subtitle: string }> = useMemo(
    () => ({
      "/dashboard": { title: "Dashboard", subtitle: "Visão geral do seu negocio" },
      "/pdv": { title: "PDV", subtitle: "Frente de caixa e vendas rápidas" },
      "/products": { title: "Produtos", subtitle: "Gerencie produtos" },
      "/categories": { title: "Categorias", subtitle: "Organize seus produtos por categorias" },
      "/clients": { title: "Clientes", subtitle: "Gerencie sua base de clientes" },
      "/sales": { title: "Vendas", subtitle: "Histórico de vendas realizadas" },
      "/cashier": { title: "Caixa", subtitle: "Abra o caixa para iniciar as vendas" },
      "/finance": { title: "Financeiro", subtitle: "Controle financeiro da empresa" },
      "/store": { title: "Lojas", subtitle: "Gerencie suas unidades de negócio" },
      "/settings": { title: "Configurações", subtitle: "Personalize sua experiência" },
      "/promotions": { title: "Promoções", subtitle: "Gerencie ofertas, cupons e regras promocionais" },
      "/agenda": { title: "Agenda", subtitle: "Gerencie seus eventos e tarefas" },
      "/strategy": { title: "Estratégia", subtitle: "Insights e recomendações para seu negócio" },
    }),
    []
  );

  const { title, subtitle } = pageTitles[location.pathname] || {
    title: "Sistema",
    subtitle: "Next Flow PDV",
  };

  return (
    <div className="h-dvh bg-slate-50 flex overflow-hidden">
      <SideBar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="sticky top-0 z-30">
          <Header title={title} subtitle={subtitle} />
        </div>

        <main className="flex-1 min-w-0 overflow-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
