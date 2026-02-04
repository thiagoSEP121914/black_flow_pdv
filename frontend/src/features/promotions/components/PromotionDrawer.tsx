// src/features/promotions/components/PromotionDrawer.tsx
import { X } from "lucide-react";
import { type Promotion } from "../types/promotions";
import PromotionStatusPill from "./PromotionStatusPill";
import PromotionTypeBadge from "./PromotionTypeBadge";

type Props = {
  open: boolean;
  promotion: Promotion | null;
  onClose: () => void;
  onEdit: (p: Promotion) => void;
  onEnd: (id: string) => void;
  onDelete: (id: string) => void;
};

const fmt = (iso?: string) => {
  if (!iso) return "Sem limite";
  return new Date(iso).toLocaleString("pt-BR");
};

export default function PromotionDrawer({ open, promotion, onClose, onEdit, onEnd, onDelete }: Props) {
  if (!open || !promotion) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] bg-white border-l border-slate-200 shadow-xl">
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PromotionTypeBadge type={promotion.type} />
            <PromotionStatusPill status={promotion.status} />
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-slate-50 transition"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{promotion.name}</h3>
            {promotion.description && <p className="text-slate-500 mt-1">{promotion.description}</p>}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500">PERÍODO</p>
            <p className="text-sm text-slate-900 mt-1">{fmt(promotion.startsAt)} → {fmt(promotion.endsAt)}</p>

            <p className="text-xs font-semibold text-slate-500 mt-4">REGRA</p>
            <p className="text-sm text-slate-900 mt-1">{promotion.ruleSummary}</p>

            <p className="text-xs font-semibold text-slate-500 mt-4">PRIORIDADE</p>
            <p className="text-sm text-slate-900 mt-1">{promotion.priority}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500">ACÚMULO</p>
            <div className="mt-2 space-y-2 text-sm text-slate-800">
              <div className="flex items-center justify-between">
                <span>Acumula com cupons</span>
                <span className={promotion.stackable.coupons ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                  {promotion.stackable.coupons ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Acumula com desconto manual</span>
                <span className={promotion.stackable.manualDiscount ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                  {promotion.stackable.manualDiscount ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Acumula com outras promoções</span>
                <span className={promotion.stackable.otherPromos ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                  {promotion.stackable.otherPromos ? "Sim" : "Não"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onEdit(promotion)}
              className="h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 transition"
            >
              Editar
            </button>

            <button
              onClick={() => {
                if (confirm("Encerrar esta promoção agora?")) onEnd(promotion.id);
              }}
              className="h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-sm font-semibold text-white transition"
            >
              Encerrar
            </button>

            <button
              onClick={() => {
                if (confirm("Excluir esta promoção? Esta ação não pode ser desfeita.")) onDelete(promotion.id);
              }}
              className="h-10 col-span-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-semibold text-white transition"
            >
              Excluir
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
