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

export function SideBar() {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: ShoppingCart, label: "PDV" },
    { icon: Package, label: "Produtos" },
    { icon: Tag, label: "Categorias" },
    { icon: Users, label: "Clientes" },
    { icon: FileText, label: "Vendas" },
    { icon: DollarSign, label: "Caixa" },
    { icon: BarChart3, label: "Financeiro" },
    { icon: Store, label: "Lojas" },
    { icon: Settings, label: "Configurações" },
  ];

  return (
    <div className="w-56 h-screen bg-linear-to-b from-emerald-500 to-emerald-600 text-white flex flex-col fixed left-0 top-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-emerald-400">
        <h1 className="text-2xl font-bold">Next Flow PDV</h1>
        <p className="text-emerald-100 text-xs mt-1">
          Sistema de Gerenciamento
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-6 py-3 transition-all cursor-pointer hover:bg-emerald-400 hover:bg-opacity-20 text-emerald-50"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Botão Sair */}
      <div className="p-4 border-t border-emerald-400">
        <button className="w-full flex items-center justify-center gap-3 px-6 py-3 cursor-pointer bg-emerald-400 bg-opacity-50 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-opacity-70 hover:shadow-lg">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}
