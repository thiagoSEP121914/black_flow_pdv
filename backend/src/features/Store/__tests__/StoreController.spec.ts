import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { StoreController } from "../StoreController.js";
import { StoreService } from "../StoreService.js";
import { Store } from "@prisma/client";

type MockStoreService = jest.Mocked<StoreService>;

describe("StoreController unit tests", () => {
    let controller: StoreController;
    let mockService: MockStoreService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.MockedFunction<Response["json"]>;
    let responseStatus: jest.MockedFunction<Response["status"]>;
    let responseSend: jest.MockedFunction<Response["send"]>;

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

        mockService = {
            findAll: jest.fn(),
            findStoreById: jest.fn(),
            createStore: jest.fn(),
            updateStore: jest.fn(),
            deleteStore: jest.fn(),
        } as unknown as MockStoreService;

        controller = new StoreController(mockService);

        responseJson = jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response["json"]>;
        responseSend = jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response["send"]>;
        responseStatus = jest.fn(() => ({
            json: responseJson,
            send: responseSend,
        })) as unknown as jest.MockedFunction<Response["status"]>;

        mockResponse = {
            json: responseJson as unknown as Response["json"],
            status: responseStatus as unknown as Response["status"],
        };
    });

    const getRoute = (router: any, path: string, method: string) => {
        const routes = (router as any).stack;
        return routes.find((r: any) => r.route?.path === path && r.route?.methods?.[method]);
    };

    describe("GET /", () => {
        it("should return all stores with pagination", async () => {
            mockRequest = {
                query: { page: "1", per_page: "10" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const stores = [makeStore(), makeStore({ id: "store-2", name: "Store 2" })];
            mockService.findAll.mockResolvedValue({
                items: stores,
                total: 2,
                current_page: 1,
                per_page: 10,
                sort_by: null,
                sort_dir: null,
                filter: null,
            });

            const router = controller.handle();
            const route = getRoute(router, "/", "get");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    per_page: 10,
                    companyId: "company-1",
                }),
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
        });
    });

    describe("GET /:id", () => {
        it("should return a store by id", async () => {
            mockRequest = {
                params: { id: "store-1" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const store = makeStore();
            mockService.findStoreById.mockResolvedValue(store);

            const router = controller.handle();
            const route = getRoute(router, "/:id", "get");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.findStoreById).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "store-1",
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(store);
        });
    });

    describe("POST /", () => {
        it("should create a new store", async () => {
            mockRequest = {
                body: {
                    name: "New Store",
                    cnpj: "12345678901234",
                    phone: "11999999999",
                    email: "store@test.com",
                    address: "123 Main St",
                },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const createdStore = makeStore({ name: "New Store" });
            mockService.createStore.mockResolvedValue(createdStore);

            const router = controller.handle();
            const route = getRoute(router, "/", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.createStore).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                expect.objectContaining({ name: "New Store" }),
            );
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(createdStore);
        });

        it("should reject invalid input (name too short)", async () => {
            mockRequest = {
                body: { name: "A" }, // Too short - min 2
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const router = controller.handle();
            const route = getRoute(router, "/", "post");

            await expect(route.route.stack[0].handle(mockRequest, mockResponse)).rejects.toThrow();
        });
    });

    describe("PATCH /:id", () => {
        it("should update a store", async () => {
            mockRequest = {
                params: { id: "store-1" },
                body: { name: "Updated Store" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const updatedStore = makeStore({ name: "Updated Store" });
            mockService.updateStore.mockResolvedValue(updatedStore);

            const router = controller.handle();
            const route = getRoute(router, "/:id", "patch");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.updateStore).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "store-1",
                expect.objectContaining({ name: "Updated Store" }),
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(updatedStore);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete a store", async () => {
            mockRequest = {
                params: { id: "store-1" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            mockService.deleteStore.mockResolvedValue();

            const router = controller.handle();
            const route = getRoute(router, "/:id", "delete");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.deleteStore).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "store-1",
            );
            expect(responseStatus).toHaveBeenCalledWith(204);
        });
    });
});
