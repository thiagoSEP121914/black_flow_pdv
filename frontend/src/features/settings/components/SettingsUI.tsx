import type { ReactNode } from "react";
import { Lock } from "lucide-react";

export function MenuItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left",
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-800",
      ].join(" ")}
    >
      <span className={active ? "text-emerald-700" : "text-gray-500"}>
        {icon}
      </span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="my-5">
      {label && (
        <div className="text-xs font-extrabold text-gray-500 mb-2">{label}</div>
      )}
      <div className="h-px bg-gray-200" />
    </div>
  );
}

/**
 * ✅ Switch refeito:
 * - OFF bem visível (bg + borda)
 * - ON destacado
 * - bolinha vai 0% esquerda e 100% direita (translate-x-5)
 * - overflow-hidden evita “vazamento”
 * - focus ring (acessibilidade)
 */
export function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled ? true : undefined}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative w-11 h-6 rounded-full border transition-colors overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked
          ? "bg-emerald-500 border-emerald-500"
          : "bg-slate-200 border-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow",
          "ring-1 ring-black/5 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

export function LockHint({ isAdminOrManager }: { isAdminOrManager: boolean }) {
  if (isAdminOrManager) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
      <Lock className="w-4 h-4" />
      Somente <b>Admin/Gerente</b> pode alterar esta configuração.
    </div>
  );
}

export function TabPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full border text-sm font-extrabold transition-colors",
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function ToggleRow({
  title,
  desc,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-white">
      <div>
        <div className="text-sm font-extrabold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{desc}</div>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}
