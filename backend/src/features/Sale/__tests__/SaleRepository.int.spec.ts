import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient, Sale, PaymentMethod, SaleStatus } from "@prisma/client";
import { SaleRepositoryImpl } from "../repositories/SaleRepository.js";
import { ISaleRepository } from "../repositories/ISaleRepository.js";

const prisma = new PrismaClient();
let repository: SaleRepositoryImpl;

const seedCompanyStoreAndUser = async () => {
    const company = await prisma.company.create({
        data: {
            name: "Test Company",
            status: "active",
        },
    });

    const store = await prisma.store.create({
        data: {
            name: "Test Store",
            companyId: company.id,
            status: "active",
        },
    });

    const user = await prisma.user.create({
        data: {
            email: "test@test.com",
            password: "hashedpassword",
            name: "Test User",
            userType: "operator",
            companyId: company.id,
            storeId: store.id,
        },
    });

    const product = await prisma.product.create({
        data: {
            name: "Test Product",
            salePrice: 1000,
            quantity: 100,
            companyId: company.id,
            storeId: store.id,
            active: true,
        },
    });

    const customer = await prisma.customer.create({
        data: {
            name: "Test Customer",
            companyId: company.id,
        },
    });

    return { company, store, user, product, customer };
};

describe("SaleRepository Integration Tests", () => {
    let companyId: string;
    let storeId: string;
    let userId: string;
    let productId: string;
    let customerId: string;

    beforeAll(async () => {
        await prisma.$connect();
        repository = new SaleRepositoryImpl(prisma);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.saleItem.deleteMany();
        await prisma.sale.deleteMany();
        await prisma.product.deleteMany();
        await prisma.cashier.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.customer.deleteMany();
        await prisma.financial.deleteMany();
        await prisma.permission.deleteMany();
        await prisma.store.deleteMany();
        await prisma.category.deleteMany();
        await prisma.company.deleteMany();

        const seed = await seedCompanyStoreAndUser();
        companyId = seed.company.id;
        storeId = seed.store.id;
        userId = seed.user.id;
        productId = seed.product.id;
        customerId = seed.customer.id;
    });

    describe("insertWithItems", () => {
        it("should create a sale with items and decrement product stock", async () => {
            const saleData = {
                total: 2000,
                discount: 0,
                paymentMethod: "PIX" as PaymentMethod,
                status: "COMPLETED" as SaleStatus,
                companyId,
                storeId,
                userId,
                items: [
                    {
                        productId,
                        quantity: 2,
                        unitPrice: 1000,
                        subtotal: 2000,
                    },
                ],
            };

            const sale = await repository.insertWithItems(saleData);

            expect(sale).toBeDefined();
            expect(sale.id).toBeDefined();
            expect(sale.total).toBe(2000);
            expect(sale.items).toHaveLength(1);
            expect(sale.items[0].quantity).toBe(2);

            const product = await prisma.product.findUnique({ where: { id: productId } });
            expect(product?.quantity).toBe(98);
        });
    });

    describe("findById", () => {
        it("should find a sale by id with relations", async () => {
            const sale = await prisma.sale.create({
                data: {
                    total: 1000,
                    paymentMethod: "CASH",
                    status: "COMPLETED",
                    companyId,
                    storeId,
                    userId,
                    customerId,
                    items: {
                        create: {
                            productId,
                            quantity: 1,
                            unitPrice: 1000,
                            subtotal: 1000,
                        },
                    },
                },
            });

            const found = await repository.findById(sale.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(sale.id);
            expect((found as any).items).toHaveLength(1);
            expect((found as any).customer).toBeDefined();
        });

        it("should return null if sale not found", async () => {
            const found = await repository.findById("000000000000000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findAll", () => {
        beforeEach(async () => {
            await prisma.sale.createMany({
                data: [
                    { total: 1000, paymentMethod: "CASH", status: "COMPLETED", companyId, storeId, userId },
                    { total: 2000, paymentMethod: "PIX", status: "COMPLETED", companyId, storeId, userId },
                    { total: 500, paymentMethod: "CREDIT", status: "CANCELED", companyId, storeId, userId },
                ],
            });
        });

        it("should return all sales for a company", async () => {
            const result = await repository.findAll({ companyId });
            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it("should filter by status", async () => {
            const result = await repository.findAll({ companyId, filter: "status=CANCELED" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].status).toBe("CANCELED");
        });

        it("should paginate results", async () => {
            const result = await repository.findAll({ companyId, page: 1, per_page: 2 });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.current_page).toBe(1);
        });
    });

    describe("update", () => {
        it("should update sale status", async () => {
            const sale = await prisma.sale.create({
                data: {
                    total: 1000,
                    paymentMethod: "CASH",
                    status: "COMPLETED",
                    companyId,
                    storeId,
                    userId,
                },
            });

            const updated = await repository.update({ id: sale.id, status: "CANCELED" });

            expect(updated.status).toBe("CANCELED");

            const inDb = await prisma.sale.findUnique({ where: { id: sale.id } });
            expect(inDb?.status).toBe("CANCELED");
        });

        it("should throw error if id is missing", async () => {
            await expect(repository.update({ status: "CANCELED" })).rejects.toThrow("ID not provided for update");
        });
    });

    describe("delete", () => {
        it("should delete a sale and its items", async () => {
            const sale = await prisma.sale.create({
                data: {
                    total: 1000,
                    paymentMethod: "CASH",
                    status: "COMPLETED",
                    companyId,
                    storeId,
                    userId,
                    items: {
                        create: {
                            productId,
                            quantity: 1,
                            unitPrice: 1000,
                            subtotal: 1000,
                        },
                    },
                },
            });

            await repository.delete(sale.id);

            const saleInDb = await prisma.sale.findUnique({ where: { id: sale.id } });
            expect(saleInDb).toBeNull();

            const itemsInDb = await prisma.saleItem.findMany({ where: { saleId: sale.id } });
            expect(itemsInDb).toHaveLength(0);
        });
    });

    describe("findByDateRange", () => {
        it("should return sales within date range", async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            await prisma.sale.create({
                data: {
                    total: 1000,
                    paymentMethod: "CASH",
                    status: "COMPLETED",
                    companyId,
                    storeId,
                    userId,
                },
            });

            const sales = await repository.findByDateRange({
                start: yesterday,
                end: tomorrow,
                companyId,
            });

            expect(sales.length).toBeGreaterThan(0);
        });
    });

    describe("findByStatus", () => {
        it("should return sales by status", async () => {
            await prisma.sale.createMany({
                data: [
                    { total: 1000, paymentMethod: "CASH", status: "COMPLETED", companyId, storeId, userId },
                    { total: 2000, paymentMethod: "PIX", status: "REFUNDED", companyId, storeId, userId },
                ],
            });

            const completed = await repository.findByStatus({ status: "COMPLETED", companyId });
            expect(completed.every((s) => s.status === "COMPLETED")).toBe(true);

            const refunded = await repository.findByStatus({ status: "REFUNDED", companyId });
            expect(refunded).toHaveLength(1);
        });
    });
});
