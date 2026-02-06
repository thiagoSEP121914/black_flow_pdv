import { PencilRuler } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { PricingAnalysis } from "../types/strategy";

type Props = {
  items: PricingAnalysis[];
  onSimulate: (p: PricingAnalysis) => void;
  onApplyPrice: (productId: string, newPrice: number) => void;
};

const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PricingAnalysisTable({ items, onSimulate, onApplyPrice }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-auto">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Precificação</h3>
        <p className="text-sm text-slate-500 mt-1">
          Sugestões com base em custo, concorrência e elasticidade
        </p>
      </div>

      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="px-5 py-3 border-b border-slate-100">Produto</th>
            <th className="px-5 py-3 border-b border-slate-100">Custo</th>
            <th className="px-5 py-3 border-b border-slate-100">Preço atual</th>
            <th className="px-5 py-3 border-b border-slate-100">Concorrência</th>
            <th className="px-5 py-3 border-b border-slate-100">Sugestão</th>
            <th className="px-5 py-3 border-b border-slate-100">Margem</th>
            <th className="px-5 py-3 border-b border-slate-100 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{p.name}</div>
                <div className="text-xs text-slate-500">{p.sku} • {p.category}</div>
              </td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{money(p.cost)}</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{money(p.currentPrice)}</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">
                {p.competitorPrice ? money(p.competitorPrice) : "-"}
              </td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm font-semibold text-slate-900">{money(p.suggestedPrice)}</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{p.marginPct.toFixed(1)}%</td>
              <td className="px-5 py-4 border-b border-slate-100 text-right">
                <div className="inline-flex gap-2">
                  <Button size="sm" variant="outlined" className="gap-2" onClick={() => onSimulate(p)}>
                    <PencilRuler className="h-4 w-4" />
                    Simular
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => onApplyPrice(p.id, p.suggestedPrice)}
                  >
                    Aplicar
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                Nenhum item de precificação encontrado.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
