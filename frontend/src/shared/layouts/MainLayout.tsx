import { SideBar } from "@/shared/components";
import { Header } from "@/shared/components/Header/Header";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Visão geral do seu negocio",
    },
    "/pdv": { title: "PDV", subtitle: "Frente de caixa e vendas rápidas" },
    "/products": { title: "Produtos", subtitle: "Gerencie produtos" },
    "/categories": {
      title: "Categorias",
      subtitle: "Organize seus produtos por categorias",
    },
    "/clients": {
      title: "Clientes",
      subtitle: "Gerencie sua base de clientes",
    },
    "/sales": { title: "Vendas", subtitle: "Histórico de vendas realizadas" },
    "/cashier": {
      title: "Caixa",
      subtitle: "Abra o caixa para iniciar as vendas",
    },
    "/finance": {
      title: "Financeiro",
      subtitle: "Controle financeiro da empresa",
    },
    "/store": { title: "Lojas", subtitle: "Gerencie suas unidades de negócio" },
    "/settings": {
      title: "Configurações",
      subtitle: "Personalize sua experiência",
    },
    "/promotions": { title: "Promoções", subtitle: "Gerencie ofertas, cupons e regras promocionais" },
    "/agenda": { title: "Agenda", subtitle: "Gerencie seus eventos e tarefas" },
    "/strategy": { title: "Estratégia", subtitle: "Insights e recomendações para seu negócio" },
  };
  const { title, subtitle } = pageTitles[location.pathname] || {
    title: "Sistema",
    subtitle: "Next Flow PDV",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />{" "}
          {/* Aqui serão renderizadas as páginas (Dashboard, Pos, etc) */}
        </main>
      </div>
    </div>
  );
};
