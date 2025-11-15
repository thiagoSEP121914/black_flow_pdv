import prisma from "./core/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
    const hashedPasswordOperator = await bcrypt.hash("123456", 10);
    const hashedPasswordOwner = await bcrypt.hash("owner123", 10);

    // Cria empresa
    const company = await prisma.company.create({
        data: {
            name: "Minha Empresa",
            status: "active",
        },
    });

    // Cria loja
    const store = await prisma.store.create({
        data: {
            name: "Loja Principal",
            companyId: company.id,
            status: "active",
        },
    });

    // Usuário operador
    const operator = await prisma.user.create({
        data: {
            email: "operator@example.com",
            password: hashedPasswordOperator,
            name: "Operador Teste",
            userType: "operator",
            companyId: company.id,
            storeId: store.id,
            role: "cashier",
            active: true,
        },
    });

    // Usuário owner
    const owner = await prisma.user.create({
        data: {
            email: "owner@example.com",
            password: hashedPasswordOwner,
            name: "Dono da Empresa",
            userType: "owner",
            companyId: company.id,
            active: true,
        },
    });

    console.log("Seed concluído:");
    console.log("Operator:", operator);
    console.log("Owner:", owner);
}

main()
    .catch(console.error)
    .finally(() => process.exit());
