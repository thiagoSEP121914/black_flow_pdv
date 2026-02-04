// src/features/promotions/components/PromotionTypeBadge.tsx
import { type PromotionType } from "../types/promotions";

export default function PromotionTypeBadge({ type }: { type: PromotionType }) {
  const map: Record<PromotionType, { label: string; cls: string }> = {
    category_discount: { label: "Categoria", cls: "bg-violet-50 text-violet-700 border-violet-200" },
    product_discount: { label: "Produto", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    buy_x_pay_y: { label: "Leve X Pague Y", cls: "bg-pink-50 text-pink-700 border-pink-200" },
    combo: { label: "Combo", cls: "bg-orange-50 text-orange-700 border-orange-200" },
    quantity_tier: { label: "Quantidade", cls: "bg-teal-50 text-teal-700 border-teal-200" },
    progressive: { label: "Progressivo", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    happy_hour: { label: "Happy Hour", cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  };

  const it = map[type];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${it.cls}`}>
      {it.label}
    </span>
  );
}
