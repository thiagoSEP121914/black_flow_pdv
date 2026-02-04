// src/features/promotions/components/CouponTable.tsx
import { Plus } from "lucide-react";
import { type Coupon } from "../types/promotions";

type Props = {
  coupons: Coupon[];
  onNewCoupon: () => void;
};

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "Sem limite");

export default function CouponTable({ coupons, onNewCoupon }: Props) {
  return (
    <div>
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Cupons de Desconto</h3>
          <p className="text-sm text-slate-500 mt-1">Códigos que clientes podem usar no checkout</p>
        </div>

        <button
          onClick={onNewCoupon}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <Plus className="h-4 w-4" />
          Novo Cupom
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Código</th>
              <th className="px-5 py-3 font-semibold">Desconto</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Validade</th>
              <th className="px-5 py-3 font-semibold">Uso</th>
              <th className="px-5 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-800">
                    {c.code}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-800 font-semibold">
                  {c.type === "percent" ? `${c.value}%` : `R$ ${c.value.toFixed(2)}`}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                    {c.status === "active" ? "Ativo" : c.status === "expired" ? "Expirado" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  <div>{fmtDate(c.startsAt)}</div>
                  <div className="text-slate-500">até {fmtDate(c.endsAt)}</div>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {c.usageLimit ? `${c.usedCount} / ${c.usageLimit}` : c.usedCount}
                </td>
                <td className="px-5 py-4 text-right text-slate-500">…</td>
              </tr>
            ))}

            {coupons.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                  Nenhum cupom cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
