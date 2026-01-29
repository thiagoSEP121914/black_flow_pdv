import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { Card, Table } from "@/shared/components";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

const lastTransactions = [
    {
        id: "1",
        type: "entrada",
        category: "Vendas",
        description: "Vendas do dia",
        date: "15/01/2024",
        value: 2345.9,
    },
    {
        id: "2",
        type: "saida",
        category: "Fornecedores",
        description: "Compra de mercadorias",
        date: "15/01/2024",
        value: 1500.0,
    },
    {
        id: "3",
        type: "entrada",
        category: "Vendas",
        description: "Vendas do dia",
        date: "14/01/2024",
        value: 1890.5,
    },
    {
        id: "4",
        type: "saida",
        category: "Funcionários",
        description: "Salários",
        date: "14/01/2024",
        value: 5000.0,
    },
    {
        id: "5",
        type: "saida",
        category: "Aluguel",
        description: "Aluguel mensal",
        date: "10/01/2024",
        value: 3000.0,
    },
];

export const FinanceTable = () => {
    const [showFilter] = useState(true);

    return (
        <Card className="flex flex-col flex-1">
            <div className="p-6 pb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Últimas Transações
                </h3>
                <ActionToolbar
                    addButtonTitle="Nova Transação"
                    showFilter={showFilter}
                />
            </div>
            <div className="px-6 pb-6 mt-4">
                <Table
                    columns={[
                        {
                            key: "type",
                            header: "Tipo",
                            render: (row) => (
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${row.type === "entrada" ? "bg-emerald-100" : "bg-red-100"
                                        }`}
                                >
                                    {row.type === "entrada" ? (
                                        <ArrowUp
                                            className={`w-4 h-4 ${row.type === "entrada"
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                                }`}
                                        />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: "category",
                            header: "Categoria",
                            render: (row) => (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {row.category}
                                </span>
                            ),
                        },
                        { key: "description", header: "Descrição" },
                        { key: "date", header: "Data" },
                        {
                            key: "value",
                            header: "Valor",
                            render: (row) => (
                                <span
                                    className={`font-bold ${row.type === "entrada" ? "text-gray-800" : "text-red-500"
                                        }`}
                                >
                                    {row.type === "entrada" ? "+" : "-"} R${" "}
                                    {row.value.toFixed(2)}
                                </span>
                            ),
                        },
                    ]}
                    data={lastTransactions}
                />
            </div>
        </Card>
    );
};