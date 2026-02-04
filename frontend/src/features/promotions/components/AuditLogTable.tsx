// src/features/promotions/components/AuditLogTable.tsx
import { type AuditLogEntry } from "../types/promotions";

type Props = { entries: AuditLogEntry[] };

const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR");

export default function AuditLogTable({ entries }: Props) {
  return (
    <div>
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Log de Auditoria</h3>
        <p className="text-sm text-slate-500 mt-1">
          Histórico de ações realizadas no módulo de Promoções &amp; Descontos
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Data/Hora</th>
              <th className="px-5 py-3 font-semibold">Ação</th>
              <th className="px-5 py-3 font-semibold">Tipo</th>
              <th className="px-5 py-3 font-semibold">Usuário</th>
              <th className="px-5 py-3 font-semibold">Detalhes</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/70">
                <td className="px-5 py-4 text-slate-700">{fmt(e.createdAt)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                    {e.action}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-700">{e.entityType}</td>
                <td className="px-5 py-4 text-slate-900 font-medium">{e.userName}</td>
                <td className="px-5 py-4 text-slate-700">
                  <code className="text-xs bg-slate-100 rounded-lg px-2 py-1 inline-block">
                    {JSON.stringify(e.details)}
                  </code>
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={5}>
                  Nenhum evento registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
