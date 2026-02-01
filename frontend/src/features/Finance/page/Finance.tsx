import { Card, LineChart, PieChart } from "@/shared/components";
import { ExportToLayout } from "@/shared/components/ExportToLayout/ExportToLayout";
import { PageLayout } from "@/shared/layouts/PageLayout";
import { FinanceCards } from "../components/FinanceCards";
import { FinanceTable } from "../components/FinanceTable";
import { Button } from "@/shared/components/ui/Button";

const cashFlowData = [
  { label: "Jan", value: 45000 },
  { label: "Fev", value: 52000 },
  { label: "Mar", value: 48000 },
  { label: "Abr", value: 61000 },
  { label: "Mai", value: 55000 },
  { label: "Jun", value: 67000 },
];

const expensesByCategory = [
  { label: "Fornecedores", value: 18000, color: "#10b981" }, // emerald-500
  { label: "Funcionários", value: 12000, color: "#06b6d4" }, // cyan-500
  { label: "Aluguel", value: 6000, color: "#3b82f6" }, // blue-500
  { label: "Outros", value: 4000, color: "#f59e0b" }, // amber-500
];

export function Finance() {
  return (
    <PageLayout>
      <div className="flex flex-col h-full overflow-y-auto pr-2 space-y-6">
        <FinanceCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Fluxo de Caixa
                </h3>
                <Button
                  variant="outlined"
                  size="sm"
                  className="text-gray-500 hover:text-emerald-600 border-gray-200"
                >
                  Últimos 6 meses
                </Button>
              </div>
              <div className="h-[300px] w-full">
                <LineChart
                  data={cashFlowData}
                  height={300}
                  lineColor="#10b981"
                  showGrid={true}
                  valuePrefix="R$ "
                />
              </div>
            </Card>
          </div>

          {/* Despesas por Categoria */}
          <div>
            <Card className="h-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Despesas por Categoria
              </h3>
              <div className="flex items-center justify-center">
                <PieChart
                  data={expensesByCategory}
                  size={220}
                  showLegend={true}
                  showPercentage={false}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Transactions Table */}
        <FinanceTable />
        <ExportToLayout />
      </div>
    </PageLayout>
  );
}
