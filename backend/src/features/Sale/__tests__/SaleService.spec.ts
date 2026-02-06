import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { SaleService, CreateSaleDTO } from "../SaleService.js";
import { SaleRepositoryImpl, CreateSaleData, SaleWithItems } from "../repositories/SaleRepository.js";
import { StoreService } from "../../Store/StoreService.js";
import { ProductService } from "../../Product/ProductService.js";
import { UserContext } from "../../../core/types/UserContext.js";
import { NotFoundError } from "../../../errors/NotFounError.js";
import { Sale, SaleStatus, PaymentMethod, SaleItem } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";

type MockSaleRepository = jest.Mocked<SaleRepositoryImpl>;
type MockStoreService = jest.Mocked<StoreService>;
type MockProductService = jest.Mocked<ProductService>;

describe("SaleService unit tests", () => {
    let saleService: SaleService;
    let mockRepository: MockSaleRepository;
    let mockStoreService: MockStoreService;
    let mockProductService: MockProductService;

    const mockCtx: UserContext = {
        userId: "user-1",
        companyId: "company-1",
        role: "OWNER",
    };

    const makeSale = (overrides: Partial<Sale> = {}): Sale =>
        ({
            id: "sale-1",
            date: new Date("2024-01-01T10:00:00.000Z"),
            total: 1000,
            discount: 0,
            paymentMethod: "PIX" as PaymentMethod,
            status: "COMPLETED" as SaleStatus,
            companyId: "company-1",
            storeId: "store-1",
            userId: "user-1",
            customerId: null,
            ...overrides,
        }) as Sale;

    const makeSaleWithItems = (overrides: Partial<Sale> = {}): SaleWithItems => ({
        ...makeSale(overrides),
        items: [
            {
                id: "item-1",
                saleId: "sale-1",
                productId: "product-1",
                quantity: 2,
                unitPrice: 500,
                subtotal: 1000,
            } as SaleItem,
        ],
    });

    const makeStore = (overrides: { id?: string; companyId?: string } = {}) =>
        ({
            id: overrides.id ?? "store-1",
            companyId: overrides.companyId ?? "company-1",
        }) as unknown;

    const makeProduct = (overrides: Partial<any> = {}) =>
        ({
            id: "product-1",
            name: "Product 1",
            salePrice: 500,
            quantity: 10,
            active: true,
            companyId: "company-1",
            ...overrides,
        }) as unknown;

    const makeCreateSaleDTO = (overrides: Partial<CreateSaleDTO> = {}): CreateSaleDTO => ({
        storeId: "store-1",
        paymentMethod: "PIX",
        items: [{ productId: "product-1", quantity: 2 }],
        ...overrides,
    });

    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            insert: jest.fn(),
            insertWithItems: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByDateRange: jest.fn(),
            findByStatus: jest.fn(),
            findByUserId: jest.fn(),
            findByCustomerId: jest.fn(),
        } as unknown as MockSaleRepository;

        mockStoreService = {
            findStoreById: jest.fn(),
        } as unknown as MockStoreService;

        mockProductService = {
            findById: jest.fn(),
        } as unknown as MockProductService;

        saleService = new SaleService(mockRepository, mockStoreService, mockProductService);
    });

    describe("findAll", () => {
        it("should find a paginate list of sales", async () => {
            const params: SearchInput = {
                page: 1,
                per_page: 10,
                sort_by: "date",
                sort_dir: "desc",
                filter: null,
                companyId: "company-1",
            };

            const output: SearchOutPut<Sale> = {
                items: [makeSale()],
                per_page: 10,
                total: 1,
                current_page: 1,
                sort_by: "date",
                sort_dir: "desc",
                filter: null,
            };

            mockRepository.findAll.mockResolvedValue(output);

            const result = await saleService.findAll(params);

            expect(result).toEqual(output);
            expect(mockRepository.findAll).toHaveBeenCalledWith(params);
        });
    });

    describe("findById", () => {
        it("should return a sale when found and company matches", async () => {
            const sale = makeSale();
            mockRepository.findById.mockResolvedValue(sale);

            const result = await saleService.findById(mockCtx, "sale-1");

            expect(result).toEqual(sale);
            expect(mockRepository.findById).toHaveBeenCalledWith("sale-1");
        });

        it("should throw NotFoundError when sale does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Sale);

            await expect(saleService.findById(mockCtx, "missing")).rejects.toThrow(NotFoundError);
            await expect(saleService.findById(mockCtx, "missing")).rejects.toThrow("Sale not found");
        });

        it("should throw NotFoundError when sale companyId differs", async () => {
            const sale = makeSale({ companyId: "company-2" });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.findById(mockCtx, "sale-1")).rejects.toThrow(NotFoundError);
            await expect(saleService.findById(mockCtx, "sale-1")).rejects.toThrow("Sale not found");
        });
    });

    describe("createSale", () => {
        it("should throw when items array is empty", async () => {
            const dto = makeCreateSaleDTO({ items: [] });

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow("Sale must have at least one item");
            expect(mockStoreService.findStoreById).not.toHaveBeenCalled();
        });

        it("should throw NotFoundError when store is not found", async () => {
            mockStoreService.findStoreById.mockResolvedValue(undefined as unknown as never);
            const dto = makeCreateSaleDTO();

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow(NotFoundError);
            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow("Store not found");
        });

        it("should throw NotFoundError when store companyId differs", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore({ companyId: "company-2" }) as unknown as never);
            const dto = makeCreateSaleDTO();

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow(NotFoundError);
            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow("Store not found");
        });

        it("should throw when product is not active", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore() as never);
            mockProductService.findById.mockResolvedValue(makeProduct({ active: false }) as never);
            const dto = makeCreateSaleDTO();

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow("Product Product 1 is not active");
        });

        it("should throw when insufficient stock", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore() as never);
            mockProductService.findById.mockResolvedValue(makeProduct({ quantity: 1 }) as never);
            const dto = makeCreateSaleDTO({ items: [{ productId: "product-1", quantity: 5 }] });

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow(
                "Insufficient stock for product Product 1. Available: 1, Requested: 5"
            );
        });

        it("should throw when discount exceeds total", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore() as never);
            mockProductService.findById.mockResolvedValue(makeProduct() as never);
            const dto = makeCreateSaleDTO({ discount: 2000 });

            await expect(saleService.createSale(mockCtx, dto)).rejects.toThrow("Discount cannot exceed total value");
        });

        it("should create a sale with items and calculate total", async () => {
            mockStoreService.findStoreById.mockResolvedValue(makeStore() as never);
            mockProductService.findById.mockResolvedValue(makeProduct() as never);
            mockRepository.insertWithItems.mockResolvedValue(makeSaleWithItems());

            const dto = makeCreateSaleDTO();
            const result = await saleService.createSale(mockCtx, dto);

            expect(result).toBeDefined();
            expect(mockRepository.insertWithItems).toHaveBeenCalledWith(
                expect.objectContaining({
                    total: 1000,
                    companyId: "company-1",
                    userId: "user-1",
                    storeId: "store-1",
                    status: "COMPLETED",
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            productId: "product-1",
                            quantity: 2,
                            unitPrice: 500,
                            subtotal: 1000,
                        }),
                    ]),
                })
            );
        });
    });

    describe("cancelSale", () => {
        it("should throw NotFoundError when sale does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Sale);

            await expect(saleService.cancelSale(mockCtx, "missing")).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when sale companyId differs", async () => {
            const sale = makeSale({ companyId: "company-2" });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.cancelSale(mockCtx, "sale-1")).rejects.toThrow(NotFoundError);
        });

        it("should throw when sale is already canceled", async () => {
            const sale = makeSale({ status: "CANCELED" as SaleStatus });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.cancelSale(mockCtx, "sale-1")).rejects.toThrow("Sale is already canceled");
        });

        it("should throw when trying to cancel a refunded sale", async () => {
            const sale = makeSale({ status: "REFUNDED" as SaleStatus });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.cancelSale(mockCtx, "sale-1")).rejects.toThrow("Cannot cancel a refunded sale");
        });

        it("should cancel a sale when valid", async () => {
            const sale = makeSale();
            mockRepository.findById.mockResolvedValue(sale);
            mockRepository.update.mockResolvedValue(makeSale({ status: "CANCELED" as SaleStatus }));

            const result = await saleService.cancelSale(mockCtx, "sale-1");

            expect(result.status).toBe("CANCELED");
            expect(mockRepository.update).toHaveBeenCalledWith({ id: "sale-1", status: "CANCELED" });
        });
    });

    describe("refundSale", () => {
        it("should throw NotFoundError when sale does not exist", async () => {
            mockRepository.findById.mockResolvedValue(undefined as unknown as Sale);

            await expect(saleService.refundSale(mockCtx, "missing")).rejects.toThrow(NotFoundError);
        });

        it("should throw when sale is already refunded", async () => {
            const sale = makeSale({ status: "REFUNDED" as SaleStatus });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.refundSale(mockCtx, "sale-1")).rejects.toThrow("Sale is already refunded");
        });

        it("should throw when trying to refund a canceled sale", async () => {
            const sale = makeSale({ status: "CANCELED" as SaleStatus });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.refundSale(mockCtx, "sale-1")).rejects.toThrow("Cannot refund a canceled sale");
        });

        it("should throw when trying to refund a pending sale", async () => {
            const sale = makeSale({ status: "PENDING" as SaleStatus });
            mockRepository.findById.mockResolvedValue(sale);

            await expect(saleService.refundSale(mockCtx, "sale-1")).rejects.toThrow("Cannot refund a pending sale");
        });

        it("should refund a sale when valid", async () => {
            const sale = makeSale();
            mockRepository.findById.mockResolvedValue(sale);
            mockRepository.update.mockResolvedValue(makeSale({ status: "REFUNDED" as SaleStatus }));

            const result = await saleService.refundSale(mockCtx, "sale-1");

            expect(result.status).toBe("REFUNDED");
            expect(mockRepository.update).toHaveBeenCalledWith({ id: "sale-1", status: "REFUNDED" });
        });
    });
});
