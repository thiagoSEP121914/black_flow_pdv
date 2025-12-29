// src/features/pos/components/CartSidebar.tsx
import { ShoppingCart, User, Trash2, Plus, Minus } from "lucide-react";
import { PaymentMethods } from "./PaymentMethods";
import { useState } from "react";
import { Button } from "../../../shared/components/ui/Button";

interface CartItemType {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartSidebarProps {
  cart: CartItemType[];
  subtotal: number;
  discount: number;
  total: number;
  onFinalize: () => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemoveItem?: (id: number) => void;
}

export function CartSidebar({
  cart,
  subtotal,
  discount,
  total,
  onFinalize,
  onUpdateQuantity,
  onRemoveItem,
}: CartSidebarProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>("pix");

  return (
    <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm h-full overflow-hidden">
      {/* Header com Ícone e Selecionar Cliente */}
      <div className="p-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm text-gray-900">Carrinho</h3>
          </div>
          <span className="text-xs text-gray-500">
            {cart.length} {cart.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="
    w-full mt-3 h-10 gap-2 cursor-pointer
    border-emerald-200
    text-emerald-700
    bg-emerald-50
    hover:bg-emerald-200
    hover:border-emerald-300
    transition-all

    focus:outline-none
    focus:ring-2
    focus:ring-emerald-400
    focus:ring-offset-2
    focus:ring-offset-white
  "
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Selecionar cliente</span>
        </Button>
      </div>

      {/* Lista de Itens com Scroll */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <ShoppingCart className="w-12 h-12 mb-2 stroke-1 opacity-20" />
            <p className="font-medium text-sm text-gray-500">Carrinho vazio</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Adicione produtos para começar
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/50 border border-gray-100"
              >
                <span className="text-2xl shrink-0">{item.image}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-emerald-500">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
                    <button
                      onClick={() =>
                        onUpdateQuantity?.(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity?.(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem?.(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Pagamento e Totais */}
      <div className="shrink-0 border-t border-gray-200 p-3 space-y-4 bg-white">
        <PaymentMethods
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />

        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          <div className="flex justify-between text-[11px] text-gray-500 font-medium">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[11px] text-red-500 font-medium">
            <span>Desconto</span>
            <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center pt-1 mt-1 border-t border-gray-100">
            <span className="text-sm font-black text-gray-900 uppercase">
              Total
            </span>
            <span className="text-lg font-black text-emerald-500">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <button
          onClick={onFinalize}
          disabled={cart.length === 0}
          className="w-full h-11 bg-emerald-400 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:bg-emerald-300 disabled:cursor-not-allowed uppercase"
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}
