import type {
  DemandHeatmapPoint,
  Goal,
  PricingAnalysis,
  StockRecommendation,
  StrategyInsight,
  StrategyKpis,
} from "../types/strategy";

export const STRATEGY_KPIS_MOCK: StrategyKpis = {
  revenue30d: 3271.8,
  profit30d: 612.25,
  marginPct: 18.7,
  activePromos: 3,
  opportunitiesValue: 420.0,
  criticalStock: 4,
  avgCoverageDays: 11,
};

export const STRATEGY_INSIGHTS_MOCK: StrategyInsight[] = [
  {
    id: "ins_1",
    title: "Risco de ruptura em Refrigerantes 2L",
    description:
      "Cobertura média caiu para 3 dias e o lead time do fornecedor é 4 dias.",
    severity: "critical",
    category: "stock",
    impactLabel: "Risco estimado",
    impactValue: "R$ 380/semana",
    recommendation: "Aumentar cobertura alvo para 14 dias e gerar lista de compras.",
    createdAtISO: new Date().toISOString(),
    sku: "REF-2L",
  },
  {
    id: "ins_2",
    title: "Preço acima do mercado em 'Arroz 5kg'",
    description:
      "Seu preço está ~8% acima do concorrente mais próximo, com elasticidade média.",
    severity: "warning",
    category: "pricing",
    impactLabel: "Possível perda",
    impactValue: "até -12% volume",
    recommendation: "Teste reduzir R$ 2,00 e monitore 7 dias.",
    createdAtISO: new Date().toISOString(),
    sku: "ARZ-5KG",
  },
  {
    id: "ins_3",
    title: "Pico de demanda no horário do almoço",
    description:
      "Entre 11h e 13h há aumento consistente de pedidos. O ticket médio sobe ~6%.",
    severity: "info",
    category: "demand",
    impactLabel: "Oportunidade",
    impactValue: "+R$ 150/semana",
    recommendation: "Criar combo almoço e destacar no PDV.",
    createdAtISO: new Date().toISOString(),
  },
  {
    id: "ins_4",
    title: "Clientes recorrentes sem incentivo",
    description:
      "Há um grupo de clientes recorrentes (3+ compras/mês) sem oferta dedicada.",
    severity: "info",
    category: "customers",
    impactLabel: "Upsell",
    impactValue: "+R$ 220/mês",
    recommendation: "Criar cupom de fidelidade com limite por cliente/dia.",
    createdAtISO: new Date().toISOString(),
  },
];

export const PRICING_ANALYSIS_MOCK: PricingAnalysis[] = [
  {
    id: "pr_1",
    sku: "ARZ-5KG",
    name: "Arroz Tipo 1 - 5kg",
    category: "Mercearia",
    cost: 18.9,
    currentPrice: 29.9,
    competitorPrice: 27.5,
    suggestedPrice: 27.9,
    marginPct: 35.7,
    elasticity: "medium",
    last30dQty: 84,
    last30dRevenue: 2511.6,
  },
  {
    id: "pr_2",
    sku: "FEO-1KG",
    name: "Feijão Carioca - 1kg",
    category: "Mercearia",
    cost: 6.2,
    currentPrice: 9.49,
    competitorPrice: 9.29,
    suggestedPrice: 9.29,
    marginPct: 34.7,
    elasticity: "low",
    last30dQty: 160,
    last30dRevenue: 1518.4,
  },
  {
    id: "pr_3",
    sku: "REF-2L",
    name: "Refrigerante Cola - 2L",
    category: "Bebidas",
    cost: 6.8,
    currentPrice: 10.99,
    competitorPrice: 10.49,
    suggestedPrice: 10.49,
    marginPct: 38.1,
    elasticity: "high",
    last30dQty: 210,
    last30dRevenue: 2307.9,
  },
  {
    id: "pr_4",
    sku: "PAP-1KG",
    name: "Batata - 1kg",
    category: "Hortifruti",
    cost: 3.1,
    currentPrice: 6.99,
    competitorPrice: 6.49,
    suggestedPrice: 6.49,
    marginPct: 55.6,
    elasticity: "medium",
    last30dQty: 120,
    last30dRevenue: 838.8,
  },
];

export const STOCK_RECOMMENDATIONS_MOCK: StockRecommendation[] = [
  {
    id: "st_1",
    sku: "REF-2L",
    name: "Refrigerante Cola - 2L",
    category: "Bebidas",
    onHand: 18,
    dailySalesAvg: 7.2,
    coverageDays: 2.5,
    leadTimeDays: 4,
    recommendedBuy: 120,
    reason: "Cobertura < lead time + segurança",
  },
  {
    id: "st_2",
    sku: "ARZ-5KG",
    name: "Arroz Tipo 1 - 5kg",
    category: "Mercearia",
    onHand: 22,
    dailySalesAvg: 2.4,
    coverageDays: 9.2,
    leadTimeDays: 3,
    recommendedBuy: 40,
    reason: "Ajustar para cobertura alvo (14 dias)",
  },
  {
    id: "st_3",
    sku: "FEO-1KG",
    name: "Feijão Carioca - 1kg",
    category: "Mercearia",
    onHand: 95,
    dailySalesAvg: 5.1,
    coverageDays: 18.6,
    leadTimeDays: 3,
    recommendedBuy: 0,
    reason: "Cobertura saudável; sem necessidade de compra",
  },
];

export const GOALS_MOCK: Goal[] = [
  {
    id: "g_1",
    title: "Margem mínima",
    description: "Manter margem acima de 18% no mês",
    current: 18.7,
    target: 18,
    unit: "%",
    dueISO: "2026-02-28",
  },
  {
    id: "g_2",
    title: "Reduzir rupturas",
    description: "Zerar itens críticos no estoque",
    current: 4,
    target: 0,
    unit: "qtd",
    dueISO: "2026-02-20",
  },
  {
    id: "g_3",
    title: "Aumentar lucro",
    description: "Atingir R$ 800 de lucro no mês",
    current: 612.25,
    target: 800,
    unit: "R$",
    dueISO: "2026-02-28",
  },
];

export function buildDemandHeatmapMock(): DemandHeatmapPoint[] {
  const data: DemandHeatmapPoint[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const base = 8;
      const weekendBoost = day === 0 || day === 6 ? 1.3 : 1;
      const peak =
        hour >= 11 && hour <= 13 ? 1.8 : hour >= 17 && hour <= 19 ? 2.0 : hour >= 20 ? 0.75 : 1;

      const sales = Math.round(base * weekendBoost * peak * (0.75 + Math.random() * 0.5));
      data.push({
        dayOfWeek: day,
        hour,
        salesCount: sales,
        revenue: sales * 45,
      });
    }
  }
  return data;
}
