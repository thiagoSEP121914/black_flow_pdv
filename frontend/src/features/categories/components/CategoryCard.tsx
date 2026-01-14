import { Tag, Package, Pencil, Trash2 } from "lucide-react";

interface CategorieCardProps {
  name: string;
  description: string;
  productsCount: number;
  status?: "Ativa" | "Inativa";
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
      {/* Header */}
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

      {/* Content */}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Package className="h-4 w-4" />
        <span>{productsCount} produtos</span>
      </div>

      {/* Actions (hover) */}
      <div className="mt-5 flex gap-3 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>

        <button
          onClick={onDelete}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
