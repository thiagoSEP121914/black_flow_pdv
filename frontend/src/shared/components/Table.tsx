import type { ReactNode } from "react";

interface IColumn<T> {
  key: keyof T & string;
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
}
export default function Table<T extends Record<string, unknown>>({
  data = [],
  columns = [],
  onRowClick,
  emptyMessage = "Nenhum dado disponível",
  className = "",
}: ITableProps<T>) {
  if (!columns || columns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Configure as colunas da tabela
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-4 text-sm font-semibold text-gray-700 ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-3 px-4 text-sm text-gray-900 ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.key] as unknown as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
