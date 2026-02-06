import { Loader2, Download, Sparkles, FlaskConical } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import type { StrategyFilters, StrategyPeriod, SalesChannel } from "../types/strategy";

type Props = {
  filters: StrategyFilters;
  onFiltersChange: (filters: StrategyFilters) => void;
  onGenerateInsights: () => void;
  onSimulate: () => void;
  onExport: () => void;
  isGenerating?: boolean;
};

export default function StrategyHeader({
  filters,
  onFiltersChange,
  onGenerateInsights,
  onSimulate,
  onExport,
  isGenerating = false,
}: Props) {
  const setPeriod = (period: StrategyPeriod) => {
    onFiltersChange({ ...filters, period });
  };

  const setChannel = (channel: SalesChannel) => {
    onFiltersChange({ ...filters, channel });
  };

  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900"> </h1>
          <p className="text-sm text-slate-500 mt-0.5">
             
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outlined" size="sm" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button variant="outlined" size="sm" onClick={onSimulate} className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Simular
          </Button>

          <Button
            size="sm"
            onClick={onGenerateInsights}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Gerar insights
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <Input
              placeholder="Buscar por produto, categoria, insight..."
              value={filters.search ?? ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="md:col-span-3">
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              value={filters.period}
              onChange={(e) => setPeriod(e.target.value as StrategyPeriod)}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="180d">Últimos 180 dias</option>
              <option value="custom">Período custom</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              value={filters.channel}
              onChange={(e) => setChannel(e.target.value as SalesChannel)}
            >
              <option value="all">Todos canais</option>
              <option value="pdv">PDV</option>
              <option value="delivery">Delivery</option>
              <option value="marketplace">Marketplace</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              value={filters.storeId ?? "all"}
              onChange={(e) =>
                onFiltersChange({ ...filters, storeId: e.target.value === "all" ? undefined : e.target.value })
              }
            >
              <option value="all">Todas lojas</option>
              <option value="store_1">Loja 1</option>
              <option value="store_2">Loja 2</option>
            </select>
          </div>

          {filters.period === "custom" ? (
            <>
              <div className="md:col-span-6">
                <Input
                  type="date"
                  value={filters.dateFrom ?? ""}
                  onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="md:col-span-6">
                <Input
                  type="date"
                  value={filters.dateTo ?? ""}
                  onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
