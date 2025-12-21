import { MainLayout } from "@/layouts";
import { Card, BarChart, PieChart, Table } from "@/shared/components";

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
  { label: "Coca-Cola", value: 240 },
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Visão geral do seu negócio</p>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Vendas Hoje</div>
                <div className="text-2xl font-bold text-gray-900">
                  R$ 12.450
                </div>
                <div className="text-xs text-green-600">+12% vs ontem</div>
              </div>
              <div className="text-gray-400">$</div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <div className="text-sm text-gray-500">Pedidos</div>
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-xs text-green-600">+8% vs ontem</div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <div className="text-sm text-gray-500">
                Produtos Baixo Estoque
              </div>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-xs text-red-500">Atenção necessária</div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <div className="text-sm text-gray-500">Clientes Ativos</div>
              <div className="text-2xl font-bold text-gray-900">1.234</div>
              <div className="text-xs text-green-600">+5 novos hoje</div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card title="Vendas da Semana">
              <BarChart
                data={salesThisWeek}
                height={260}
                valuePrefix="R$ "
                showValues={false}
                barColor="#10b981"
              />
            </Card>
          </div>

          <div>
            <Card title="Top Produtos">
              <BarChart data={topProducts} height={220} barColor="#10b981" />
            </Card>

            <div className="mt-4">
              <Card title="Distribuição">
                <PieChart
                  data={topProducts.map((p) => ({
                    label: p.label,
                    value: p.value,
                  }))}
                  size={160}
                  showLegend={false}
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Sales Table */}
        <Card title="Vendas Recentes">
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
        </Card>
      </div>
    </MainLayout>
  );
};
