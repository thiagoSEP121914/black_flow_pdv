// src/features/promotions/components/CouponModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {type Coupon } from "../types/promotions";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (coupon: Coupon) => void;
};

export default function CouponModal({ open, onClose, onCreate }: Props) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "amount">("percent");
  const [value, setValue] = useState<number>(10);
  const [startsAt, setStartsAt] = useState<string>(new Date().toISOString().slice(0, 10));
  const [endsAt, setEndsAt] = useState<string>("");
  const [minOrder, setMinOrder] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setCode("");
    setType("percent");
    setValue(10);
    setStartsAt(new Date().toISOString().slice(0, 10));
    setEndsAt("");
    setMinOrder("");
    setUsageLimit("");
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (code.trim().length < 3) return alert("Informe um código válido (mín. 3 caracteres).");

    onCreate({
      id: `c_${Math.random().toString(16).slice(2)}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      minOrderAmount: minOrder ? Number(minOrder) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: 0,
      status: "active",
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="px-5 h-14 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">Novo Cupom</p>
          <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-slate-50 transition">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Código do cupom *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex.: PROMO10"
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="percent">Percentual (%)</option>
                <option value="amount">Valor (R$)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Valor</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Válido a partir de</label>
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Válido até</label>
              <input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Pedido mínimo (R$)</label>
              <input
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="Sem mínimo"
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Limite de uso</label>
              <input
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Ilimitado"
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Criar Cupom
          </button>
        </div>
      </div>
    </div>
  );
}
