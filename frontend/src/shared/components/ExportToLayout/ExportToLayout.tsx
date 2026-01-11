import { Button } from "@/shared/components/ui/Button";
import { FileText, FileSpreadsheet } from "lucide-react";

export const ExportToLayout = () => {
  const handleExportPDF = () => console.log("Exportando para PDF...");
  const handleExportExcel = () => console.log("Exportando para Excel...");

  return (
    // mt-6 para dar um respiro da tabela, e justify-start ou end conforme sua preferência
    <div className="flex items-center gap-3 mt-6">
      <Button
        variant="outlined" // Mudado de 'outlined' para 'outline' (padrão shadcn/ui)
        onClick={handleExportPDF}
        className="flex items-center gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <FileText size={18} className="text-slate-500" />
        <span className="text-sm font-medium">Exportar PDF</span>
      </Button>

      <Button
        variant="primary" 
        onClick={handleExportExcel}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
      >
        <FileSpreadsheet size={18} />
        <span className="text-sm font-medium">Exportar Excel</span>
      </Button>
    </div>
  );
};
