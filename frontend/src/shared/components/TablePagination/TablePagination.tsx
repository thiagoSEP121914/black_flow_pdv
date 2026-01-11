import { Button } from "@/shared/components/ui/Button.tsx";

interface TablePaginationProps {
  totalItems: number;
  currentCount: number;
  itemsPerPage?: number;
  currentPage?: number;
  label?: string;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function TablePagination({
  totalItems,
  currentCount,
  itemsPerPage = 10,
  currentPage = 1,
  label = "registros",
  onPageChange,
  isLoading = false,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canPrev = currentPage > 1 && !isLoading;
  const canNext = currentPage < totalPages && !isLoading;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 font-medium">
      {isLoading ? (
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
      ) : (
        <span>
          Mostrando <span className="text-gray-900">{currentCount}</span> de{" "}
          <span className="text-gray-900">{totalItems}</span> {label}
        </span>
      )}
      <div className="flex gap-2">
        <Button
          variant="outlined"
          className={`h-9 px-4 text-xs font-semibold border-gray-200 hover:bg-gray-50 ${
            !canPrev ? "text-gray-300 cursor-not-allowed" : "text-gray-700"
          }`}
          onClick={() => canPrev && onPageChange?.(currentPage - 1)}
          disabled={!canPrev}
        >
          Anterior
        </Button>
        <Button
          variant="outlined"
          className={`h-9 px-4 text-xs font-semibold border-gray-200 hover:bg-gray-50 ${
            !canNext ? "text-gray-300 cursor-not-allowed" : "text-gray-900"
          }`}
          onClick={() => canNext && onPageChange?.(currentPage + 1)}
          disabled={!canNext}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
