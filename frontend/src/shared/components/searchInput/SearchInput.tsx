import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
}

export const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      />
    </div>
  );
};
