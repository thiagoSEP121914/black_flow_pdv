import { TrendingUp, DollarSign, Package, AlertTriangle, Gauge, Tag } from "lucide-react";
import type { StrategyKpis } from "../types/strategy";

type Props = {
  kpis: StrategyKpis;
};

function KpiCard({
  icon,
  label,
  value,
  hint,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white border rounded-2xl shadow-sm p-4 ${alert ? "border-red-200" : "border-slate-200"}`}>
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${alert ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-700"}`}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export default function StrategyKpiRow({ kpis }: Props) {
  const money = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <KpiCard
        icon={<DollarSign className="h-4 w-4" />}
        label="Receita (30d)"
        value={money(kpis.revenue30d)}
      />
      <KpiCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Lucro (30d)"
        value={money(kpis.profit30d)}
        hint={`Margem: ${kpis.marginPct.toFixed(1)}%`}
      />
      <KpiCard
        icon={<Tag className="h-4 w-4" />}
        label="Promoções ativas"
        value={`${kpis.activePromos}`}
      />
      <KpiCard
        icon={<Gauge className="h-4 w-4" />}
        label="Oportunidades"
        value={money(kpis.opportunitiesValue)}
        hint="Upsell/combos/ajustes"
      />
      <KpiCard
        icon={<AlertTriangle className="h-4 w-4" />}
        label="Estoque crítico"
        value={`${kpis.criticalStock}`}
        alert={kpis.criticalStock > 0}
        hint="itens em risco"
      />
      <KpiCard
        icon={<Package className="h-4 w-4" />}
        label="Cobertura média"
        value={`${kpis.avgCoverageDays.toFixed(0)} dias`}
      />
    </div>
  );
}
