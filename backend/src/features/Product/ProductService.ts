import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { IProductRepository } from "./repositories/IProductRepositorie.js";
import { Product } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";
import { prisma } from "../../core/prisma.js";

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

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Product>> {
        // Enforce companyId is already handled by the controller passing it in params.
        // The repository should respect it.
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
            // If user doesn't send storeId and has no storeId in context (e.g. Owner), they must provide it.
            throw new Error("Store ID is required");
        }

        // SECURITY CHECK: Verify if Store belongs to the Company
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) throw new NotFoundError("Store not found");

        if (store.companyId !== ctx.companyId) {
            // Cross-Tenant Access detected!
            // throwing NotFound to hide existence of unauthorized resources
            throw new NotFoundError("Store not found");
        }

        const safeData = {
            ...data,
            companyId: ctx.companyId,
            storeId // Use the resolved storeId
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
}
