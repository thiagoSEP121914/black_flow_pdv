// src/features/promotions/components/StackingRulesMatrix.tsx
export default function StackingRulesMatrix() {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Regras de Acúmulo</h3>
          <p className="text-sm text-slate-500 mt-1">
            Configure como diferentes tipos de desconto podem ser combinados
          </p>
        </div>

        <button
          className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          type="button"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
        {[
          { title: "Promoção + Cupom", desc: "Permite aplicar cupom junto com promoções automáticas", on: true },
          { title: "Promoção + Desconto Manual", desc: "Permite desconto manual do operador sobre promoções", on: false },
          { title: "Cupom + Desconto Manual", desc: "Permite desconto manual sobre cupom aplicado", on: true },
          { title: "Múltiplas Promoções", desc: "Permite aplicar mais de uma promoção automática ao mesmo item", on: false },
        ].map((r) => (
          <div key={r.title} className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{r.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
            </div>
            <input type="checkbox" defaultChecked={r.on} className="h-5 w-5" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <b>Exemplos práticos</b>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><b>Promoção + Cupom:</b> Cliente usa cupom PROMO10 em produto já com 20% off → ambos aplicados</li>
          <li><b>Duas promoções:</b> “Bebidas” (10% off) e “Leve 3 Pague 2” → aplica a regra configurada (prioridade/desempate)</li>
        </ul>
      </div>
    </div>
  );
}
