import type { DemandHeatmapPoint } from "../types/strategy";

type Props = {
  points: DemandHeatmapPoint[];
};

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function DemandHeatmap({ points }: Props) {
  // normaliza intensidade
  const max = Math.max(...points.map((p) => p.salesCount), 1);

  const getPoint = (day: number, hour: number) =>
    points.find((p) => p.dayOfWeek === day && p.hour === hour);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-auto">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Demanda</h3>
        <p className="text-sm text-slate-500 mt-1">
          Mapa de calor por dia/horário (qtd de vendas)
        </p>
      </div>

      <div className="p-5">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 text-xs">
            <div />
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center text-slate-500">{h}</div>
            ))}

            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} className="contents">
                <div className="text-slate-700 font-semibold flex items-center">{DAYS[d]}</div>
                {Array.from({ length: 24 }).map((_, h) => {
                  const p = getPoint(d, h);
                  const v = p?.salesCount ?? 0;
                  const a = v / max; // 0..1
                  const cls =
                    a > 0.75
                      ? "bg-emerald-600"
                      : a > 0.5
                      ? "bg-emerald-400"
                      : a > 0.25
                      ? "bg-emerald-200"
                      : "bg-slate-100";

                  return (
                    <div
                      key={`${d}-${h}`}
                      className={`h-6 rounded-md ${cls}`}
                      title={`${DAYS[d]} ${h}h — vendas: ${v}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
