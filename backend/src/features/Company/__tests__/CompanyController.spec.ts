import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { CompanyController } from "../CompanyController.js";
import { CompanyService } from "../CompanyService.js";
import { Company } from "@prisma/client";

type MockCompanyService = jest.Mocked<CompanyService>;

describe("CompanyController unit tests", () => {
    let controller: CompanyController;
    let mockService: MockCompanyService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.MockedFunction<Response["json"]>;
    let responseStatus: jest.MockedFunction<Response["status"]>;
    let responseSend: jest.MockedFunction<Response["send"]>;

    const makeCompany = (overrides: Partial<Company> = {}): Company =>
        ({
            id: "company-1",
            name: "Test Company",
            status: "active",
            cnpj: null,
            phone: null,
            email: null,
            address: null,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as Company;

    beforeEach(() => {
        jest.clearAllMocks();

        mockService = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByCnpj: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as MockCompanyService;

        controller = new CompanyController(mockService);

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
        it("should return all companies with pagination", async () => {
            mockRequest = {
                query: { page: "1", per_page: "10" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const companies = [makeCompany(), makeCompany({ id: "company-2", name: "Company 2" })];
            mockService.findAll.mockResolvedValue({
                items: companies,
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
                expect.objectContaining({ companyId: "company-1" }),
                expect.objectContaining({ page: 1, per_page: 10 }),
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
        });
    });

    describe("GET /:id", () => {
        it("should return a company by id", async () => {
            mockRequest = {
                params: { id: "company-1" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const company = makeCompany();
            mockService.findById.mockResolvedValue(company);

            const router = controller.handle();
            const route = getRoute(router, "/:id", "get");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.findById).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "company-1",
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(company);
        });
    });

    describe("POST /", () => {
        it("should create a new company", async () => {
            mockRequest = {
                body: {
                    name: "New Company",
                    cnpj: "12345678901234",
                    phone: "11999999999",
                    email: "company@test.com",
                    address: "123 Main St",
                },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const createdCompany = makeCompany({ name: "New Company" });
            mockService.save.mockResolvedValue(createdCompany);

            const router = controller.handle();
            const route = getRoute(router, "/", "post");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.save).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                expect.objectContaining({ name: "New Company" }),
            );
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(createdCompany);
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

        it("should reject invalid email format", async () => {
            mockRequest = {
                body: { name: "Test Company", email: "invalid-email" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const router = controller.handle();
            const route = getRoute(router, "/", "post");

            await expect(route.route.stack[0].handle(mockRequest, mockResponse)).rejects.toThrow();
        });
    });

    describe("PATCH /:id", () => {
        it("should update a company", async () => {
            mockRequest = {
                params: { id: "company-1" },
                body: { name: "Updated Company" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            const updatedCompany = makeCompany({ name: "Updated Company" });
            mockService.update.mockResolvedValue(updatedCompany);

            const router = controller.handle();
            const route = getRoute(router, "/:id", "patch");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.update).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "company-1",
                expect.objectContaining({ name: "Updated Company" }),
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(updatedCompany);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete a company", async () => {
            mockRequest = {
                params: { id: "company-1" },
                user: { userId: "user-1", companyId: "company-1", role: "OWNER" },
            };

            mockService.delete.mockResolvedValue();

            const router = controller.handle();
            const route = getRoute(router, "/:id", "delete");

            await route.route.stack[0].handle(mockRequest, mockResponse);

            expect(mockService.delete).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
                "company-1",
            );
            expect(responseStatus).toHaveBeenCalledWith(204);
        });
    });
});
