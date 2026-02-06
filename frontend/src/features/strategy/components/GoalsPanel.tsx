import type { Goal } from "../types/strategy";

type Props = {
  goals: Goal[];
};

const pct = (current: number, target: number) => {
  if (target === 0) return 0;
  const v = (current / target) * 100;
  return Math.max(0, Math.min(100, v));
};

const fmt = (g: Goal) => {
  if (g.unit === "R$") {
    return g.current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  return `${g.current}${g.unit === "qtd" ? "" : g.unit}`;
};

export default function GoalsPanel({ goals }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Metas</h3>
        <p className="text-sm text-slate-500 mt-1">Acompanhe progresso e foco do mês</p>
      </div>

      <div className="p-5 space-y-4">
        {goals.map((g) => {
          const p = pct(g.current, g.target);
          return (
            <div key={g.id} className="border border-slate-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{g.title}</div>
                  {g.description ? <div className="text-sm text-slate-500 mt-0.5">{g.description}</div> : null}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{fmt(g)}</div>
                  <div className="text-xs text-slate-500">
                    alvo: {g.unit === "R$"
                      ? g.target.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : `${g.target}${g.unit === "qtd" ? "" : g.unit}`}
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 bg-emerald-600" style={{ width: `${p}%` }} />
              </div>

              {g.dueISO ? (
                <div className="mt-2 text-xs text-slate-500">prazo: {new Date(g.dueISO).toLocaleDateString("pt-BR")}</div>
              ) : null}
            </div>
          );
        })}

        {goals.length === 0 ? (
          <div className="text-sm text-slate-500 py-8 text-center">Nenhuma meta cadastrada.</div>
        ) : null}
      </div>
    </div>
  );
}
