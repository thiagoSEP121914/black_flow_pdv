import prisma from "./core/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const company = await prisma.company.create({
        data: {
            name: "Minha Empresa",
            status: "active",
        },
    });

    const store = await prisma.store.create({
        data: {
            name: "Loja Principal",
            companyId: company.id,
            status: "active",
        },
    });

    const user = await prisma.user.create({
        data: {
            email: "operator@example.com",
            password: hashedPassword,
            name: "Operador Teste",
            userType: "operator",
            companyId: company.id,
            storeId: store.id,
            role: "cashier",
            active: true,
        },
    });

    console.log("Seed concluído:", user);
}

main()
    .catch(console.error)
    .finally(() => process.exit());
