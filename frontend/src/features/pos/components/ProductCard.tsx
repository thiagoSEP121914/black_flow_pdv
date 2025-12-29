// src/features/pos/components/ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onClick: () => void;
}

export function ProductCard({ name, price, image, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group bg-white rounded-lg p-3 border shadow-sm border-gray-200  hover:border-[#10b981] hover:shadow-md transition-all duration-200 text-left flex flex-col h-full"
    >
      {/* Container do Ícone/Imagem */}
      <div className="text-3xl mb-2 aspect-square flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-[#10b981]/5 transition-colors">
        {image}
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-col flex-1 justify-between">
        <h4 className="font-medium text-gray-700 text-xs line-clamp-2 leading-tight group-hover:text-[#10b981] transition-colors">
          {name}
        </h4>
        <p className="text-sm font-bold text-[#10b981] mt-2">
          R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </button>
  );
}
