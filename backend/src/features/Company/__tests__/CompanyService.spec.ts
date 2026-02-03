import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { CompanyService, CreateCompanyDto, UpdateCompanyDto } from "../CompanyService.js";
import { ICompanyRepository } from "../repositories/ICompanyRepository.js";
import { Company } from "@prisma/client";
import { NotFoundError } from "../../../errors/NotFounError.js";
import { UserContext } from "../../../core/types/UserContext.js";

type MockCompanyRepository = jest.Mocked<ICompanyRepository>;

describe("CompanyService unit tests", () => {
    let service: CompanyService;
    let mockRepository: MockCompanyRepository;

    const ctx: UserContext = {
        userId: "user-1",
        companyId: "company-1",
        role: "OWNER",
    };

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

        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByCnpj: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as MockCompanyRepository;

        service = new CompanyService(mockRepository);
    });

    describe("findAll", () => {
        it("should return all companies with companyId from context", async () => {
            const companies = [makeCompany(), makeCompany({ id: "company-2", name: "Company 2" })];
            mockRepository.findAll.mockResolvedValue({
                items: companies,
                total: 2,
                current_page: 1,
                per_page: 10,
                sort_by: null,
                sort_dir: null,
                filter: null,
            });

            const result = await service.findAll(ctx, { companyId: "ignored" });

            expect(mockRepository.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ companyId: "company-1" }),
            );
            expect(result.items).toHaveLength(2);
        });
    });

    describe("findById", () => {
        it("should return company when found and belongs to context", async () => {
            const company = makeCompany();
            mockRepository.findById.mockResolvedValue(company);

            const result = await service.findById(ctx, "company-1");

            expect(result).toEqual(company);
            expect(mockRepository.findById).toHaveBeenCalledWith("company-1");
        });

        it("should throw NotFoundError when company not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.findById(ctx, "nonexistent")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company belongs to different context", async () => {
            const otherCompany = makeCompany({ id: "company-other" });
            mockRepository.findById.mockResolvedValue(otherCompany);

            await expect(service.findById(ctx, "company-other")).rejects.toThrow(NotFoundError);
        });
    });

    describe("findByCnpj", () => {
        it("should return company when CNPJ found", async () => {
            const company = makeCompany({ cnpj: "12345678901234" });
            mockRepository.findByCnpj.mockResolvedValue(company);

            const result = await service.findByCnpj("12345678901234");

            expect(result.cnpj).toBe("12345678901234");
        });

        it("should throw NotFoundError when CNPJ not found", async () => {
            mockRepository.findByCnpj.mockResolvedValue(null as any);

            await expect(service.findByCnpj("00000000000000")).rejects.toThrow(NotFoundError);
        });
    });

    describe("save", () => {
        it("should create a new company", async () => {
            const createDto: CreateCompanyDto = {
                name: "New Company",
                status: "active",
            };
            const createdCompany = makeCompany({ name: "New Company" });
            mockRepository.insert.mockResolvedValue(createdCompany);

            const result = await service.save(ctx, createDto);

            expect(mockRepository.insert).toHaveBeenCalledWith(createDto);
            expect(result.name).toBe("New Company");
        });
    });

    describe("update", () => {
        it("should update company when found and belongs to context", async () => {
            const company = makeCompany();
            const updateDto: UpdateCompanyDto = { name: "Updated Name" };
            const updatedCompany = makeCompany({ name: "Updated Name" });

            mockRepository.findById.mockResolvedValue(company);
            mockRepository.update.mockResolvedValue(updatedCompany);

            const result = await service.update(ctx, "company-1", updateDto);

            expect(mockRepository.update).toHaveBeenCalledWith(
                expect.objectContaining({ name: "Updated Name" }),
            );
            expect(result.name).toBe("Updated Name");
        });

        it("should throw NotFoundError when company not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.update(ctx, "nonexistent", { name: "New" })).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company belongs to different context", async () => {
            const otherCompany = makeCompany({ id: "company-other" });
            mockRepository.findById.mockResolvedValue(otherCompany);

            await expect(service.update(ctx, "company-other", { name: "New" })).rejects.toThrow(NotFoundError);
        });
    });

    describe("delete", () => {
        it("should delete company when found and belongs to context", async () => {
            const company = makeCompany();
            mockRepository.findById.mockResolvedValue(company);
            mockRepository.delete.mockResolvedValue();

            await service.delete(ctx, "company-1");

            expect(mockRepository.delete).toHaveBeenCalledWith("company-1");
        });

        it("should throw NotFoundError when company not found", async () => {
            mockRepository.findById.mockResolvedValue(null as any);

            await expect(service.delete(ctx, "nonexistent")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when company belongs to different context", async () => {
            const otherCompany = makeCompany({ id: "company-other" });
            mockRepository.findById.mockResolvedValue(otherCompany);

            await expect(service.delete(ctx, "company-other")).rejects.toThrow(NotFoundError);
        });
    });
});
