import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { CategorieCard } from "../components/CategoryCard";
import { PageLayout } from "@/shared/layouts/PageLayout";

const mockCategories = [
  {
    id: "1",
    name: "Bebidas",
    description: "Refrigerantes, sucos, águas",
    productsCount: 45,
    status: "Ativa",
  },
  {
    id: "2",
    name: "Alimentos",
    description: "Produtos alimentícios em geral",
    productsCount: 123,
    status: "Ativa",
  },
  {
    id: "3",
    name: "Padaria",
    description: "Pães, bolos e confeitaria",
    productsCount: 28,
    status: "Ativa",
  },
  {
    id: "4",
    name: "Laticínios",
    description: "Leites, queijos e derivados",
    productsCount: 34,
    status: "Ativa",
  },
  {
    id: "5",
    name: "Limpeza",
    description: "Produtos de limpeza doméstica",
    productsCount: 56,
    status: "Ativa",
  },
  {
    id: "6",
    name: "Higiene",
    description: "Produtos de higiene pessoal",
    productsCount: 42,
    status: "Inativa",
  },
  {
    id: "7",
    name: "Grãos",
    description: "Arroz, feijão e cereais",
    productsCount: 18,
    status: "Ativa",
  },
];

export const Categorie = () => {
  return (
    <PageLayout>
      <ActionToolbar addButtonTitle="Categoria" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockCategories.map((category) => (
          <CategorieCard
            key={category.id}
            name={category.name}
            description={category.description}
            productsCount={category.productsCount}
            status={category.status}
            onEdit={() => console.log("Editar", category.id)}
            onDelete={() => console.log("Excluir", category.id)}
          />
        ))}
      </div>
    </PageLayout>
  );
};
