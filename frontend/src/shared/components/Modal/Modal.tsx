import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const getModalSizeClasses = (size: ModalSize) => {
  switch (size) {
    case "sm":
      return "max-w-md";
    case "md":
      return "max-w-xl";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-4xl";
    case "full":
      return "max-w-full m-4";
    default:
      return "max-w-xl";
  }
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  className = "",
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={handleOverlayClick}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-2
          flex flex-col max-h-[90vh]
          ${getModalSizeClasses(size)}
          ${className}
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({
  children,
  className = "",
  onClose,
  icon,
}: ModalHeaderProps) => {
  return (
    <div
      className={`flex items-start justify-between p-6 border-b border-gray-100 shrink-0 ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            {icon}
          </div>
        )}
        <div className="text-lg font-semibold text-gray-900">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export const ModalContent = ({
  children,
  className = "",
}: ModalContentProps) => {
  return (
    <div className={`p-6 overflow-y-auto ${className}`}>{children}</div>
  );
};

export const ModalFooter = ({
  children,
  className = "",
}: ModalFooterProps) => {
  return (
    <div
      className={`p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-end gap-3 shrink-0 ${className}`}
    >
      {children}
    </div>
  );
};

// Also export as sub-components for cleaner API usage if preferred: Modal.Header, Modal.Content, etc.
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
