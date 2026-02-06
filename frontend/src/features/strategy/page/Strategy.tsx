import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import StrategyHeader from "../components/StrategyHeader";
import StrategyKpiRow from "../components/StrategyKpiRow";
import InsightsFeed from "../components/InsightsFeed";
import PricingAnalysisTable from "../components/PricingAnalysisTable";
import DemandHeatmap from "../components/DemandHeatmap";
import StockRecommendationTable from "../components/StockRecommendationTable";
import GoalsPanel from "../components/GoalsPanel";

import type { StrategyFilters, StrategyInsight, StrategyTab } from "../types/strategy";
import {
  GOALS_MOCK,
  PRICING_ANALYSIS_MOCK,
  STOCK_RECOMMENDATIONS_MOCK,
  STRATEGY_INSIGHTS_MOCK,
  STRATEGY_KPIS_MOCK,
  buildDemandHeatmapMock,
} from "../mock/strategyMock";

const TABS: { key: StrategyTab; label: string; hideSm?: boolean }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "pricing", label: "Precificação" },
  { key: "demand", label: "Demanda" },
  { key: "stock", label: "Estoque" },
  { key: "customers", label: "Clientes", hideSm: true },
  { key: "mix", label: "Mix", hideSm: true },
  { key: "competition", label: "Concorrência", hideSm: true },
  { key: "goals", label: "Metas" },
];

export default function Strategy() {
  const [tab, setTab] = useState<StrategyTab>("overview");
  const [isGenerating, setIsGenerating] = useState(false);

  const [filters, setFilters] = useState<StrategyFilters>({
    period: "30d",
    channel: "all",
    search: "",
  });

  const demandPoints = useMemo(() => buildDemandHeatmapMock(), []);

  const filteredInsights = useMemo(() => {
    const q = (filters.search ?? "").trim().toLowerCase();
    let list = [...STRATEGY_INSIGHTS_MOCK];

    if (q) {
      list = list.filter((x) =>
        (x.title + " " + x.description + " " + (x.sku ?? "")).toLowerCase().includes(q)
      );
    }
    return list;
  }, [filters.search]);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsGenerating(false);
    toast.success("Insights gerados! (mock)");
  };

  const handleSimulate = () => toast.info("Simulador de cenários (em desenvolvimento).");
  const handleExport = () => toast.info("Export (em desenvolvimento).");

  const handleInsightAction = (insight: StrategyInsight) => {
    toast.info(`Ação criada para: ${insight.title}`);
  };

  const handleInsightDismiss = (insight: StrategyInsight) => {
    toast.info(`Insight dispensado: ${insight.title}`);
  };

  const handlePriceSimulate = () => {
    toast.info("Simulação de preço (mock) — próxima etapa a gente abre modal.");
  };

  const handleApplyPrice = (_productId: string, newPrice: number) => {
    toast.success(`Preço aplicado (mock): R$ ${newPrice.toFixed(2)}`);
  };

  const handleGeneratePurchaseList = (items: unknown[]) => {
    toast.success(`Lista de compras gerada (mock): ${items.length} itens`);
  };

  const Placeholder = ({ title, desc }: { title: string; desc: string }) => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{desc}</div>
    </div>
  );

  const content = (() => {
    if (tab === "overview") {
      return (
        <div className="space-y-6">
          <StrategyKpiRow kpis={STRATEGY_KPIS_MOCK} />
          <InsightsFeed
            insights={filteredInsights}
            onAction={handleInsightAction}
            onDismiss={handleInsightDismiss}
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <StockRecommendationTable
              items={STOCK_RECOMMENDATIONS_MOCK}
              onGeneratePurchaseList={handleGeneratePurchaseList}
            />
            <PricingAnalysisTable
              items={PRICING_ANALYSIS_MOCK}
              onSimulate={() => handlePriceSimulate()}
              onApplyPrice={handleApplyPrice}
            />
          </div>
        </div>
      );
    }

    if (tab === "pricing") {
      return (
        <PricingAnalysisTable
          items={PRICING_ANALYSIS_MOCK}
          onSimulate={() => handlePriceSimulate()}
          onApplyPrice={handleApplyPrice}
        />
      );
    }

    if (tab === "demand") {
      return <DemandHeatmap points={demandPoints} />;
    }

    if (tab === "stock") {
      return (
        <StockRecommendationTable
          items={STOCK_RECOMMENDATIONS_MOCK}
          onGeneratePurchaseList={handleGeneratePurchaseList}
        />
      );
    }

    if (tab === "goals") {
      return <GoalsPanel goals={GOALS_MOCK} />;
    }

    if (tab === "customers") {
      return <Placeholder title="Clientes" desc="Cluster/RFM, recorrência, ticket, churn (próxima etapa)." />;
    }

    if (tab === "mix") {
      return <Placeholder title="Mix" desc="Curva ABC, mix ideal por canal e sazonalidade (próxima etapa)." />;
    }

    return <Placeholder title="Concorrência" desc="Comparativo regional, preço médio por categoria (próxima etapa)." />;
  })();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">
        <StrategyHeader
          filters={filters}
          onFiltersChange={setFilters}
          onGenerateInsights={handleGenerateInsights}
          onSimulate={handleSimulate}
          onExport={handleExport}
          isGenerating={isGenerating}
        />

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-2 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "h-9 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors",
                  tab === t.key
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-600 hover:bg-slate-100",
                  t.hideSm ? "hidden md:inline-flex items-center" : "inline-flex items-center",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {content}
      </div>
    </div>
  );
}
