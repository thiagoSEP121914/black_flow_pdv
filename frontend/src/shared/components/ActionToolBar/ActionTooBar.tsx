import { SearchInput } from "../searchInput/SearchInput";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import { FilterButton } from "../FilterButton/FilterButton";

export const ActionToolbar = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="w-72">
          <SearchInput placeholder={"Buscar por nome ou código..."} />
        </div>

        <div className="flex gap-3">
          <FilterButton />
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </div>
      </div>
    </>
  );
};
