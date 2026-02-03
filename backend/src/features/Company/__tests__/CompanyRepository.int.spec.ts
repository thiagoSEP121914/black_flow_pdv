import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { CompanyRepositoryImpl } from "../repositories/CompanyRepositoryImpl.js";
import { ICompanyRepository } from "../repositories/ICompanyRepository.js";

const prisma = new PrismaClient();
let repository: ICompanyRepository;

describe("CompanyRepository Integration Tests", () => {
    beforeAll(async () => {
        await prisma.$connect();
        repository = new CompanyRepositoryImpl(prisma);
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
    });

    describe("insert", () => {
        it("should create a new company", async () => {
            const companyData = {
                name: "Test Company",
                status: "active",
                cnpj: "12345678901234",
                phone: "11999999999",
                email: "company@test.com",
                address: "123 Main St",
            };

            const created = await repository.insert(companyData);

            expect(created).toBeDefined();
            expect(created.id).toBeDefined();
            expect(created.name).toBe("Test Company");
            expect(created.status).toBe("active");
            expect(created.cnpj).toBe("12345678901234");

            // Verify in DB
            const inDb = await prisma.company.findUnique({ where: { id: created.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.name).toBe("Test Company");
        });

        it("should create company with minimal data", async () => {
            const companyData = {
                name: "Minimal Company",
                status: "active",
            };

            const created = await repository.insert(companyData);

            expect(created).toBeDefined();
            expect(created.name).toBe("Minimal Company");
            expect(created.cnpj).toBeNull();
            expect(created.phone).toBeNull();
        });
    });

    describe("findById", () => {
        it("should find a company by id", async () => {
            const company = await prisma.company.create({
                data: {
                    name: "Find Me Company",
                    status: "active",
                },
            });

            const found = await repository.findById(company.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(company.id);
            expect(found.name).toBe("Find Me Company");
        });

        it("should return null if company not found", async () => {
            const found = await repository.findById("000000000000000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findByCnpj", () => {
        it("should find a company by CNPJ", async () => {
            await prisma.company.create({
                data: {
                    name: "CNPJ Company",
                    status: "active",
                    cnpj: "98765432101234",
                },
            });

            const found = await repository.findByCnpj("98765432101234");

            expect(found).toBeDefined();
            expect(found.name).toBe("CNPJ Company");
            expect(found.cnpj).toBe("98765432101234");
        });

        it("should return null if CNPJ not found", async () => {
            const found = await repository.findByCnpj("00000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findAll", () => {
        beforeEach(async () => {
            await prisma.company.createMany({
                data: [
                    { name: "Alpha Company", status: "active", cnpj: "11111111111111" },
                    { name: "Beta Company", status: "active", cnpj: "22222222222222" },
                    { name: "Charlie Company", status: "inactive", cnpj: "33333333333333" },
                ],
            });
        });

        it("should return all companies", async () => {
            const result = await repository.findAll({ companyId: "" });
            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it("should filter by name", async () => {
            const result = await repository.findAll({ companyId: "", filter: "Alpha" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Alpha Company");
        });

        it("should filter by CNPJ", async () => {
            const result = await repository.findAll({ companyId: "", filter: "22222222222222" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Beta Company");
        });

        it("should paginate results", async () => {
            const result = await repository.findAll({ companyId: "", page: 1, per_page: 2 });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.current_page).toBe(1);
        });

        it("should sort results", async () => {
            const result = await repository.findAll({ companyId: "", sort_by: "name", sort_dir: "asc" });
            expect(result.items[0].name).toBe("Alpha Company");

            const resultDesc = await repository.findAll({ companyId: "", sort_by: "name", sort_dir: "desc" });
            expect(resultDesc.items[0].name).toBe("Charlie Company");
        });

        it("should filter with key=value syntax", async () => {
            const result = await repository.findAll({ companyId: "", filter: "name=Beta" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Beta Company");
        });

        it("should filter by companyId when provided", async () => {
            const companies = await prisma.company.findMany();
            const targetCompany = companies[0];

            const result = await repository.findAll({ companyId: targetCompany.id });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(targetCompany.id);
        });
    });

    describe("update", () => {
        it("should update an existing company", async () => {
            const company = await prisma.company.create({
                data: {
                    name: "Old Name",
                    status: "active",
                },
            });

            const updated = await repository.update({
                ...company,
                name: "New Name",
                phone: "11888888888",
            });

            expect(updated.name).toBe("New Name");
            expect(updated.phone).toBe("11888888888");

            const inDb = await prisma.company.findUnique({ where: { id: company.id } });
            expect(inDb?.name).toBe("New Name");
        });
    });

    describe("delete (soft delete)", () => {
        it("should soft delete a company by setting status to inactive", async () => {
            const company = await prisma.company.create({
                data: {
                    name: "To Delete",
                    status: "active",
                },
            });

            await repository.delete(company.id);

            const inDb = await prisma.company.findUnique({ where: { id: company.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.status).toBe("inactive");
        });
    });
});
