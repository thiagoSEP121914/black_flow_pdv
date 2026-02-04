// src/features/promotions/components/PromotionsTable.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MoreHorizontal, Eye, Pencil, Copy, Power, Trash2 } from "lucide-react";

import type { Promotion } from "../types/promotions";
import PromotionStatusPill from "./PromotionStatusPill";
import PromotionTypeBadge from "./PromotionTypeBadge";

type Props = {
  promotions: Promotion[];
  onView: (p: Promotion) => void;
  onEdit: (p: Promotion) => void;
  onDuplicate: (p: Promotion) => void;
  onEnd: (p: Promotion) => void;
  onDelete: (p: Promotion) => void;
};

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function PromotionsTable({
  promotions,
  onView,
  onEdit,
  onDuplicate,
  onEnd,
  onDelete,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Se clicou dentro do menu/botão, não fecha
      if (target.closest('[data-promotions-menu="true"]')) return;

      setOpenId(null);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const rows = useMemo(() => promotions ?? [], [promotions]);

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="px-5 py-3 border-b border-slate-100">Nome</th>
            <th className="px-5 py-3 border-b border-slate-100">Tipo</th>
            <th className="px-5 py-3 border-b border-slate-100">Status</th>
            <th className="px-5 py-3 border-b border-slate-100">Período</th>
            <th className="px-5 py-3 border-b border-slate-100">Regra</th>
            <th className="px-5 py-3 border-b border-slate-100 text-center">Prioridade</th>
            <th className="px-5 py-3 border-b border-slate-100 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((p) => {
            const isMenuOpen = openId === p.id;
            const isEnded = p.status === "ended";

            return (
              <tr
                key={p.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onView(p)}
              >
                <td className="px-5 py-4 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  {p.description ? (
                    <div className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                      {p.description}
                    </div>
                  ) : null}
                </td>

                <td className="px-5 py-4 border-b border-slate-100">
                  <PromotionTypeBadge type={p.type} />
                </td>

                <td className="px-5 py-4 border-b border-slate-100">
                  <PromotionStatusPill status={p.status} />
                </td>

                <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">
                  <div>{fmtDate(p.startsAt)}</div>
                  <div className="text-slate-500">
                    até {p.endsAt ? fmtDate(p.endsAt) : "Sem limite"}
                  </div>
                </td>

                <td className="px-5 py-4 border-b border-slate-100 text-sm text-slate-700">
                  {p.ruleSummary}
                </td>

                <td className="px-5 py-4 border-b border-slate-100 text-center">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                    {p.priority}
                  </span>
                </td>

                <td className="px-5 py-4 border-b border-slate-100 text-right">
                  <div className="relative inline-flex" data-promotions-menu="true">
                    <button
                      type="button"
                      data-promotions-menu="true"
                      className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                      onClick={(e) => {
                        e.stopPropagation(); // CRÍTICO: não aciona clique da linha
                        setOpenId((cur) => (cur === p.id ? null : p.id));
                      }}
                      aria-label="Mais ações"
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-700" />
                    </button>

                    {isMenuOpen && (
                      <div
                        data-promotions-menu="true"
                        className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                        onClick={(e) => e.stopPropagation()} // CRÍTICO
                      >
                        <MenuItem
                          icon={<Eye className="h-4 w-4" />}
                          label="Ver detalhes"
                          onClick={() => {
                            setOpenId(null);
                            onView(p);
                          }}
                        />
                        <MenuItem
                          icon={<Pencil className="h-4 w-4" />}
                          label="Editar"
                          onClick={() => {
                            setOpenId(null);
                            onEdit(p);
                          }}
                        />
                        <MenuItem
                          icon={<Copy className="h-4 w-4" />}
                          label="Duplicar"
                          onClick={() => {
                            setOpenId(null);
                            onDuplicate(p);
                          }}
                        />

                        <div className="h-px bg-slate-100" />

                        <MenuItem
                          icon={<Power className="h-4 w-4" />}
                          label="Encerrar"
                          disabled={isEnded}
                          onClick={() => {
                            if (isEnded) return;
                            setOpenId(null);
                            onEnd(p);
                          }}
                        />
                        <MenuItem
                          icon={<Trash2 className="h-4 w-4" />}
                          label="Excluir"
                          danger
                          onClick={() => {
                            setOpenId(null);
                            onDelete(p);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                Nenhuma promoção encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-full px-3 py-2.5 text-left text-sm inline-flex items-center gap-2",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer",
        danger ? "text-red-600" : "text-slate-700",
      ].join(" ")}
    >
      <span className={danger ? "text-red-600" : "text-slate-500"}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}