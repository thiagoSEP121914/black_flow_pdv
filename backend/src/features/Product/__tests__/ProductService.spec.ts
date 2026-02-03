import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { ProductService, CreateProductDTO, UpdateProductDTO } from "../ProductService.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { StoreService } from "../../Store/StoreService.js";
import { UserContext } from "../../../core/types/UserContext.js";
import { NotFoundError } from "../../../errors/NotFounError.js";
import { Product } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";

// Mock types
type MockRepository = jest.Mocked<IProductRepository>;
type MockStoreService = jest.Mocked<StoreService>;

describe("ProductService unit tests", () => {
    let productService: ProductService;
    let mockRepository: MockRepository;
    let mockStoreService: MockStoreService;

    const mockCtx: UserContext = {
        userId: "user-1",
        companyId: "company-1",
        role: "OWNER",
    };

    const makeProduct = (overrides: Partial<Product> = {}): Product =>
        ({
            id: "product-1",
            name: "Product 1",
            description: "Desc",
            salePrice: 10,
            costPrice: 5,
            barcode: "123456",
            categoryId: "category-1",
            storeId: "store-1",
            companyId: "company-1",
            quantity: 5,
            minStock: 1,
            active: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as Product;

    const makeStore = (overrides: { id?: string; companyId?: string } = {}) =>
        ({
            id: overrides.id ?? "store-1",
            companyId: overrides.companyId ?? "company-1",
        }) as unknown;

    const makeCreateProductDTO = (overrides: Partial<CreateProductDTO> = {}): CreateProductDTO => ({
        name: "Product 1",
        salePrice: 10,
        storeId: "store-1",
        ...overrides,
    });

    beforeEach(() => {
        // Create mock repository
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByCode: jest.fn(),
            findByCompanyId: jest.fn(),
            findByCategoryId: jest.fn(),
        } as unknown as MockRepository;
        mockStoreService = {
            findStoreById: jest.fn(),
        } as unknown as MockStoreService;

        productService = new ProductService(mockRepository, mockStoreService);
    });

    describe("findAll", () => {
        it("should find a paginate list of products", async () => {
            const params: SearchInput = {
                page: 1,
                per_page: 10,
                sort_by: "name",
                sort_dir: "asc",
                filter: null,
                companyId: "company-1",
            };

            const output: SearchOutPut<Product> = {
                items: [makeProduct()],
                per_page: 10,
                total: 1,
                current_page: 1,
                sort_by: "name",
                sort_dir: "asc",
                filter: null,
            };

            mockRepository.findAll.mockResolvedValue(output);

            const result = await productService.findAll(params);

            expect(result).toEqual(output);
            expect(mockRepository.findAll).toHaveBeenCalledWith(params);
        });
    });

    describe("findById", () => {
        it("should return a product when found and company matches", async () => {
            const product = makeProduct();
            mockRepository.findById.mockResolvedValue(product);

            const result = await productService.findById(mockCtx, "product-1");

            expect(result).toEqual(product);
            expect(mockRepository.findById).toHaveBeenCalledWith("product-1");
        });

        it("should throw NotFoundError when product does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Product);

            await expect(productService.findById(mockCtx, "missing")).rejects.toThrow(NotFoundError);
            await expect(productService.findById(mockCtx, "missing")).rejects.toThrow("Product not found");
            expect(mockRepository.findById).toHaveBeenCalledWith("missing");
        });

        it("should throw NotFoundError when product companyId differs", async () => {
            const product = makeProduct({ companyId: "company-2" });
            mockRepository.findById.mockResolvedValue(product);

            await expect(productService.findById(mockCtx, "product-1")).rejects.toThrow(NotFoundError);
            await expect(productService.findById(mockCtx, "product-1")).rejects.toThrow("Product not found");
        });
    });

    describe("save", () => {
        it("should throw when storeId is missing", async () => {
            const payload = makeCreateProductDTO({ storeId: undefined as unknown as string });

            await expect(productService.save(mockCtx, payload)).rejects.toThrow("Store ID is required");
            expect(mockStoreService.findStoreById).not.toHaveBeenCalled();
            expect(mockRepository.insert).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError when store is not found", async () => {
            mockStoreService.findStoreById.mockResolvedValue(undefined as unknown as never);
            const payload = makeCreateProductDTO();

            await expect(productService.save(mockCtx, payload)).rejects.toThrow(NotFoundError);
            await expect(productService.save(mockCtx, payload)).rejects.toThrow("Store not found");
            expect(mockStoreService.findStoreById).toHaveBeenCalledWith(mockCtx, payload.storeId);
            expect(mockRepository.insert).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError when store companyId differs", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore({ companyId: "company-2" }) as unknown as never);
            const payload = makeCreateProductDTO();

            await expect(productService.save(mockCtx, payload)).rejects.toThrow(NotFoundError);
            await expect(productService.save(mockCtx, payload)).rejects.toThrow("Store not found");
            expect(mockStoreService.findStoreById).toHaveBeenCalledWith(mockCtx, payload.storeId);
            expect(mockRepository.insert).not.toHaveBeenCalled();
        });

        it("should create a product with companyId and storeId", async () => {
            const store = makeStore({ companyId: "company-1" });
            mockStoreService.findStoreById.mockResolvedValue(store as never);

            const payload = makeCreateProductDTO();
            const created = makeProduct({ name: payload.name, salePrice: payload.salePrice, storeId: payload.storeId });
            mockRepository.insert.mockResolvedValue(created);

            const result = await productService.save(mockCtx, payload);

            expect(result).toEqual(created);
            expect(mockStoreService.findStoreById).toHaveBeenCalledWith(mockCtx, payload.storeId);
            expect(mockRepository.insert).toHaveBeenCalledWith({
                ...payload,
                companyId: mockCtx.companyId,
                storeId: payload.storeId,
            });
        });
    });

    describe("update", () => {
        it("should throw NotFoundError when product does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Product);

            await expect(productService.update(mockCtx, "missing", {})).rejects.toThrow(NotFoundError);
            await expect(productService.update(mockCtx, "missing", {})).rejects.toThrow("Product not found");
            expect(mockRepository.findById).toHaveBeenCalledWith("missing");
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError when product companyId differs", async () => {
            const product = makeProduct({ companyId: "company-2" });
            mockRepository.findById.mockResolvedValue(product);

            await expect(productService.update(mockCtx, "product-1", {})).rejects.toThrow(NotFoundError);
            await expect(productService.update(mockCtx, "product-1", {})).rejects.toThrow("Product not found");
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it("should update a product with merged data", async () => {
            const product = makeProduct();
            mockRepository.findById.mockResolvedValue(product);

            const updateData: UpdateProductDTO = { name: "New Name", salePrice: 22 };
            const updated = makeProduct({ ...product, ...updateData });
            mockRepository.update.mockResolvedValue(updated);

            const result = await productService.update(mockCtx, "product-1", updateData);

            expect(result).toEqual(updated);
            expect(mockRepository.findById).toHaveBeenCalledWith("product-1");
            expect(mockRepository.update).toHaveBeenCalledWith({ ...product, ...updateData });
        });
    });

    describe("delete", () => {
        it("should throw NotFoundError when product does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Product);

            await expect(productService.delete(mockCtx, "missing")).rejects.toThrow(NotFoundError);
            await expect(productService.delete(mockCtx, "missing")).rejects.toThrow("Product not found");
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError when product companyId differs", async () => {
            const product = makeProduct({ companyId: "company-2" });
            mockRepository.findById.mockResolvedValue(product);

            await expect(productService.delete(mockCtx, "product-1")).rejects.toThrow(NotFoundError);
            await expect(productService.delete(mockCtx, "product-1")).rejects.toThrow("Product not found");
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it("should delete a product when company matches", async () => {
            const product = makeProduct();
            mockRepository.findById.mockResolvedValue(product);

            await productService.delete(mockCtx, "product-1");

            expect(mockRepository.findById).toHaveBeenCalledWith("product-1");
            expect(mockRepository.delete).toHaveBeenCalledWith("product-1");
        });
    });

    describe("findByCode", () => {
        it("should throw NotFoundError when product does not exist", async () => {
            mockRepository.findByCode.mockResolvedValue(undefined as unknown as Product);

            await expect(productService.findByCode(mockCtx, "code-1")).rejects.toThrow(NotFoundError);
            await expect(productService.findByCode(mockCtx, "code-1")).rejects.toThrow("Product not found");
            expect(mockRepository.findByCode).toHaveBeenCalledWith("code-1");
        });

        it("should throw NotFoundError when product companyId differs", async () => {
            const product = makeProduct({ companyId: "company-2" });
            mockRepository.findByCode.mockResolvedValue(product);

            await expect(productService.findByCode(mockCtx, "code-1")).rejects.toThrow(NotFoundError);
            await expect(productService.findByCode(mockCtx, "code-1")).rejects.toThrow("Product not found");
        });

        it("should return product when company matches", async () => {
            const product = makeProduct();
            mockRepository.findByCode.mockResolvedValue(product);

            const result = await productService.findByCode(mockCtx, "code-1");

            expect(result).toEqual(product);
            expect(mockRepository.findByCode).toHaveBeenCalledWith("code-1");
        });
    });
});
