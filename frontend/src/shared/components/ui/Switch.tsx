// src/shared/components/ui/Switch.tsx
import type { ButtonHTMLAttributes } from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">;

export function Switch({
  checked,
  onChange,
  disabled = false,
  className = "",
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        checked
          ? "bg-emerald-500 border-emerald-500"
          : "bg-slate-200 border-slate-300", // OFF MAIS VISÍVEL
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Thumb: começa em left=2px (0.5) e vai para +20px (translate-x-5) => 22px (perfeito no w-11) */}
      <span
        className={[
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5",
          "transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

export default Switch;
