import { useMemo } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Tag,
  Users,
  FileText,
  BarChart3,
  DollarSign,
  Store,
  Settings,
  LogOut,
  CalendarDays,
  Percent,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type SideBarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function SideBar({ collapsed, onToggleCollapsed }: SideBarProps) {
  const { logout } = useAuth();

  const menuItems = useMemo(
    () => [
      { icon: Home, label: "Dashboard", path: "/dashboard" },
      { icon: ShoppingCart, label: "PDV", path: "/pdv" },
      { icon: Package, label: "Produtos", path: "/products" },
      { icon: Tag, label: "Categorias", path: "/categories" },
      { icon: Users, label: "Clientes", path: "/clients" },
      { icon: FileText, label: "Vendas", path: "/sales" },
      { icon: DollarSign, label: "Caixa", path: "/cashier" },
      { icon: BarChart3, label: "Financeiro", path: "/finance" },

      { icon: CalendarDays, label: "Agenda", path: "/agenda" },
      { icon: Percent, label: "Promoções", path: "/promotions" },
      { icon: Lightbulb, label: "Estratégia", path: "/strategy" },

      { icon: Store, label: "Lojas", path: "/store" },
      { icon: Settings, label: "Configurações", path: "/settings" },
    ],
    []
  );

  return (
    <aside
      className={[
        "h-dvh shrink-0",
        "bg-linear-to-b from-emerald-500 to-emerald-600 text-white",
        "flex flex-col",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-56",
      ].join(" ")}
    >
      {/* Logo */}
      <div
        className={[
          "border-b border-emerald-400",
          "px-4",
          "h-20 flex items-center",
          collapsed ? "justify-center" : "justify-start",
        ].join(" ")}
      >
        {collapsed ? (
          <div className="h-10 w-10 rounded-xl bg-emerald-400/40 flex items-center justify-center font-bold">
            NF
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">Next Flow ERP</h1>
            <p className="text-emerald-100 text-xs mt-1">
              Sistema de Gerenciamento
            </p>
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav
        className={[
          "flex-1 min-h-0 py-2",
          // só aparece scroll se REALMENTE precisar (e escondemos a barra)
          "overflow-y-auto",
          "[scrollbar-width:none]",
          "[-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              [
                "mx-2 my-1 rounded-xl transition-all",
                "flex items-center gap-3",
                collapsed ? "justify-center px-0 py-2.5" : "px-4 py-2.5",
                "hover:bg-emerald-400/20 text-emerald-50",
                isActive ? "bg-emerald-900/20" : "",
              ].join(" ")
            }
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Recolher + Sair */}
      <div className="p-3 border-t border-emerald-400 space-y-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={[
            "w-full rounded-lg transition-all duration-200",
            "bg-emerald-400/30 hover:bg-emerald-400/45",
            "flex items-center gap-3",
            collapsed ? "justify-center px-0 py-3" : "justify-center px-4 py-3",
          ].join(" ")}
          aria-label={collapsed ? "Expandir" : "Recolher"}
          title={collapsed ? "Expandir" : "Recolher"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="font-medium">Recolher</span>}
        </button>

        <button
          type="button"
          onClick={logout}
          className={[
            "w-full rounded-lg transition-all duration-200",
            "bg-emerald-400/50 hover:bg-emerald-400/70",
            "flex items-center gap-3",
            collapsed ? "justify-center px-0 py-3" : "justify-center px-4 py-3",
          ].join(" ")}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  );
}
