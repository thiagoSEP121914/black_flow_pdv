import { AlertCircle, AlertTriangle, Info, Lightbulb, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { InsightCategory, InsightSeverity, StrategyInsight } from "../types/strategy";

type Props = {
  insight: StrategyInsight;
  onAction?: (insight: StrategyInsight) => void;
  onDismiss?: (insight: StrategyInsight) => void;
};

const severityUI: Record<InsightSeverity, { icon: React.ReactNode; badge: string; border: string; bg: string; label: string }> = {
  critical: { icon: <AlertCircle className="h-4 w-4" />, label: "Crítico", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, label: "Atenção", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
  info: { icon: <Info className="h-4 w-4" />, label: "Info", bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" },
};

const categoryLabel: Record<InsightCategory, string> = {
  pricing: "Precificação",
  stock: "Estoque",
  demand: "Demanda",
  customers: "Clientes",
  mix: "Mix",
  competition: "Concorrência",
};

export default function InsightCard({ insight, onAction, onDismiss }: Props) {
  const s = severityUI[insight.severity];

  return (
    <div className={`border rounded-2xl p-4 shadow-sm ${s.bg} ${s.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}>
              {s.icon}
              {s.label}
            </span>
            <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              {categoryLabel[insight.category]}
            </span>
          </div>

          <div className="mt-2 font-semibold text-slate-900">{insight.title}</div>
          <div className="mt-1 text-sm text-slate-600">{insight.description}</div>

          {(insight.impactLabel || insight.impactValue) ? (
            <div className="mt-3 text-sm">
              <span className="font-semibold text-slate-800">{insight.impactLabel ?? "Impacto"}: </span>
              <span className="text-slate-700">{insight.impactValue ?? "-"}</span>
            </div>
          ) : null}

          {insight.recommendation ? (
            <div className="mt-2 text-sm text-slate-700 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 text-slate-700" />
              <span>{insight.recommendation}</span>
            </div>
          ) : null}
        </div>

        <button
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          onClick={() => onDismiss?.(insight)}
          title="Dispensar"
          type="button"
        >
          <X className="h-4 w-4 text-slate-700" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => onAction?.(insight)}
        >
          Criar ação
        </Button>
        <Button size="sm" variant="outlined" onClick={() => onDismiss?.(insight)}>
          Dispensar
        </Button>
      </div>
    </div>
  );
}
