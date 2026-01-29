import { PageLayout } from "@/shared/layouts/PageLayout";
import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { ExportToLayout } from "@/shared/components/ExportToLayout/ExportToLayout";
import { SaleCards } from "../components/SaleCards";
import { SaleTable, type ISale } from "../components/SaleTable";
import { useState } from "react";

export function Sale() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mockSales: ISale[] = [
    {
      id: "1",
      code: "#001",
      date: "15/01/2024",
      time: "14:32",
      client: "Maria Santos",
      itemsCount: 5,
      paymentMethod: "Crédito",
      total: "R$ 156,90",
      status: "Concluída",
    },
    {
      id: "2",
      code: "#002",
      date: "15/01/2024",
      time: "13:15",
      client: "João Oliveira",
      itemsCount: 3,
      paymentMethod: "Dinheiro",
      total: "R$ 89,50",
      status: "Concluída",
    },
    {
      id: "3",
      code: "#003",
      date: "15/01/2024",
      time: "11:45",
      client: "Ana Costa",
      itemsCount: 8,
      paymentMethod: "PIX",
      total: "R$ 234,00",
      status: "Concluída",
    },
    {
      id: "4",
      code: "#004",
      date: "14/01/2024",
      time: "16:20",
      client: "Cliente Avulso",
      itemsCount: 2,
      paymentMethod: "Débito",
      total: "R$ 67,80",
      status: "Concluída",
    },
    {
      id: "5",
      code: "#005",
      date: "14/01/2024",
      time: "10:05",
      client: "Pedro Lima",
      itemsCount: 4,
      paymentMethod: "Dinheiro",
      total: "R$ 145,30",
      status: "Cancelada",
    },
    // Adding more mock data to enable pagination if needed, but for now 5 matches the image
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PageLayout>
      <SaleCards />
      <ActionToolbar
        showFilter={true}
        addButtonTitle={"Venda"} />
      <div className="flex-1 overflow-auto min-h-0">
        <SaleTable
          sales={mockSales}
          totalItems={mockSales.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <ExportToLayout />
    </PageLayout>
  );
}
