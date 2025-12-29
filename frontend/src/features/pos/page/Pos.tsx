import { useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { CartSidebar } from "../components/CartSideBar";

// Tipos
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Dados mockados seguindo o seu protótipo
const CATEGORIES = ["Todos", "Bebidas", "Alimentos", "Limpeza", "Higiene"];
const PRODUCTS_MOCK: Product[] = [
  {
    id: 1,
    name: "Coca-Cola 2L",
    price: 12.9,
    image: "🥤",
    category: "Bebidas",
  },
  {
    id: 2,
    name: "Pão Francês (un)",
    price: 0.8,
    image: "🥖",
    category: "Alimentos",
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    price: 5.9,
    image: "🥛",
    category: "Alimentos",
  },
  { id: 4, name: "Arroz 5kg", price: 28.9, image: "🍚", category: "Alimentos" },
  {
    id: 5,
    name: "Feijão Preto 1kg",
    price: 9.5,
    image: "🫘",
    category: "Alimentos",
  },
  {
    id: 6,
    name: "Cerveja Lata 350ml",
    price: 4.5,
    category: "Bebidas",
    image: "🍺",
  },
  {
    id: 7,
    name: "Sabão em Pó 1kg",
    price: 15.9,
    category: "Limpeza",
    image: "🧼",
  },
  {
    id: 8,
    name: "Shampoo 400ml",
    price: 18.9,
    category: "Higiene",
    image: "🧴",
  },
  {
    id: 9,
    name: "Detergente 500ml",
    price: 2.5,
    category: "Limpeza",
    image: "🧪",
  },
  {
    id: 10,
    name: "Papel Higiênico 12un",
    price: 14.9,
    category: "Higiene",
    image: "🧻",
  },
  {
    id: 11,
    name: "Suco de Laranja 1L",
    price: 9.9,
    category: "Bebidas",
    image: "🧃",
  },
  {
    id: 12,
    name: "Óleo de Soja 900ml",
    price: 7.4,
    category: "Alimentos",
    image: "🍶",
  },
  {
    id: 13,
    name: "Açúcar 1kg",
    price: 4.2,
    category: "Alimentos",
    image: "🍬",
  },
  {
    id: 14,
    name: "Café em Pó 500g",
    price: 16.8,
    category: "Alimentos",
    image: "☕",
  },
  {
    id: 15,
    name: "Biscoito Recheado",
    price: 3.5,
    category: "Alimentos",
    image: "🍪",
  },
  {
    id: 16,
    name: "Água Mineral 500ml",
    price: 2.0,
    category: "Bebidas",
    image: "💧",
  },
  {
    id: 17,
    name: "Desinfetante 1L",
    price: 8.9,
    category: "Limpeza",
    image: "✨",
  },
  {
    id: 18,
    name: "Sabonete Barra",
    price: 2.2,
    category: "Higiene",
    image: "🧼",
  },
  {
    id: 19,
    name: "Pasta de Dente",
    price: 4.5,
    category: "Higiene",
    image: "🪥",
  },
  {
    id: 20,
    name: "Macarrão Espaguete",
    price: 5.3,
    category: "Alimentos",
    image: "🍝",
  },
  {
    id: 21,
    name: "Vinho Tinto 750ml",
    price: 35.0,
    category: "Bebidas",
    image: "🍷",
  },
  {
    id: 22,
    name: "Esponja de Aço",
    price: 3.9,
    category: "Limpeza",
    image: "🧽",
  },
  {
    id: 23,
    name: "Amaciante 2L",
    price: 19.9,
    category: "Limpeza",
    image: "🌸",
  },
  {
    id: 24,
    name: "Queijo Muçarela 100g",
    price: 6.5,
    category: "Alimentos",
    image: "🧀",
  },
  {
    id: 25,
    name: "Presunto Cozido 100g",
    price: 4.8,
    category: "Alimentos",
    image: "🥩",
  },
  {
    id: 26,
    name: "Energético 473ml",
    price: 10.5,
    category: "Bebidas",
    image: "⚡",
  },
  {
    id: 27,
    name: "Água Sanitária 2L",
    price: 6.9,
    category: "Limpeza",
    image: "🌊",
  },
  {
    id: 28,
    name: "Fio Dental 50m",
    price: 9.9,
    category: "Higiene",
    image: "🧵",
  },
  {
    id: 29,
    name: "Manteiga 200g",
    price: 11.2,
    category: "Alimentos",
    image: "🧈",
  },
  {
    id: 30,
    name: "Sabão Líquido 3L",
    price: 45.9,
    category: "Limpeza",
    image: "🧺",
  },
];

export function Pos() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Adicionar ao carrinho
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Atualizar quantidade
  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remover item
  const handleRemoveItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal;

  return (
    <div className="flex h-full gap-4 p-4 overflow-hidden bg-gray-50">
      {/* Coluna da Esquerda: Busca e Produtos */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Barra de Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar produto ou código de barras..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filtros de Categoria */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {PRODUCTS_MOCK.filter(
              (p) =>
                selectedCategory === "Todos" || p.category === selectedCategory
            ).map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                onClick={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="h-full">
        <CartSidebar
          cart={cart}
          subtotal={subtotal}
          discount={0}
          total={total}
          onFinalize={() => alert("Venda Finalizada!")}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </aside>
    </div>
  );
}
