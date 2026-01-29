import { Card } from "@/shared/components";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

export const FinanceCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Receitas</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-2">R$ 67.000</h3>
                    </div>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <ArrowUp className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium flex items-center">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        +12%
                    </span>
                    <span className="text-gray-400 ml-2">vs mês anterior</span>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Despesas</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-2">R$ 40.000</h3>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                        <ArrowDown className="w-6 h-6 text-red-600" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-red-500 font-medium flex items-center">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        +5%
                    </span>
                    <span className="text-gray-400 ml-2">vs mês anterior</span>
                </div>
            </Card>

            <Card className="!bg-emerald-500 !text-white !border-emerald-500 p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-emerald-100 font-medium">Saldo</p>
                        <h3 className="text-2xl font-bold mt-2 text-white">R$ 27.000</h3>
                    </div>
                    <div className="p-2 bg-emerald-400 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="bg-emerald-400 px-2 py-1 rounded text-white text-xs">
                        Saldo
                    </span>
                </div>
            </Card>
        </div>
    );
};