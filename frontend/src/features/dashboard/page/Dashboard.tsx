import { MainLayout } from "@/layouts";
import { Card, BarChart, LineChart, Table } from "@/shared/components";
import { DollarSign, ShoppingCart, AlertTriangle, Users } from "lucide-react";

const salesThisWeek = [
  { label: "Seg", value: 4200 },
  { label: "Ter", value: 3800 },
  { label: "Qua", value: 5200 },
  { label: "Qui", value: 4800 },
  { label: "Sex", value: 6500 },
  { label: "Sáb", value: 7300 },
  { label: "Dom", value: 6100 },
];

const topProducts = [
  { label: "Coca-Cola 2L", value: 240 },
  { label: "Pão Francês", value: 190 },
  { label: "Leite Integral", value: 160 },
  { label: "Arroz 5kg", value: 140 },
  { label: "Feijão 1kg", value: 120 },
];

const recentSales = [
  { id: "#001", client: "Maria Santos", value: 156.9, time: "há 5 min" },
  { id: "#002", client: "João Oliveira", value: 89.5, time: "há 12 min" },
  { id: "#003", client: "Ana Costa", value: 234.0, time: "há 25 min" },
  { id: "#004", client: "Pedro Lima", value: 67.8, time: "há 45 min" },
];

export const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Vendas Hoje
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  R$ 12.450
                </div>
                <div className="text-xs text-emerald-600 mt-2 font-semibold">
                  +12% vs ontem
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Pedidos
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">156</div>
                <div className="text-xs text-emerald-600 mt-2 font-semibold">
                  +8% vs ontem
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Produtos Baixo Estoque
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">23</div>
                <div className="text-xs text-red-500 mt-2 font-semibold">
                  Atenção necessária
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Clientes Ativos
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  1.234
                </div>
                <div className="text-xs text-emerald-600 mt-2 font-semibold">
                  +5 novos hoje
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Sales Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 px-5 pt-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Vendas da Semana
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Total: R$ 37.900,00
                  </div>
                </div>
                <a
                  href="#"
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Ver relatório →
                </a>
              </div>
              <div className="px-5 pb-5 flex-1 flex items-end">
                <LineChart
                  data={salesThisWeek}
                  height={180}
                  lineColor="#10b981"
                  showGrid={true}
                  valuePrefix="R$ "
                />
              </div>
            </Card>
          </div>

          {/* Right: Top Products */}
          <div>
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 px-5 pt-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Top Produtos
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Unidades vendidas
                  </div>
                </div>
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
                >
                  ↗
                </a>
              </div>
              <div className="px-5 pb-5 flex-1 flex items-end">
                <BarChart
                  data={topProducts}
                  height={180}
                  direction="horizontal"
                  barColor="#10b981"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Sales Table */}
        <Card
          title="Vendas Recentes"
          actions={
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-emerald-600 font-medium transition-colors"
            >
              Ver todas →
            </a>
          }
        >
          <div className="px-5 pb-5">
            <Table
              columns={[
                { key: "id", header: "ID" },
                { key: "client", header: "Cliente" },
                {
                  key: "value",
                  header: "Valor",
                  render: (row: { value: number }) =>
                    `R$ ${row.value.toFixed(2)}`,
                },
                { key: "time", header: "Tempo" },
              ]}
              data={recentSales}
            />
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
