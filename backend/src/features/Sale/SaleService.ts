import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { ISaleRepository } from "./repositories/ISaleRepository.js";
import { SaleRepositoryImpl, CreateSaleData, SaleWithItems } from "./repositories/SaleRepository.js";
import { Sale, SaleStatus, PaymentMethod } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";
import { StoreService } from "../Store/StoreService.js";
import { ProductService } from "../Product/ProductService.js";

export interface CreateSaleItemDTO {
    productId: string;
    quantity: number;
}

export interface CreateSaleDTO {
    storeId: string;
    customerId?: string;
    discount?: number;
    paymentMethod: PaymentMethod;
    items: CreateSaleItemDTO[];
}

export interface SaleFilters extends SearchInput {
    status?: SaleStatus;
    startDate?: Date;
    endDate?: Date;
}

export class SaleService {
    private saleRepository: SaleRepositoryImpl;
    private storeService: StoreService;
    private productService: ProductService;

    constructor(
        saleRepository: SaleRepositoryImpl,
        storeService: StoreService,
        productService: ProductService
    ) {
        this.saleRepository = saleRepository;
        this.storeService = storeService;
        this.productService = productService;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Sale>> {
        return this.saleRepository.findAll(params);
    }

    async findById(ctx: UserContext, id: string): Promise<Sale> {
        const sale = await this.saleRepository.findById(id);

        if (!sale) throw new NotFoundError("Sale not found");

        if (sale.companyId !== ctx.companyId) {
            throw new NotFoundError("Sale not found");
        }

        return sale;
    }

    async createSale(ctx: UserContext, dto: CreateSaleDTO): Promise<SaleWithItems> {
        const { storeId, customerId, discount, paymentMethod, items } = dto;

        if (!items || items.length === 0) {
            throw new Error("Sale must have at least one item");
        }

        const store = await this.storeService.findStoreById(ctx, storeId);
        if (!store) throw new NotFoundError("Store not found");

        const productIds = items.map((i) => i.productId);
        const products = await this.productService.findByIds(ctx, productIds);

        const { saleItems, total } = this.processSaleItems(items, products);

        const finalTotal = total - (discount ?? 0);
        if (finalTotal < 0) {
            throw new Error("Discount cannot exceed total value");
        }

        const saleData: CreateSaleData = {
            total: finalTotal,
            discount: discount ?? 0,
            paymentMethod,
            status: "COMPLETED",
            companyId: ctx.companyId,
            storeId,
            userId: ctx.userId,
            customerId,
            items: saleItems,
        };

        return this.saleRepository.insertWithItems(saleData);
    }

    async cancelSale(ctx: UserContext, id: string): Promise<Sale> {
        const sale = await this.saleRepository.findById(id);

        if (!sale) throw new NotFoundError("Sale not found");

        if (sale.companyId !== ctx.companyId) {
            throw new NotFoundError("Sale not found");
        }

        if (sale.status === "CANCELED") {
            throw new Error("Sale is already canceled");
        }

        if (sale.status === "REFUNDED") {
            throw new Error("Cannot cancel a refunded sale");
        }

        return this.saleRepository.update({
            id,
            status: "CANCELED",
        });
    }

    async refundSale(ctx: UserContext, id: string): Promise<Sale> {
        const sale = await this.saleRepository.findById(id);

        if (!sale) throw new NotFoundError("Sale not found");

        if (sale.companyId !== ctx.companyId) {
            throw new NotFoundError("Sale not found");
        }

        if (sale.status === "REFUNDED") {
            throw new Error("Sale is already refunded");
        }

        if (sale.status === "CANCELED") {
            throw new Error("Cannot refund a canceled sale");
        }

        if (sale.status === "PENDING") {
            throw new Error("Cannot refund a pending sale");
        }

        return this.saleRepository.update({
            id,
            status: "REFUNDED",
        });
    }

    async findByDateRange(ctx: UserContext, start: Date, end: Date): Promise<Sale[]> {
        return this.saleRepository.findByDateRange({
            start,
            end,
            companyId: ctx.companyId,
        });
    }

    async findByStatus(ctx: UserContext, status: SaleStatus): Promise<Sale[]> {
        return this.saleRepository.findByStatus({
            status,
            companyId: ctx.companyId,
        });
    }

    private processSaleItems(dtoItems: CreateSaleItemDTO[], dbProducts: { id: string; name: string; active: boolean; salePrice: number; quantity: number }[]) {
        let total = 0;
        const productMap = new Map(dbProducts.map((product) => [product.id, product]));

        const saleItems = dtoItems.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (!product.active) {
                throw new Error(`Product is not active: ${product.name}`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(
                    `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
                );
            }

            const subtotal = this.calculateSubtotal(item.quantity, product.salePrice);
            total += subtotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.salePrice,
                subtotal,
            };
        });

        return { saleItems, total };
    }

    private calculateSubtotal(quantity: number, unitPrice: number): number {
        return quantity * unitPrice;
    }
}
