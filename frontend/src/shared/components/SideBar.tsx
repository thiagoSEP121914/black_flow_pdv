import {
  Home,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  BarChart3,
  Tags,
} from "lucide-react";

export function SideBar() {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Package, label: "Vendas", active: false },
    { icon: ShoppingCart, label: "Caixa", active: false },
    { icon: Users, label: "Clientes", active: false },
    { icon: Tags, label: "Produtos", active: false },
    { icon: FileText, label: "Relatórios", active: false },
    { icon: BarChart3, label: "Finanças", active: false },
    { icon: Settings, label: "Configurações", active: false },
  ];

  return (
    <div className="w-64 h-screen bg-linear-to-b from-emerald-500 to-emerald-600 text-white flex flex-col fixed left-0 top-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-emerald-400">
        <h1 className="text-2xl font-bold">Delta PDV</h1>
        <p className="text-emerald-100 text-sm mt-1">Sistema de Vendas</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                item.active
                  ? "bg-white bg-opacity-20 border-l-4 border-white"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="font-bold">U</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Usuário</p>
            <p className="text-emerald-100 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
