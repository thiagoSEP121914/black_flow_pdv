// src/features/promotions/components/PromotionStatusPill.tsx
import {type PromotionStatus } from "../types/promotions";

export default function PromotionStatusPill({ status }: { status: PromotionStatus }) {
  const map: Record<PromotionStatus, { label: string; cls: string }> = {
    active: { label: "Ativa", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scheduled: { label: "Agendada", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    draft: { label: "Rascunho", cls: "bg-slate-50 text-slate-700 border-slate-200" },
    ended: { label: "Encerrada", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  const it = map[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${it.cls}`}>
      {it.label}
    </span>
  );
}
