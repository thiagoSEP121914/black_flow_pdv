import { Button } from "@/shared/components/ui/Button";
import { Mail, MapPin, Pencil, Phone, Store as StoreIcon, Trash2, Users } from "lucide-react";
import { Card } from "@/shared/components";

interface IStoreCardProps {
    name: string;
    status: "active" | "inactive";
    address: string;
    phone: string;
    email: string;
    employeesCount: number;
    salesValue: number;
}

export const StoreCard = ({
    name,
    status,
    address,
    phone,
    email,
    employeesCount,
    salesValue,
}: IStoreCardProps) => {
    const isActive = status === "active";

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
            <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white shrink-0">
                        <StoreIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900 truncate">
                                {name}
                            </h3>
                        </div>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {isActive ? "Ativa" : "Inativa"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="xs"
                            variant="ghost"
                            className="text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            size="xs"
                            variant="ghost"
                            className="text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{address}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{email}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-2 gap-4 bg-gray-50/50 rounded-b-lg">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Users className="w-3.5 h-3.5" />
                        Funcionários
                    </div>
                    <p className="text-sm font-bold text-gray-900">{employeesCount}</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        Vendas (mês)
                    </div>
                    <p
                        className={`text-sm font-bold ${salesValue > 0 ? "text-emerald-600" : "text-gray-900"
                            }`}
                    >
                        R$ {salesValue.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
                    </p>
                </div>
            </div>
        </Card>
    );
};
