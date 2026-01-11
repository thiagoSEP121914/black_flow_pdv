import type { ReactNode } from "react";
import { TablePagination } from "../TablePagination/TablePagination";

export interface IColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface ITableProps<T> {
  data?: T[];
  columns?: IColumn<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  label?: string;
  isLoading?: boolean;
}

export function Table<T>({
  data = [],
  columns = [],
  onRowClick,
  className = "",
  emptyMessage = "Nenhum dado encontrado.",
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  label = "itens",
  isLoading = false,
}: ITableProps<T>) {
  return (
    <div className={`flex flex-col w-full h-fit ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-2 px-3 text-[10px] font-semibold text-gray-600 bg-transparent ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <td key={`skeleton-${column.key}`} className="py-2 px-3">
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400 text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={`hover:bg-gray-100 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`py-2 px-3 text-[10px] text-gray-700 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : (item[column.key as keyof T] as unknown as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalItems !== undefined && (
        <div className="w-full">
          <TablePagination
            totalItems={totalItems}
            currentCount={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            label={label}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
