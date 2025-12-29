import { Search } from "lucide-react";
export function SearchInput() {
  return (
    <>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produto ou código de barras..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]"
        />
      </div>
    </>
  );
}
