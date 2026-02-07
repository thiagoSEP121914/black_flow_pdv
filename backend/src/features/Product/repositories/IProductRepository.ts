import { IRepository } from "../../../core/interface/IRepository.js";
import { Product } from "@prisma/client";

export interface IProductRepository extends IRepository<Product, Partial<Product>> {
    update(model: Partial<Product>): Promise<Product>;
    findByCode(code: string): Promise<Product>;
    findByCompanyId(companyId: string): Promise<Product[]>;
    findByCategoryId(categoryId: string): Promise<Product[]>;
    findByIds(ids: string[]): Promise<Product[]>;
}
