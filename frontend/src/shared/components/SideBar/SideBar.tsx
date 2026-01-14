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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

export function SideBar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingCart, label: "PDV", path: "/pdv" },
    { icon: Package, label: "Produtos", path: "/products" },
    { icon: Tag, label: "Categorias", path: "/categories" },
    { icon: Users, label: "Clientes", path: "/clients" },
    { icon: FileText, label: "Vendas", path: "/sales" },
    { icon: DollarSign, label: "Caixa", path: "/cashier" },
    { icon: BarChart3, label: "Financeiro", path: "/finance" },
    { icon: Store, label: "Lojas", path: "/store" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  const { logout } = useAuth();

  return (
    <div className="w-56 h-screen bg-linear-to-b from-emerald-500 to-emerald-600 text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-24 flex flex-col justify-center px-6 border-b border-emerald-400">
        <h1 className="text-2xl font-bold">Next Flow PDV</h1>
        <p className="text-emerald-100 text-xs mt-1">
          Sistema de Gerenciamento
        </p>
      </div>

      {/* Navegação Dinâmica */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-6 py-3 transition-all cursor-pointer hover:bg-emerald-400 hover:bg-opacity-20 text-emerald-50 ${isActive ? "bg-emerald-600 bg-opacity-40" : ""
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sair */}
      <div className="p-4 border-t border-emerald-400">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 cursor-pointer bg-emerald-400 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-opacity-70"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}
