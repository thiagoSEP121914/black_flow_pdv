import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { AuthController } from "../AuthController.js";
import { AuthService } from "../AuthService.js";
import { Company, User } from "@prisma/client";

type MockAuthService = jest.Mocked<AuthService>;

describe("AuthController unit tests", () => {
    let controller: AuthController;
    let mockService: MockAuthService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.MockedFunction<Response["json"]>;
    let responseStatus: jest.MockedFunction<Response["status"]>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockService = {
            signupOwner: jest.fn(),
            loginUser: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
        } as unknown as MockAuthService;

        controller = new AuthController(mockService);

        responseJson = jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response["json"]>;
        responseStatus = jest.fn(() => ({
            json: responseJson,
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

    describe("POST /signup", () => {
        it("should create owner account and return 201", async () => {
            mockRequest = {
                body: {
                    email: "owner@test.com",
                    password: "password123",
                    name: "Test Owner",
                    companyName: "Test Company",
                },
            };

            const mockCompany = { id: "company-1", name: "Test Company" } as Company;
            const mockUser = {
                id: "user-1",
                email: "owner@test.com",
                name: "Test Owner",
                userType: "owner",
            } as User;

            mockService.signupOwner.mockResolvedValue({ company: mockCompany, user: mockUser });

            const router = controller.handle();
            const route = getRoute(router, "/signup", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.signupOwner).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "owner@test.com",
                    password: "password123",
                    name: "Test Owner",
                    companyName: "Test Company",
                }),
            );
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Owner account created",
                    company: mockCompany,
                    user: expect.objectContaining({
                        id: "user-1",
                        email: "owner@test.com",
                    }),
                }),
            );
        });

        it("should reject invalid input (password too short)", async () => {
            mockRequest = {
                body: {
                    email: "owner@test.com",
                    password: "12345", // Too short - min 6
                    name: "Test Owner",
                    companyName: "Test Company",
                },
            };

            const router = controller.handle();
            const route = getRoute(router, "/signup", "post");

            await expect(route.route.stack[0].handle(mockRequest, mockResponse)).rejects.toThrow();
        });

        it("should reject invalid email format", async () => {
            mockRequest = {
                body: {
                    email: "invalid-email",
                    password: "password123",
                    name: "Test Owner",
                    companyName: "Test Company",
                },
            };

            const router = controller.handle();
            const route = getRoute(router, "/signup", "post");

            await expect(route.route.stack[0].handle(mockRequest, mockResponse)).rejects.toThrow();
        });
    });

    describe("POST /login", () => {
        it("should return tokens on successful login", async () => {
            mockRequest = {
                body: {
                    email: "test@example.com",
                    password: "password123",
                },
                headers: { "user-agent": "test-agent" },
                ip: "127.0.0.1",
            };

            const loginResponse = {
                accessToken: "mock-access-token",
                refreshToken: "mock-refresh-token",
                expireIn: "1h",
                createdAt: new Date().toISOString(),
            };

            mockService.loginUser.mockResolvedValue(loginResponse);

            const router = controller.handle();
            const route = getRoute(router, "/login", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.loginUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "test@example.com",
                    password: "password123",
                }),
                "test-agent",
                "127.0.0.1",
            );
            expect(responseJson).toHaveBeenCalledWith(loginResponse);
        });

        it("should reject invalid login input (password too short)", async () => {
            mockRequest = {
                body: {
                    email: "test@example.com",
                    password: "12345", // Too short
                },
            };

            const router = controller.handle();
            const route = getRoute(router, "/login", "post");

            await expect(route.route.stack[0].handle(mockRequest, mockResponse)).rejects.toThrow();
        });
    });

    describe("POST /refresh", () => {
        it("should return new access token", async () => {
            mockRequest = {
                body: { refreshToken: "valid-refresh-token" },
            };

            const refreshResponse = { accessToken: "new-access-token", expireIn: "1h" };
            mockService.refreshToken.mockResolvedValue(refreshResponse);

            const router = controller.handle();
            const route = getRoute(router, "/refresh", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.refreshToken).toHaveBeenCalledWith("valid-refresh-token");
            expect(responseJson).toHaveBeenCalledWith(refreshResponse);
        });

        it("should return 400 when refresh token is missing", async () => {
            mockRequest = {
                body: {},
            };

            const router = controller.handle();
            const route = getRoute(router, "/refresh", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: "Refresh token is required" });
        });
    });

    describe("POST /logout", () => {
        it("should logout user successfully", async () => {
            mockRequest = {
                body: { refreshToken: "valid-refresh-token" },
            };

            mockService.logout.mockResolvedValue({ message: "User logged out successfully" });

            const router = controller.handle();
            const route = getRoute(router, "/logout", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.logout).toHaveBeenCalledWith("valid-refresh-token");
            expect(responseJson).toHaveBeenCalledWith({ message: "User logged out successfully" });
        });

        it("should return 400 when refresh token is missing", async () => {
            mockRequest = {
                body: {},
            };

            const router = controller.handle();
            const route = getRoute(router, "/logout", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: "Refresh token is required" });
        });
    });
});
