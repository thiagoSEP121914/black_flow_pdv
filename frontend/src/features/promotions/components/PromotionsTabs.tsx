// src/features/promotions/components/PromotionsTabs.tsx
export type PromotionsTabKey = "overview" | "promotions" | "coupons" | "manual" | "stacking" | "audit";

type Props = {
  value: PromotionsTabKey;
  onChange: (v: PromotionsTabKey) => void;
};

const tabs: Array<{ key: PromotionsTabKey; label: string }> = [
  { key: "overview", label: "Visão Geral" },
  { key: "promotions", label: "Promoções" },
  { key: "coupons", label: "Cupons" },
  { key: "manual", label: "Desconto Manual" },
  { key: "stacking", label: "Acúmulo" },
  { key: "audit", label: "Auditoria" },
];

export default function PromotionsTabs({ value, onChange }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-2 py-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-transparent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
