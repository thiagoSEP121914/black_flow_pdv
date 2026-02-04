// src/features/promotions/components/PromotionsHeader.tsx
import { Filter, Plus, Search } from "lucide-react";
import {type PromotionFilters } from "../types/promotions";

type Props = {
  filters: PromotionFilters;
  onFiltersChange: (next: PromotionFilters) => void;
  onNewPromotion: () => void;
};

export default function PromotionsHeader({ filters, onFiltersChange, onNewPromotion }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">    </h1>
          <p className="text-slate-500 mt-1"> </p>
        </div>

        <button
          onClick={onNewPromotion}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] transition"
        >
          <Plus className="h-4 w-4" />
          Nova Promoção
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Buscar promoções..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 lg:w-[180px]"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativas</option>
          <option value="scheduled">Agendadas</option>
          <option value="draft">Rascunho</option>
          <option value="ended">Encerradas</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as any })}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 lg:w-[220px]"
        >
          <option value="all">Todos os tipos</option>
          <option value="product_discount">Desconto por Produto</option>
          <option value="category_discount">Desconto por Categoria</option>
          <option value="buy_x_pay_y">Leve X Pague Y</option>
          <option value="combo">Combo</option>
          <option value="quantity_tier">Desconto por Quantidade</option>
          <option value="progressive">Progressivo</option>
          <option value="happy_hour">Happy Hour</option>
        </select>

        <button
          className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
          title="Filtros avançados (MVP depois)"
          type="button"
        >
          <Filter className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
