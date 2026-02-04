// src/features/promotions/components/PromotionsKpiRow.tsx
import { TrendingUp, Clock3, CheckCircle2, Ban } from "lucide-react";
import { type Promotion } from "../types/promotions";

type Props = { promotions: Promotion[] };

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function PromotionsKpiRow({ promotions }: Props) {
  const active = promotions.filter((p) => p.status === "active").length;
  const scheduled = promotions.filter((p) => p.status === "scheduled").length;
  const ended = promotions.filter((p) => p.status === "ended").length;

  // MVP: estimativa simples só pra UI ficar fiel ao protótipo (refina depois com preview real)
  const estimated = promotions.reduce((acc, p) => acc + (p.status === "active" ? p.priority * 327.18 : 0), 0);

  const cards = [
    { label: "Ativas", value: active, icon: CheckCircle2 },
    { label: "Agendadas", value: scheduled, icon: Clock3 },
    { label: "Encerradas", value: ended, icon: Ban },
    { label: "Economia Total", value: brl.format(estimated), icon: TrendingUp },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <c.icon className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-xl font-bold text-slate-900">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
