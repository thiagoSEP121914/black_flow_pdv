import { Card } from "@/shared/components";
import { DollarSign, FileText, Calendar } from "lucide-react";

export function SaleCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-emerald-50 rounded text-emerald-600">
                        <FileText size={18} />
                    </div>
                    <span className="text-gray-500 font-medium">Total de Vendas</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">5</span>
            </Card>

            <Card className="p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gray-50 rounded text-gray-600">
                        <Calendar size={18} />
                    </div>
                    <span className="text-gray-500 font-medium">Vendas Hoje</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">3</span>
            </Card>

            <Card className="bg-emerald-500! text-white! border-emerald-500! p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-emerald-400/30 rounded text-white">
                        <DollarSign size={18} />
                    </div>
                    <span className="text-emerald-50 font-medium">Faturamento Total</span>
                </div>
                <span className="text-3xl font-bold">R$ 548,20</span>
            </Card>
        </div>
    );
}
