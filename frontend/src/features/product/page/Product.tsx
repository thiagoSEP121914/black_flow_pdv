import { ProductTable } from "../components/ProductTable";
import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { ExportToLayout } from "@/shared/components/ExportToLayout/ExportToLayout";
import { useState } from "react";

interface IProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  salePrice: string;
  cost: string;
  stock: number;
  status: "Normal" | "Baixo" | "Sem estoque";
}

export function Product() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allProducts: IProduct[] = [
    {
      id: "1",
      name: "Coca-Cola 2L",
      sku: "7891234567890",
      category: "Bebidas",
      salePrice: "R$ 12,90",
      cost: "R$ 8,50",
      stock: 45,
      status: "Normal",
    },
    {
      id: "2",
      name: "Pão Francês (un)",
      sku: "7891234567891",
      category: "Padaria",
      salePrice: "R$ 0,80",
      cost: "R$ 0,40",
      stock: 8,
      status: "Baixo",
    },
    {
      id: "3",
      name: "Leite Integral 1L",
      sku: "7891234567892",
      category: "Laticínios",
      salePrice: "R$ 5,90",
      cost: "R$ 4,20",
      stock: 32,
      status: "Normal",
    },
    {
      id: "4",
      name: "Arroz Tipo 1 5kg",
      sku: "7891234567893",
      category: "Grãos",
      salePrice: "R$ 28,90",
      cost: "R$ 22,00",
      stock: 18,
      status: "Normal",
    },
    {
      id: "5",
      name: "Feijão Preto 1kg",
      sku: "7891234567894",
      category: "Grãos",
      salePrice: "R$ 9,50",
      cost: "R$ 6,80",
      stock: 0,
      status: "Sem estoque",
    },
    {
      id: "6",
      name: "Açúcar Cristal 1kg",
      sku: "7891234567895",
      category: "Açúcar",
      salePrice: "R$ 4,90",
      cost: "R$ 3,20",
      stock: 67,
      status: "Normal",
    },
    {
      id: "7",
      name: "Café Torrado 500g",
      sku: "7891234567896",
      category: "Bebidas",
      salePrice: "R$ 18,90",
      cost: "R$ 13,50",
      stock: 23,
      status: "Normal",
    },
    {
      id: "8",
      name: "Óleo de Soja 900ml",
      sku: "7891234567897",
      category: "Óleos",
      salePrice: "R$ 8,50",
      cost: "R$ 6,00",
      stock: 41,
      status: "Normal",
    },
    {
      id: "9",
      name: "Macarrão Espaguete 500g",
      sku: "7891234567898",
      category: "Massas",
      salePrice: "R$ 4,20",
      cost: "R$ 2,80",
      stock: 9,
      status: "Baixo",
    },
    {
      id: "10",
      name: "Molho de Tomate 340g",
      sku: "7891234567899",
      category: "Molhos",
      salePrice: "R$ 3,50",
      cost: "R$ 2,10",
      stock: 55,
      status: "Normal",
    },
    {
      id: "11",
      name: "Sabão em Pó 1kg",
      sku: "7891234567900",
      category: "Limpeza",
      salePrice: "R$ 15,90",
      cost: "R$ 11,00",
      stock: 0,
      status: "Sem estoque",
    },
    {
      id: "12",
      name: "Papel Higiênico 12un",
      sku: "7891234567901",
      category: "Higiene",
      salePrice: "R$ 22,90",
      cost: "R$ 16,50",
      stock: 34,
      status: "Normal",
    },
    {
      id: "13",
      name: "Detergente Líquido 500ml",
      sku: "7891234567902",
      category: "Limpeza",
      salePrice: "R$ 2,50",
      cost: "R$ 1,50",
      stock: 78,
      status: "Normal",
    },
    {
      id: "14",
      name: "Biscoito Recheado 140g",
      sku: "7891234567903",
      category: "Biscoitos",
      salePrice: "R$ 3,90",
      cost: "R$ 2,40",
      stock: 7,
      status: "Baixo",
    },
    {
      id: "15",
      name: "Suco de Laranja 1L",
      sku: "7891234567904",
      category: "Bebidas",
      salePrice: "R$ 7,90",
      cost: "R$ 5,20",
      stock: 28,
      status: "Normal",
    },
    {
      id: "16",
      name: "Iogurte Natural 170g",
      sku: "7891234567905",
      category: "Laticínios",
      salePrice: "R$ 4,50",
      cost: "R$ 3,00",
      stock: 42,
      status: "Normal",
    },
    {
      id: "17",
      name: "Queijo Mussarela 500g",
      sku: "7891234567906",
      category: "Laticínios",
      salePrice: "R$ 32,90",
      cost: "R$ 24,00",
      stock: 15,
      status: "Normal",
    },
    {
      id: "18",
      name: "Presunto Fatiado 200g",
      sku: "7891234567907",
      category: "Frios",
      salePrice: "R$ 12,50",
      cost: "R$ 8,90",
      stock: 6,
      status: "Baixo",
    },
    {
      id: "19",
      name: "Margarina 500g",
      sku: "7891234567908",
      category: "Laticínios",
      salePrice: "R$ 9,90",
      cost: "R$ 6,50",
      stock: 51,
      status: "Normal",
    },
    {
      id: "20",
      name: "Refrigerante Guaraná 2L",
      sku: "7891234567909",
      category: "Bebidas",
      salePrice: "R$ 10,90",
      cost: "R$ 7,20",
      stock: 0,
      status: "Sem estoque",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return (
    <div className="flex max-h-[80vh] flex-col p-6 bg-white rounded-lg shadow-sm m-4 overflow-hidden">
      <ActionToolbar />
      <div className="flex-1 overflow-auto min-h-0">
        <ProductTable
          products={paginatedProducts}
          totalItems={allProducts.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <ExportToLayout />
    </div>
  );
}
