import { Table, type IColumn } from "@/shared/components/Table/Table";
import { Edit, Trash2, User } from "lucide-react";
import { IconButton } from "@/shared/components/ui/IconButton";

export interface IClient {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
    active: boolean;
}

interface ClientTableProps {
    clients: IClient[];
    totalItems?: number;
    itemsPerPage?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    onEdit?: (client: IClient) => void;
    onDelete?: (client: IClient) => void;
}

export function ClientTable({
    clients,
    totalItems,
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange,
    onEdit,
    onDelete,
}: ClientTableProps) {
    const columns: IColumn<IClient>[] = [
        {
            key: "name",
            header: "Nome",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-emerald-50 text-emerald-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                </div>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (item) => <span className="text-gray-500">{item.email || "-"}</span>,
        },
        {
            key: "phone",
            header: "Telefone",
            render: (item) => <span className="text-gray-500">{item.phone || "-"}</span>,
        },
        {
            key: "cpf",
            header: "CPF",
            render: (item) => <span className="text-gray-500">{item.cpf || "-"}</span>,
        },
        {
            key: "active",
            header: "Status",
            render: (item) => (
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${item.active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                >
                    {item.active ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Ações",
            className: "text-right",
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <IconButton
                        icon={<Edit size={16} />}
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                    />
                    <IconButton
                        icon={<Trash2 size={16} />}
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete?.(item)}
                    />
                </div>
            ),
        },
    ];

    return (
        <Table<IClient>
            data={clients}
            columns={columns}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            emptyMessage="Nenhum cliente encontrado."
            label="clientes"
        />
    );
}
