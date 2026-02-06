import InsightCard from "./InsightCard";
import type { StrategyInsight } from "../types/strategy";

type Props = {
  insights: StrategyInsight[];
  onAction: (insight: StrategyInsight) => void;
  onDismiss: (insight: StrategyInsight) => void;
};

export default function InsightsFeed({ insights, onAction, onDismiss }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Insights acionáveis</h3>
        <p className="text-sm text-slate-500 mt-1">
          O que fazer agora para melhorar resultado, estoque e demanda
        </p>
      </div>

      <div className="p-5 space-y-3">
        {insights.map((ins) => (
          <InsightCard key={ins.id} insight={ins} onAction={onAction} onDismiss={onDismiss} />
        ))}

        {insights.length === 0 ? (
          <div className="text-sm text-slate-500 py-8 text-center">
            Nenhum insight encontrado com os filtros atuais.
          </div>
        ) : null}
      </div>
    </div>
  );
}
