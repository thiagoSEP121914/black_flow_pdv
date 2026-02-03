import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { StoreRepositoryImpl } from "../repositories/StoreRepositoryImpl.js";
import { IStoreRepository } from "../repositories/IStoreRepository.js";

const prisma = new PrismaClient();
let repository: IStoreRepository;

// Helper to seed company
const seedCompany = async () => {
    return await prisma.company.create({
        data: {
            name: "Test Company",
            status: "active",
        },
    });
};

describe("StoreRepository Integration Tests", () => {
    let companyId: string;

    beforeAll(async () => {
        await prisma.$connect();
        repository = new StoreRepositoryImpl(prisma);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        // Cleanup database before each test (order matters due to FK constraints)
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

        // Seed fresh data
        const company = await seedCompany();
        companyId = company.id;
    });

    describe("insert", () => {
        it("should create a new store", async () => {
            const storeData = {
                name: "Test Store",
                companyId,
                status: "active",
                cnpj: "12345678901234",
                phone: "1199999999",
                email: "store@test.com",
                address: "123 Main St",
            };

            const created = await repository.insert(storeData);

            expect(created).toBeDefined();
            expect(created.id).toBeDefined();
            expect(created.name).toBe("Test Store");
            expect(created.companyId).toBe(companyId);
            expect(created.status).toBe("active");

            // Verify in DB
            const inDb = await prisma.store.findUnique({ where: { id: created.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.name).toBe("Test Store");
        });
    });

    describe("findById", () => {
        it("should find a store by id", async () => {
            const store = await prisma.store.create({
                data: {
                    name: "Find Me Store",
                    companyId,
                    status: "active",
                },
            });

            const found = await repository.findById(store.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(store.id);
            expect(found.name).toBe("Find Me Store");
        });

        it("should return null if store not found", async () => {
            const found = await repository.findById("000000000000000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findAllStoreByCompany", () => {
        it("should return all stores for a company", async () => {
            await prisma.store.createMany({
                data: [
                    { name: "Store 1", companyId, status: "active" },
                    { name: "Store 2", companyId, status: "active" },
                    { name: "Store 3", companyId, status: "inactive" },
                ],
            });

            const stores = await repository.findAllStoreByCompany(companyId);

            expect(stores).toHaveLength(3);
        });

        it("should return empty array for company with no stores", async () => {
            const anotherCompany = await prisma.company.create({
                data: { name: "Another Company", status: "active" },
            });

            const stores = await repository.findAllStoreByCompany(anotherCompany.id);

            expect(stores).toHaveLength(0);
        });
    });

    describe("findAll", () => {
        beforeEach(async () => {
            await prisma.store.createMany({
                data: [
                    { name: "Alpha Store", companyId, status: "active" },
                    { name: "Beta Store", companyId, status: "active" },
                    { name: "Charlie Store", companyId, status: "inactive" },
                ],
            });
        });

        it("should return all stores for a company", async () => {
            const result = await repository.findAll({ companyId });
            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it("should filter by name", async () => {
            const result = await repository.findAll({ companyId, filter: "Alpha" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Alpha Store");
        });

        it("should paginate results", async () => {
            const result = await repository.findAll({ companyId, page: 1, per_page: 2 });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.current_page).toBe(1);
        });

        it("should sort results", async () => {
            const result = await repository.findAll({ companyId, sort_by: "name", sort_dir: "asc" });
            expect(result.items[0].name).toBe("Alpha Store");

            const resultDesc = await repository.findAll({ companyId, sort_by: "name", sort_dir: "desc" });
            expect(resultDesc.items[0].name).toBe("Charlie Store");
        });

        it("should filter with key=value syntax", async () => {
            const result = await repository.findAll({ companyId, filter: "name=Beta" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Beta Store");
        });
    });

    describe("update", () => {
        it("should update an existing store", async () => {
            const store = await prisma.store.create({
                data: {
                    name: "Old Name",
                    companyId,
                    status: "active",
                },
            });

            const updated = await repository.update({
                ...store,
                name: "New Name",
                phone: "999999999",
            });

            expect(updated.name).toBe("New Name");
            expect(updated.phone).toBe("999999999");

            const inDb = await prisma.store.findUnique({ where: { id: store.id } });
            expect(inDb?.name).toBe("New Name");
        });

        it("should throw error if id is missing", async () => {
            await expect(repository.update({ name: "No ID" } as any)).rejects.toThrow("ID required for update");
        });
    });

    describe("delete", () => {
        it("should delete a store", async () => {
            const store = await prisma.store.create({
                data: {
                    name: "To Delete",
                    companyId,
                    status: "active",
                },
            });

            await repository.delete(store.id);

            const inDb = await prisma.store.findUnique({ where: { id: store.id } });
            expect(inDb).toBeNull();
        });
    });
});
