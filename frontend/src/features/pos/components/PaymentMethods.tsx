// src/features/pos/components/PaymentMethods.tsx
import { Banknote, CreditCard, QrCode } from "lucide-react";

const methods = [
  { id: "dinheiro", name: "Dinheiro", icon: Banknote },
  { id: "credito", name: "Crédito", icon: CreditCard },
  { id: "debito", name: "Débito", icon: CreditCard },
  { id: "pix", name: "PIX", icon: QrCode },
];

interface PaymentMethodsProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export const PaymentMethods = ({ selected, onSelect }: PaymentMethodsProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {methods.map((method) => {
        const isSelected = selected === method.id;

        const baseClasses =
          "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all h-16 outline-none";
        const stateClasses = isSelected
          ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981] shadow-sm" // Usei o verde esmeralda da sua imagem
          : "border-gray-200 text-gray-500 hover:border-[#10b981]/50 hover:bg-gray-50";

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={`${baseClasses} ${stateClasses}`}
          >
            <method.icon
              className={`w-5 h-5 ${isSelected ? "text-[#10b981]" : "text-gray-400"}`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {method.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
