import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { IProductRepository } from "./repositories/IProductRepositorie.js";
import { Product } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";

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
        return this.productRepository.findAll(params);
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) throw new NotFoundError("Product not found");
        return product;
    }

    async save(data: CreateProductDTO): Promise<Product> {
        return this.productRepository.insert(data);
    }

    async update(id: string, data: UpdateProductDTO): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) throw new NotFoundError("Product not found");
        return this.productRepository.update({ ...product, ...data });
    }

    async delete(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);
        if (!product) throw new NotFoundError("Product not found");
        await this.productRepository.delete(id);
    }

    async findByCode(code: string): Promise<Product> {
        const product = await this.productRepository.findByCode(code);
        if (!product) throw new NotFoundError("Product not found");
        return product;
    }
}
