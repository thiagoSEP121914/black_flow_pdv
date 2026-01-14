import { ClientTable } from "../components/ClientTable";
import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { ExportToLayout } from "@/shared/components/ExportToLayout/ExportToLayout";
import { useState } from "react";
import { PageLayout } from "@/shared/layouts/PageLayout";

interface IClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  active: boolean;
}

export function Client() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mockClients: IClient[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      active: true,
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      phone: "(21) 98888-8888",
      cpf: "987.654.321-00",
      active: true,
    },
    {
      id: "3",
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      phone: "(31) 97777-7777",
      cpf: "111.222.333-44",
      active: false,
    },
    {
      id: "4",
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(41) 96666-6666",
      cpf: "555.666.777-88",
      active: true,
    },
    {
      id: "5",
      name: "Lucas Souza",
      email: "lucas.souza@email.com",
      phone: "(51) 95555-5555",
      cpf: "999.888.777-66",
      active: true,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PageLayout>
      <ActionToolbar showFilter={true} addButtonTitle="Cliente" />
      <div className="flex-1 overflow-auto min-h-0">
        <ClientTable
          clients={mockClients}
          totalItems={mockClients.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onEdit={(client) => console.log("Edit", client)}
          onDelete={(client) => console.log("Delete", client)}
        />
      </div>
      <ExportToLayout />
    </PageLayout>
  );
}
