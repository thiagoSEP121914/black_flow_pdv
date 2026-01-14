import { Tag, Package, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/shared/components/ui/IconButton";
import { Button } from "@/shared/components/ui/Button";

interface CategorieCardProps {
  name: string;
  description: string;
  productsCount: number;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CategorieCard = ({
  name,
  description,
  productsCount,
  status = "Ativa",
  onEdit,
  onDelete,
}: CategorieCardProps) => {
  const isActive = status === "Ativa";

  return (
    <div className="group w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
          <Tag className="h-5 w-5 text-emerald-500" />
        </div>

        <span
          className={`text-sm font-medium ${
            isActive ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Package className="h-4 w-4" />
        <span>{productsCount} produtos</span>
      </div>

      <div className="mt-5 flex gap-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <Button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>

        <IconButton
          icon={<Trash2 className="h-4 w-4" />}
          variant="danger"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};
