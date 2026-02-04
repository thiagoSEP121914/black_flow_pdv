// src/shared/components/ui/Modal.tsx
import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onMouseDown={onClose}
        aria-hidden="true"
      />

      {/* painel */}
      <div
        className={[
          "relative w-full rounded-2xl bg-white shadow-xl border border-gray-200",
          sizeClass[size],
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            {title && (
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 text-gray-600"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
