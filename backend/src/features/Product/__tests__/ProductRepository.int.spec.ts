import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient, Product } from "@prisma/client";
import { ProductRepositoryImpl } from "../repositories/ProductRepository.js";
import { IProductRepository } from "../repositories/IProductRepository.js";

const prisma = new PrismaClient();
let repository: IProductRepository;

// Helper to seed data
const seedCompanyAndStore = async () => {
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

    const category = await prisma.category.create({
        data: {
            name: "Test Category",
            active: true,
            companyId: company.id,
        },
    });

    return { company, store, category };
};

describe("ProductRepository Integration Tests", () => {
    let companyId: string;
    let storeId: string;
    let categoryId: string;

    beforeAll(async () => {
        // Connect to the test database
        await prisma.$connect();
        repository = new ProductRepositoryImpl(prisma);
    });

    afterAll(async () => {
        // Disconnect after all tests
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        // Cleanup database before each test
        await prisma.saleItem.deleteMany();
        await prisma.sale.deleteMany();
        await prisma.product.deleteMany();
        await prisma.cashier.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany(); // Users depend on Company/Store
        await prisma.customer.deleteMany();
        await prisma.financial.deleteMany();
        await prisma.permission.deleteMany();
        await prisma.store.deleteMany();
        await prisma.category.deleteMany();
        await prisma.company.deleteMany();

        // Seed fresh data
        const seed = await seedCompanyAndStore();
        companyId = seed.company.id;
        storeId = seed.store.id;
        categoryId = seed.category.id;
    });

    describe("insert", () => {
        it("should create a new product", async () => {
            const productData: Partial<Product> = {
                name: "Test Product",
                salePrice: 100,
                companyId,
                storeId,
                categoryId,
                active: true,
                quantity: 10,
            };

            const created = await repository.insert(productData);

            expect(created).toBeDefined();
            expect(created.id).toBeDefined();
            expect(created.name).toBe("Test Product");
            expect(created.companyId).toBe(companyId);

            // Verify in DB
            const inDb = await prisma.product.findUnique({ where: { id: created.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.name).toBe("Test Product");
        });
    });

    describe("findById", () => {
        it("should find a product by id", async () => {
            const product = await prisma.product.create({
                data: {
                    name: "Find Me",
                    salePrice: 200,
                    companyId,
                    storeId,
                },
            });

            const found = await repository.findById(product.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(product.id);
            expect(found.name).toBe("Find Me");
        });

        it("should return null if product not found", async () => {
            const found = await repository.findById("000000000000000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findAll", () => {
        beforeEach(async () => {
            await prisma.product.createMany({
                data: [
                    { name: "Apple", salePrice: 10, companyId, storeId },
                    { name: "Banana", salePrice: 5, companyId, storeId },
                    { name: "Cherry", salePrice: 15, companyId, storeId },
                ],
            });
        });

        it("should return all products for a company", async () => {
            const result = await repository.findAll({ companyId });
            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it("should filter by name", async () => {
            const result = await repository.findAll({ companyId, filter: "Apple" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Apple");
        });

        it("should paginate results", async () => {
            const result = await repository.findAll({ companyId, page: 1, per_page: 2 });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.current_page).toBe(1);
        });

        it("should sort results", async () => {
            const result = await repository.findAll({ companyId, sort_by: "salePrice", sort_dir: "asc" });
            expect(result.items[0].name).toBe("Banana"); // Cheapest

            const resultDesc = await repository.findAll({ companyId, sort_by: "salePrice", sort_dir: "desc" });
            expect(resultDesc.items[0].name).toBe("Cherry"); // Most expensive
        });
    });

    describe("update", () => {
        it("should update an existing product", async () => {
            const product = await prisma.product.create({
                data: {
                    name: "Old Name",
                    salePrice: 50,
                    companyId,
                    storeId,
                },
            });

            const updated = await repository.update({
                id: product.id,
                name: "New Name",
                salePrice: 75,
            });

            expect(updated.name).toBe("New Name");
            expect(updated.salePrice).toBe(75);

            const inDb = await prisma.product.findUnique({ where: { id: product.id } });
            expect(inDb?.name).toBe("New Name");
        });

        it("should throw error if id is missing", async () => {
            await expect(repository.update({ name: "No ID" })).rejects.toThrow("ID not provided for update");
        });
    });

    describe("delete", () => {
        it("should delete a product", async () => {
            const product = await prisma.product.create({
                data: {
                    name: "To Delete",
                    salePrice: 10,
                    companyId,
                    storeId,
                },
            });

            await repository.delete(product.id);

            const inDb = await prisma.product.findUnique({ where: { id: product.id } });
            expect(inDb).toBeNull();
        });
    });

    describe("findByCode", () => {
        it("should find product by barcode", async () => {
            const product = await prisma.product.create({
                data: {
                    name: "Barcoded Product",
                    salePrice: 10,
                    barcode: "123456789",
                    companyId,
                    storeId,
                },
            });

            const found = await repository.findByCode("123456789");
            expect(found).toBeDefined();
            expect(found.id).toBe(product.id);
        });
    });

    describe("findByCompanyId", () => {
        it("should return products for specific company", async () => {
            const otherCompany = await prisma.company.create({ data: { name: "Other", status: "active" } });
            await prisma.product.create({
                data: { name: "Other Product", salePrice: 10, companyId: otherCompany.id, storeId },
            });
            const otherStore = await prisma.store.create({ data: { name: "Other Store", companyId: otherCompany.id } });
            await prisma.product.create({
                data: { name: "Other Product", salePrice: 10, companyId: otherCompany.id, storeId: otherStore.id },
            });

            await prisma.product.create({
                data: { name: "My Product", salePrice: 10, companyId, storeId },
            });

            const results = await repository.findByCompanyId(companyId);
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe("My Product");
        });
    });
});
