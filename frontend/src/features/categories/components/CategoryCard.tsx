import { Tag, Package, Pencil, Trash2 } from "lucide-react";
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

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${isActive ? "text-emerald-600" : "text-gray-400"
              }`}
          >
            {status}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 border-l border-gray-100 pl-2">
            <Button
              size="xs"
              variant="ghost"
              onClick={onEdit}
              className="text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={onDelete}
              className="text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Package className="h-4 w-4" />
        <span>{productsCount} produtos</span>
      </div>
    </div>
  );
};
