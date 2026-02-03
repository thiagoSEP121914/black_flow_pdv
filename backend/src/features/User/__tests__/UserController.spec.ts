import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { UserController } from "../UserController.js";
import { UserService } from "../UserService.js";
import { User } from "@prisma/client";

// Mock types
type MockUserService = jest.Mocked<UserService>;

describe("UserController unit tests", () => {
    let userController: UserController;
    let mockService: MockUserService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.MockedFunction<Response["json"]>;
    let responseStatus: jest.MockedFunction<Response["status"]>;

    const makeUser = (overrides: Partial<User> = {}): User =>
        ({
            id: "user-1",
            email: "test@example.com",
            password: "hashedpassword",
            name: "Test User",
            phone: "123456789",
            avatar: null,
            userType: "owner",
            role: "admin",
            companyId: "company-1",
            storeId: "store-1",
            active: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as User;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock service
        mockService = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByEmail: jest.fn(),
            existsByEmail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as MockUserService;

        userController = new UserController(mockService);

        // Setup mock response with proper typing
        responseJson = jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response["json"]>;
        responseStatus = jest.fn(() => ({ json: responseJson })) as unknown as jest.MockedFunction<Response["status"]>;
        mockResponse = {
            json: responseJson as unknown as Response["json"],
            status: responseStatus as unknown as Response["status"],
        };
    });

    describe("GET /me", () => {
        it("should return 401 when user is not authenticated (no userId)", async () => {
            mockRequest = {
                user: undefined,
            };

            const router = userController.handle();

            const routes = (router as any).stack;

            const getMeRoute = routes.find((r: any) => r.route?.path === "/me" && r.route?.methods?.get);

            await getMeRoute.route.stack[0].handle(mockRequest, mockResponse);

            expect(responseStatus).toHaveBeenCalledWith(401);
            expect(responseJson).toHaveBeenCalledWith({
                error: "Usuário não autenticado",
                code: "NOT_AUTHENTICATED",
            });
        });

        it("should return 401 when user is not authenticated (no companyId)", async () => {
            mockRequest = {
                user: { userId: "user-1", role: "OWNER" } as any,
            };

            const router = userController.handle();

            const routes = (router as any).stack;

            const getMeRoute = routes.find((r: any) => r.route?.path === "/me" && r.route?.methods?.get);

            await getMeRoute.route.stack[0].handle(mockRequest, mockResponse);

            expect(responseStatus).toHaveBeenCalledWith(401);
            expect(responseJson).toHaveBeenCalledWith({
                error: "Usuário não autenticado",
                code: "NOT_AUTHENTICATED",
            });
        });

        it("should return 403 when company mismatch", async () => {
            mockRequest = {
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const user = makeUser({ companyId: "company-2" });
            mockService.findById.mockResolvedValue(user);

            const router = userController.handle();

            const routes = (router as any).stack;

            const getMeRoute = routes.find((r: any) => r.route?.path === "/me" && r.route?.methods?.get);

            await getMeRoute.route.stack[0].handle(mockRequest, mockResponse);

            expect(responseStatus).toHaveBeenCalledWith(403);
            expect(responseJson).toHaveBeenCalledWith({
                error: "Acesso negado. Dados inconsistentes.",
                code: "COMPANY_MISMATCH",
            });
        });

        it("should return user data without password when authenticated", async () => {
            mockRequest = {
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const user = makeUser();
            mockService.findById.mockResolvedValue(user);

            const router = userController.handle();

            const routes = (router as any).stack;

            const getMeRoute = routes.find((r: any) => r.route?.path === "/me" && r.route?.methods?.get);

            await getMeRoute.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.findById).toHaveBeenCalledWith("user-1");
            expect(responseJson).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.any(String) }));
            expect(responseJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: "user-1",
                    email: "test@example.com",
                    name: "Test User",
                }),
            );
        });
    });
});
