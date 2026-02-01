import { IRepository } from "../../../core/interface/IRepository.js";
import { Product } from "@prisma/client";

export interface IProductRepository extends IRepository<Product, Partial<Product>> {
    findByCode(code: string): Promise<Product>;
    findByCompanyId(companyId: string): Promise<Product[]>;
    findByCategoryId(categoryId: string): Promise<Product[]>;
}