// src/features/promotions/components/ManualDiscountPolicyPanel.tsx
import { type ManualDiscountPolicy } from "../types/promotions";

export default function ManualDiscountPolicyPanel({ policy }: { policy: ManualDiscountPolicy }) {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Políticas de Desconto Manual</h3>
          <p className="text-sm text-slate-500 mt-1">
            Configure limites e regras para descontos aplicados pelo operador no PDV
          </p>
        </div>

        <button
          className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          type="button"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-slate-900">Limites Globais</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Desconto máximo por pedido (%)</label>
            <input
              defaultValue={policy.maxDiscountPerOrderPercent}
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Desconto máximo por item (%)</label>
            <input
              defaultValue={policy.maxDiscountPerItemPercent}
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-slate-900">Limites por Função</p>
        <div className="mt-4 space-y-4">
          {policy.roleLimits.map((r) => (
            <div key={r.role} className="border border-slate-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-900 capitalize">{r.role}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Limite máximo (%)</label>
                  <input
                    defaultValue={r.maxPercent}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Exigir motivo acima de (%)</label>
                  <input
                    defaultValue={r.requireReasonAbovePercent}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Aprovar gerente acima de (%)</label>
                  <input
                    defaultValue={r.requireApprovalAbovePercent}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <b>Atenção</b><br />
        Todas as aplicações de desconto manual são registradas no log de auditoria com identificação do operador, valor, motivo e venda associada.
      </div>
    </div>
  );
}
