import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { StoreService, CreateStoreDTO, UpdateStoreDTO } from "../StoreService.js";
import { IStoreRepository } from "../repositories/IStoreRepository.js";
import { Store } from "@prisma/client";
import { NotFoundError } from "../../../errors/NotFounError.js";
import { UserContext } from "../../../core/types/UserContext.js";

type MockStoreRepository = jest.Mocked<IStoreRepository>;

describe("StoreService unit tests", () => {
    let service: StoreService;
    let mockRepository: MockStoreRepository;

    const ctx: UserContext = {
        userId: "user-1",
        companyId: "company-1",
        role: "OWNER",
    };

    const makeStore = (overrides: Partial<Store> = {}): Store =>
        ({
            id: "store-1",
            name: "Test Store",
            companyId: "company-1",
            status: "active",
            cnpj: null,
            phone: null,
            email: null,
            address: null,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as Store;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllStoreByCompany: jest.fn(),
        } as unknown as MockStoreRepository;

        service = new StoreService(mockRepository);
    });

    describe("findAll", () => {
        it("should return all stores with pagination", async () => {
            const stores = [makeStore(), makeStore({ id: "store-2", name: "Store 2" })];
            mockRepository.findAll.mockResolvedValue({
                items: stores,
                total: 2,
                current_page: 1,
                per_page: 10,
                sort_by: null,
                sort_dir: null,
                filter: null,
            });

            const result = await service.findAll({ page: 1, per_page: 10, companyId: ctx.companyId });

            expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, per_page: 10, companyId: ctx.companyId });
            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(2);
        });
    });

    describe("findStoreById", () => {
        it("should return a store when found and company matches", async () => {
            const store = makeStore();
            mockRepository.findById.mockResolvedValue(store);

            const result = await service.findStoreById(ctx, "store-1");

            expect(mockRepository.findById).toHaveBeenCalledWith("store-1");
            expect(result).toEqual(store);
        });

        it("should throw NotFoundError when store not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.findStoreById(ctx, "nonexistent")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company mismatch", async () => {
            const store = makeStore({ companyId: "different-company" });
            mockRepository.findById.mockResolvedValue(store);

            await expect(service.findStoreById(ctx, "store-1")).rejects.toThrow(NotFoundError);
        });
    });

    describe("createStore", () => {
        it("should create a store with company context", async () => {
            const createDto: CreateStoreDTO = {
                name: "New Store",
                cnpj: "12345678901234",
                phone: "11999999999",
                email: "store@test.com",
                address: "123 Main St",
            };

            const createdStore = makeStore({ ...createDto });
            mockRepository.insert.mockResolvedValue(createdStore);

            const result = await service.createStore(ctx, createDto);

            expect(mockRepository.insert).toHaveBeenCalledWith({
                ...createDto,
                companyId: ctx.companyId,
                status: "active",
            });
            expect(result).toEqual(createdStore);
        });
    });

    describe("updateStore", () => {
        it("should update a store when found and company matches", async () => {
            const existingStore = makeStore();
            const updateDto: UpdateStoreDTO = { name: "Updated Store", phone: "999888777" };
            const updatedStore = makeStore({ ...updateDto });

            mockRepository.findById.mockResolvedValue(existingStore);
            mockRepository.update.mockResolvedValue(updatedStore);

            const result = await service.updateStore(ctx, "store-1", updateDto);

            expect(mockRepository.findById).toHaveBeenCalledWith("store-1");
            expect(mockRepository.update).toHaveBeenCalledWith({ ...existingStore, ...updateDto });
            expect(result.name).toBe("Updated Store");
        });

        it("should throw NotFoundError when store not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.updateStore(ctx, "nonexistent", { name: "Test" })).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company mismatch", async () => {
            const store = makeStore({ companyId: "different-company" });
            mockRepository.findById.mockResolvedValue(store);

            await expect(service.updateStore(ctx, "store-1", { name: "Test" })).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteStore", () => {
        it("should soft delete a store (set status to inactive)", async () => {
            const existingStore = makeStore();
            mockRepository.findById.mockResolvedValue(existingStore);
            mockRepository.update.mockResolvedValue({ ...existingStore, status: "inactive" });

            await service.deleteStore(ctx, "store-1");

            expect(mockRepository.findById).toHaveBeenCalledWith("store-1");
            expect(mockRepository.update).toHaveBeenCalledWith({ ...existingStore, status: "inactive" });
        });

        it("should throw NotFoundError when store not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.deleteStore(ctx, "nonexistent")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company mismatch", async () => {
            const store = makeStore({ companyId: "different-company" });
            mockRepository.findById.mockResolvedValue(store);

            await expect(service.deleteStore(ctx, "store-1")).rejects.toThrow(NotFoundError);
        });
    });
});
