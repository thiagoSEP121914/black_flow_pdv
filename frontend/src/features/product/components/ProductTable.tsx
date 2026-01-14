import { Table, type IColumn } from "@/shared/components/Table/Table";
import { Edit, Trash2, AlertTriangle, Box } from "lucide-react";
import { IconButton } from "@/shared/components/ui/IconButton";
export interface IProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  salePrice: string;
  cost: string;
  stock: number;
  status: "Normal" | "Baixo" | "Sem estoque";
}
interface ProductTableProps {
  products: IProduct[];
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}
export function ProductTable({
  products,
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}: ProductTableProps) {
  const columns: IColumn<IProduct>[] = [
    {
      key: "name",
      header: "Produto",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
            <Box size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.name}</span>
            <span className="text-gray-400 text-[10px]">{item.sku}</span>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Categoria" },
    { key: "salePrice", header: "Preço Venda", className: "font-semibold" },
    { key: "cost", header: "Custo", className: "text-gray-400" },
    {
      key: "stock",
      header: "Estoque",
      render: (item) => (
        <div className="flex items-center gap-1">
          {item.stock}
          {item.stock < 10 && (
            <AlertTriangle size={14} className="text-amber-500" />
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const styles = {
          Normal: "text-gray-700",
          Baixo: "text-amber-600 font-medium",
          "Sem estoque": "bg-red-50 text-red-600 px-2 py-1 rounded-full",
        };
        return <span className={styles[item.status]}>{item.status}</span>;
      },
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-right",
      render: () => (
        <div className="flex justify-end gap-2">
          <IconButton
            icon={<Edit size={16} />}
            variant="secondary"
            size="sm"
            onClick={() => console.log("Edit")}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            variant="danger"
            size="sm"
            onClick={() => console.log("Delete")}
          />
        </div>
      ),
    },
  ];
  return (
    <Table<IProduct>
      data={products}
      columns={columns}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
}
