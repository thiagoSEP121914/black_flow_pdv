import { StoreCard } from "./StoreCard";

// Mock Data
const stores = [
    {
        id: 1,
        name: "Loja Centro",
        status: "active" as const,
        address: "Rua Principal, 123 - Centro",
        phone: "(11) 3333-1234",
        email: "centro@empresa.com",
        employeesCount: 8,
        salesValue: 45670.9,
    },
    {
        id: 2,
        name: "Loja Shopping",
        status: "active" as const,
        address: "Shopping Norte, Loja 45",
        phone: "(11) 3333-5678",
        email: "shopping@empresa.com",
        employeesCount: 12,
        salesValue: 67890.5,
    },
    {
        id: 3,
        name: "Loja Bairro",
        status: "inactive" as const,
        address: "Av. dos Estados, 456",
        phone: "(11) 3333-9012",
        email: "bairro@empresa.com",
        employeesCount: 5,
        salesValue: 0,
    },
];

export const StoreCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
                <StoreCard
                    key={store.id}
                    name={store.name}
                    status={store.status}
                    address={store.address}
                    phone={store.phone}
                    email={store.email}
                    employeesCount={store.employeesCount}
                    salesValue={store.salesValue}
                />
            ))}
        </div>
    );
};
