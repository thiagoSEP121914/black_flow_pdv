// src/features/promotions/components/PromotionWizardModal.tsx
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Promotion, PromotionType } from "../types/promotions";

type Props = {
  open: boolean;
  initial: Promotion | null;
  onClose: () => void;
  onSave: (p: Promotion) => void;
};

type Step = 1 | 2 | 3 | 4;

const typeLabels: Record<PromotionType, string> = {
  product_discount: "Desconto por Produto",
  category_discount: "Desconto por Categoria",
  buy_x_pay_y: "Leve X Pague Y",
  combo: "Combo",
  quantity_tier: "Desconto por Quantidade",
  progressive: "Progressivo",
  happy_hour: "Happy Hour",
};

export default function PromotionWizardModal({ open, initial, onClose, onSave }: Props) {
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Promotion["status"]>("draft");

  const [type, setType] = useState<PromotionType>("product_discount");
  const [ruleSummary, setRuleSummary] = useState("10% off");

  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");

  const [priority, setPriority] = useState<number>(1);
  const [stackCoupons, setStackCoupons] = useState(true);
  const [stackManual, setStackManual] = useState(false);
  const [stackOther, setStackOther] = useState(false);

  useEffect(() => {
    if (!open) return;

    setStep(1);

    if (initial) {
      setName(initial.name);
      setDescription(initial.description ?? "");
      setStatus(initial.status);
      setType(initial.type);
      setRuleSummary(initial.ruleSummary);
      setStartsAt(initial.startsAt.slice(0, 10));
      setEndsAt(initial.endsAt ? initial.endsAt.slice(0, 10) : "");
      setPriority(initial.priority);
      setStackCoupons(initial.stackable.coupons);
      setStackManual(initial.stackable.manualDiscount);
      setStackOther(initial.stackable.otherPromos);
    } else {
      setName("");
      setDescription("");
      setStatus("draft");
      setType("product_discount");
      setRuleSummary("10% off");
      setStartsAt(new Date().toISOString().slice(0, 10));
      setEndsAt("");
      setPriority(1);
      setStackCoupons(true);
      setStackManual(false);
      setStackOther(false);
    }
  }, [open, initial]);

  const canNext = useMemo(() => {
    if (step === 1) return name.trim().length >= 3;
    if (step === 2) return !!type && ruleSummary.trim().length >= 3;
    if (step === 3) return !!startsAt;
    return true;
  }, [step, name, type, ruleSummary, startsAt]);

  if (!open) return null;

  const submit = () => {
    const payload: Promotion = {
      id: initial?.id ?? `p_${Math.random().toString(16).slice(2)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      status,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      ruleSummary: ruleSummary.trim(),
      priority,
      stackable: { coupons: stackCoupons, manualDiscount: stackManual, otherPromos: stackOther },
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="px-5 h-14 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{initial ? "Editar Promoção" : "Nova Promoção"}</p>
            <p className="text-xs text-slate-500">
              {step === 1 && "Nome e configurações gerais"}
              {step === 2 && "Tipo e condições da promoção"}
              {step === 3 && "Datas e limites"}
              {step === 4 && "Combinação com outras ofertas"}
            </p>
          </div>
          <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-slate-50 transition">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((n) => {
              const done = n < step;
              const active = n === step;
              return (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      done ? "bg-emerald-600 text-white" : active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {n}
                  </div>
                  {n !== 4 && <div className={`h-[2px] w-10 ${done ? "bg-emerald-600" : "bg-slate-200"}`} />}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Nome da Promoção *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Black Friday 2024"
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Descrição (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva rapidamente a regra/objetivo"
                  className="mt-2 min-h-[92px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Status inicial</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendada</option>
                  <option value="active">Ativa</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Tipo de Promoção</label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {(Object.keys(typeLabels) as PromotionType[]).map((t) => {
                    const active = t === type;
                    return (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`text-left rounded-xl border px-3 py-3 transition ${
                          active ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        type="button"
                      >
                        <p className="text-sm font-semibold text-slate-900">{typeLabels[t]}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Seleção e regra detalhada entra no Plus depois</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Resumo da regra</label>
                <input
                  value={ruleSummary}
                  onChange={(e) => setRuleSummary(e.target.value)}
                  placeholder="Ex.: 10% off / Leve 3, Pague 2 / Combo R$ 19,90"
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Data de início *</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Data de término</label>
                  <input
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value={1}>1 - Baixa</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5 - Alta</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Promoções com maior prioridade são aplicadas primeiro em caso de conflito.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Acumulação com outras ofertas</p>

              <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Acumula com cupons</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permite usar cupom junto com esta promoção</p>
                </div>
                <input type="checkbox" checked={stackCoupons} onChange={(e) => setStackCoupons(e.target.checked)} className="h-5 w-5" />
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Acumula com desconto manual</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permite desconto adicional pelo operador</p>
                </div>
                <input type="checkbox" checked={stackManual} onChange={(e) => setStackManual(e.target.checked)} className="h-5 w-5" />
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Acumula com outras promoções</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permite múltiplas promoções automáticas</p>
                </div>
                <input type="checkbox" checked={stackOther} onChange={(e) => setStackOther(e.target.checked)} className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 1 ? onClose() : setStep((s) => ((s - 1) as Step)))}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            Voltar
          </button>

          {step < 4 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => ((s + 1) as Step))}
              className={`h-10 rounded-xl px-4 text-sm font-semibold text-white transition ${
                canNext ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-300 cursor-not-allowed"
              }`}
            >
              Próximo
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              {initial ? "Salvar" : "Criar Promoção"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
