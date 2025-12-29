import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";

interface CartItemProps {
  name: string;
  price: number;
  image: string;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      {/* Imagem/Ícone do Produto */}
      <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
        {image}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
          {name}
        </h4>
        <p className="text-[#10b981] font-bold text-base mt-0.5">
          R${" "}
          {price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Controles de Quantidade */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleDecrease}
          variant="ghost"
          size="xs"
          className="border border-gray-300 hover:bg-gray-50"
          aria-label="Diminuir quantidade"
        >
          <Minus size={16} className="text-gray-600" />
        </Button>

        <span className="w-8 text-center font-medium text-gray-800">
          {quantity}
        </span>

        <Button
          onClick={handleIncrease}
          variant="ghost"
          size="xs"
          className="border border-gray-300 hover:bg-gray-50"
          aria-label="Aumentar quantidade"
        >
          <Plus size={16} className="text-gray-600" />
        </Button>

        <Button
          onClick={onRemove}
          variant="ghost"
          size="xs"
          className="hover:bg-red-50 ml-1"
          aria-label="Remover item"
        >
          <Trash2 size={18} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
}
