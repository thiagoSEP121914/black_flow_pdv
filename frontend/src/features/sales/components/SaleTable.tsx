import { Table, type IColumn } from "@/shared/components/Table/Table";
import { Eye, CreditCard, Banknote, Landmark } from "lucide-react";
import { IconButton } from "@/shared/components/ui/IconButton";

export interface ISale {
    id: string;
    code: string;
    date: string;
    time: string;
    client: string;
    itemsCount: number;
    paymentMethod: "Crédito" | "Dinheiro" | "PIX" | "Débito";
    total: string;
    status: "Concluída" | "Cancelada";
}

interface SaleTableProps {
    sales: ISale[];
    totalItems?: number;
    itemsPerPage?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export function SaleTable({
    sales,
    totalItems,
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange,
}: SaleTableProps) {
    const getPaymentIcon = (method: string) => {
        switch (method) {
            case "Crédito":
            case "Débito":
                return <CreditCard size={14} />;
            case "Dinheiro":
                return <Banknote size={14} />;
            case "PIX":
                return <Landmark size={14} />; // Using Landmark as a proxy for PIX icon
            default:
                return <CreditCard size={14} />;
        }
    };

    const columns: IColumn<ISale>[] = [
        {
            key: "code",
            header: "ID",
            className: "font-medium text-gray-900 w-24",
        },
        {
            key: "date",
            header: "Data/Hora",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.date}</span>
                    <span className="text-gray-400 text-[10px]">{item.time}</span>
                </div>
            ),
        },
        {
            key: "client",
            header: "Cliente",
            className: "text-gray-900",
        },
        {
            key: "itemsCount",
            header: "Itens",
            render: (item) => (
                <span className="text-gray-500">{item.itemsCount} itens</span>
            ),
        },
        {
            key: "paymentMethod",
            header: "Pagamento",
            render: (item) => (
                <div className="flex items-center gap-2 text-gray-600">
                    {getPaymentIcon(item.paymentMethod)}
                    <span>{item.paymentMethod}</span>
                </div>
            ),
        },
        {
            key: "total",
            header: "Total",
            className: "font-bold text-gray-900",
        },
        {
            key: "status",
            header: "Status",
            render: (item) => {
                const styles = {
                    Concluída: "text-emerald-600 font-medium text-xs",
                    Cancelada: "bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium w-fit",
                };
                // For 'Concluída', the design shows just text (unlike 'Cancelada' which has a background).
                // However, looking closely at the image, 'Concluída' is bold/darker.
                // Let's match the image: 'Concluída' is just bold text, 'Cancelada' is a badge.

                if (item.status === "Cancelada") {
                    return <span className={styles.Cancelada}>{item.status}</span>;
                }
                return <span className="font-bold text-gray-900 text-xs">{item.status}</span>;
            },
        },
        {
            key: "actions",
            header: "Ações",
            className: "text-right",
            render: () => (
                <div className="flex justify-end gap-2">
                    <IconButton
                        icon={<Eye size={16} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("View Sale")}
                    />
                </div>
            ),
        },
    ];

    return (
        <Table<ISale>
            data={sales}
            columns={columns}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
        />
    );
}