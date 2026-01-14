import { Filter } from "lucide-react";
import { Button } from "../ui/Button";

export const FilterButton = () => {
  return (
    <>
      <Button
        variant="outlined"
        className="gap-2 border-gray-300 text-gray-700 bg-white hover:bg-emerald-400! hover:text-white!"
      >
        <Filter className="w-4 h-4" />
        Filtros
      </Button>
    </>
  );
};
