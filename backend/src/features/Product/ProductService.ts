import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { IProductRepository } from "./repositories/IProductRepository.js";
import { Product } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";
import { StoreService } from "../Store/StoreService.js";

export interface CreateProductDTO {
    name: string;
    description?: string;
    costPrice?: number;
    salePrice: number;
    barcode?: string;
    categoryId?: string;
    storeId: string;
    quantity?: number;
    minStock?: number;
    active?: boolean;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    barcode?: string;
    categoryId?: string;
    quantity?: number;
    minStock?: number;
}

export class ProductService {
    private productRepository: IProductRepository;
    private storeService: StoreService;

    constructor(productRepository: IProductRepository, storeService: StoreService) {
        this.productRepository = productRepository;
        this.storeService = storeService;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Product>> {
        return this.productRepository.findAll(params);
    }

    async findById(ctx: UserContext, id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);

        if (!product) throw new NotFoundError("Product not found");

        if (product.companyId !== ctx.companyId) {
            throw new NotFoundError("Product not found");
        }

        return product;
    }

    async save(ctx: UserContext, data: CreateProductDTO): Promise<Product> {
        const storeId = data.storeId;

        if (!storeId) {
            throw new Error("Store ID is required");
        }

        const store = await this.storeService.findStoreById(ctx, storeId);

        if (!store) throw new NotFoundError("Store not found");

        if (store.companyId !== ctx.companyId) {
            throw new NotFoundError("Store not found");
        }

        const safeData = {
            ...data,
            companyId: ctx.companyId,
            storeId,
        };

        return this.productRepository.insert(safeData);
    }

    async update(ctx: UserContext, id: string, data: UpdateProductDTO): Promise<Product> {
        const product = await this.productRepository.findById(id);

        if (!product) throw new NotFoundError("Product not found");

        if (product.companyId !== ctx.companyId) {
            throw new NotFoundError("Product not found");
        }

        return this.productRepository.update({ ...product, ...data });
    }

    async delete(ctx: UserContext, id: string): Promise<void> {
        const product = await this.productRepository.findById(id);

        if (!product) throw new NotFoundError("Product not found");

        if (product.companyId !== ctx.companyId) {
            throw new NotFoundError("Product not found");
        }

        await this.productRepository.delete(id);
    }

    async findByCode(ctx: UserContext, code: string): Promise<Product> {
        const product = await this.productRepository.findByCode(code);

        if (!product) throw new NotFoundError("Product not found");

        if (product.companyId !== ctx.companyId) {
            throw new NotFoundError("Product not found");
        }

        return product;
    }

    async findByIds(ctx: UserContext, ids: string[]): Promise<Product[]> {
        const products = await this.productRepository.findByIds(ids);
        return products.filter((p) => p.companyId === ctx.companyId);
    }
}
