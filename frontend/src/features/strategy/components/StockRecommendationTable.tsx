import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { StockRecommendation } from "../types/strategy";

type Props = {
  items: StockRecommendation[];
  onGeneratePurchaseList: (items: StockRecommendation[]) => void;
};

export default function StockRecommendationTable({ items, onGeneratePurchaseList }: Props) {
  const buyList = items.filter((x) => x.recommendedBuy > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-auto">
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Estoque</h3>
          <p className="text-sm text-slate-500 mt-1">
            Recomendações com base em cobertura e lead time
          </p>
        </div>

        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          onClick={() => onGeneratePurchaseList(buyList)}
          disabled={buyList.length === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Gerar lista de compras ({buyList.length})
        </Button>
      </div>

      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="px-5 py-3 border-b border-slate-100">Produto</th>
            <th className="px-5 py-3 border-b border-slate-100">Em estoque</th>
            <th className="px-5 py-3 border-b border-slate-100">Venda/dia</th>
            <th className="px-5 py-3 border-b border-slate-100">Cobertura</th>
            <th className="px-5 py-3 border-b border-slate-100">Lead time</th>
            <th className="px-5 py-3 border-b border-slate-100">Recomendado</th>
            <th className="px-5 py-3 border-b border-slate-100">Motivo</th>
          </tr>
        </thead>

        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{p.name}</div>
                <div className="text-xs text-slate-500">{p.sku} • {p.category}</div>
              </td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{p.onHand}</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{p.dailySalesAvg.toFixed(1)}</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">
                {p.coverageDays.toFixed(1)} dias
              </td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{p.leadTimeDays} dias</td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm font-semibold">
                {p.recommendedBuy > 0 ? (
                  <span className="text-emerald-700">{p.recommendedBuy}</span>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </td>
              <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">{p.reason}</td>
            </tr>
          ))}

          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                Nenhuma recomendação de estoque.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
