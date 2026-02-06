export type SalesChannel = "pdv" | "delivery" | "marketplace" | "all";

export type StrategyPeriod = "7d" | "30d" | "90d" | "180d" | "custom";

export type StrategyTab =
  | "overview"
  | "pricing"
  | "demand"
  | "stock"
  | "customers"
  | "mix"
  | "competition"
  | "goals";

export type StrategyFilters = {
  period: StrategyPeriod;
  dateFrom?: string; // yyyy-mm-dd (quando period="custom")
  dateTo?: string;   // yyyy-mm-dd (quando period="custom")
  storeId?: string;
  channel: SalesChannel;
  search?: string;
};

export type InsightSeverity = "critical" | "warning" | "info";

export type InsightCategory =
  | "pricing"
  | "stock"
  | "demand"
  | "customers"
  | "mix"
  | "competition";

export type StrategyInsight = {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  category: InsightCategory;

  // “Impacto” em linguagem de negócio (opcional)
  impactLabel?: string; // ex: "Risco de ruptura"
  impactValue?: string; // ex: "R$ 380/semana"

  recommendation?: string; // ex: "Aumente cobertura para 14 dias"
  createdAtISO: string;

  // referência rápida (opcional)
  productId?: string;
  sku?: string;
};

export type StrategyKpis = {
  revenue30d: number;       // R$
  profit30d: number;        // R$
  marginPct: number;        // %
  activePromos: number;     // qtd
  opportunitiesValue: number; // R$
  criticalStock: number;    // qtd itens
  avgCoverageDays: number;  // dias
};

export type PricingAnalysis = {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number; // R$
  currentPrice: number; // R$
  competitorPrice?: number; // R$ (se houver)
  suggestedPrice: number; // R$
  marginPct: number; // %
  elasticity: "low" | "medium" | "high";
  last30dQty: number;
  last30dRevenue: number; // R$
};

export type DemandHeatmapPoint = {
  dayOfWeek: number; // 0 dom ... 6 sáb
  hour: number;      // 0..23
  salesCount: number;
  revenue: number;   // R$
};

export type StockRecommendation = {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  dailySalesAvg: number;
  coverageDays: number;
  leadTimeDays: number;
  recommendedBuy: number; // 0 se não recomendar compra
  reason: string;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  current: number;
  target: number;
  unit: "R$" | "%" | "qtd" | "dias";
  dueISO?: string;
};
