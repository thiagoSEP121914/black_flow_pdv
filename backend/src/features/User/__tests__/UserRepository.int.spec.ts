import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl.js";
import { IUserRepository } from "../repositories/IUserRepository.js";

const prisma = new PrismaClient();
let repository: IUserRepository;

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

    return { company, store };
};

describe("UserRepository Integration Tests", () => {
    let companyId: string;
    let storeId: string;

    beforeAll(async () => {
        // Connect to the test database
        await prisma.$connect();
        repository = new UserRepositoryImpl(prisma);
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
        await prisma.user.deleteMany();
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
    });

    describe("insert", () => {
        it("should create a new user", async () => {
            const userData = {
                email: "test@example.com",
                password: "hashedpassword",
                name: "Test User",
                phone: "123456789",
                avatar: null,
                userType: "owner" as const,
                role: "admin",
                companyId,
                storeId,
                active: true,
            };

            const created = await repository.insert(userData);

            expect(created).toBeDefined();
            expect(created.id).toBeDefined();
            expect(created.email).toBe("test@example.com");
            expect(created.name).toBe("Test User");
            expect(created.companyId).toBe(companyId);

            // Verify in DB
            const inDb = await prisma.user.findUnique({ where: { id: created.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.email).toBe("test@example.com");
        });
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const user = await prisma.user.create({
                data: {
                    email: "findme@example.com",
                    password: "hashedpassword",
                    name: "Find Me",
                    userType: "owner",
                    companyId,
                    storeId,
                },
            });

            const found = await repository.findById(user.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(user.id);
            expect(found.email).toBe("findme@example.com");
        });

        it("should return null if user not found", async () => {
            const found = await repository.findById("000000000000000000000000");
            expect(found).toBeNull();
        });
    });

    describe("findByEmail", () => {
        it("should find a user by email", async () => {
            await prisma.user.create({
                data: {
                    email: "unique@example.com",
                    password: "hashedpassword",
                    name: "Unique User",
                    userType: "owner",
                    companyId,
                    storeId,
                },
            });

            const found = await repository.findByEmail("unique@example.com");

            expect(found).toBeDefined();
            expect(found?.email).toBe("unique@example.com");
        });

        it("should return null if email not found", async () => {
            const found = await repository.findByEmail("notexist@example.com");
            expect(found).toBeNull();
        });

        it("should find user by email and companyId", async () => {
            await prisma.user.create({
                data: {
                    email: "company@example.com",
                    password: "hashedpassword",
                    name: "Company User",
                    userType: "owner",
                    companyId,
                    storeId,
                },
            });

            const found = await repository.findByEmail("company@example.com", companyId);
            expect(found).toBeDefined();
            expect(found?.companyId).toBe(companyId);
        });
    });

    describe("existsByEmail", () => {
        it("should return true when email exists", async () => {
            await prisma.user.create({
                data: {
                    email: "exists@example.com",
                    password: "hashedpassword",
                    name: "Existing User",
                    userType: "owner",
                    companyId,
                    storeId,
                },
            });

            const exists = await repository.existsByEmail("exists@example.com");
            expect(exists).toBe(true);
        });

        it("should return false when email does not exist", async () => {
            const exists = await repository.existsByEmail("notexist@example.com");
            expect(exists).toBe(false);
        });
    });

    describe("findAll", () => {
        beforeEach(async () => {
            await prisma.user.createMany({
                data: [
                    {
                        email: "alice@example.com",
                        password: "hash1",
                        name: "Alice",
                        userType: "owner",
                        companyId,
                        storeId,
                    },
                    {
                        email: "bob@example.com",
                        password: "hash2",
                        name: "Bob",
                        userType: "operator",
                        companyId,
                        storeId,
                    },
                    {
                        email: "charlie@example.com",
                        password: "hash3",
                        name: "Charlie",
                        userType: "operator",
                        companyId,
                        storeId,
                    },
                ],
            });
        });

        it("should return all users for a company", async () => {
            const result = await repository.findAll({ companyId });
            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it("should filter by name", async () => {
            const result = await repository.findAll({ companyId, filter: "Alice" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].name).toBe("Alice");
        });

        it("should filter by email", async () => {
            const result = await repository.findAll({ companyId, filter: "bob@" });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].email).toBe("bob@example.com");
        });

        it("should paginate results", async () => {
            const result = await repository.findAll({ companyId, page: 1, per_page: 2 });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.current_page).toBe(1);
        });

        it("should sort results", async () => {
            const result = await repository.findAll({ companyId, sort_by: "name", sort_dir: "asc" });
            expect(result.items[0].name).toBe("Alice");

            const resultDesc = await repository.findAll({ companyId, sort_by: "name", sort_dir: "desc" });
            expect(resultDesc.items[0].name).toBe("Charlie");
        });
    });

    describe("update", () => {
        it("should update an existing user", async () => {
            const user = await prisma.user.create({
                data: {
                    email: "update@example.com",
                    password: "hashedpassword",
                    name: "Old Name",
                    userType: "owner",
                    companyId,
                    storeId,
                },
            });

            const updated = await repository.update({
                ...user,
                name: "New Name",
                phone: "987654321",
            });

            expect(updated.name).toBe("New Name");
            expect(updated.phone).toBe("987654321");

            const inDb = await prisma.user.findUnique({ where: { id: user.id } });
            expect(inDb?.name).toBe("New Name");
        });
    });

    describe("delete", () => {
        it("should soft delete a user (set active to false)", async () => {
            const user = await prisma.user.create({
                data: {
                    email: "delete@example.com",
                    password: "hashedpassword",
                    name: "To Delete",
                    userType: "owner",
                    companyId,
                    storeId,
                    active: true,
                },
            });

            await repository.delete(user.id);

            const inDb = await prisma.user.findUnique({ where: { id: user.id } });
            expect(inDb).toBeDefined();
            expect(inDb?.active).toBe(false);
        });
    });
});
