import { IProductRepository } from "./IProductRepositorie.js";
import { Product } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";
import { PrismaClient } from "@prisma/client";

export class ProductRepositoryImpl implements IProductRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Product>> {
        const { page, per_page, sort_by, sort_dir, filter, companyId } = params;

        const skip = page && per_page ? (page - 1) * per_page : undefined;
        const take = per_page ?? undefined;

        const where: any = this.buildWhereClause(filter);

        if (companyId) {
            where.companyId = companyId;
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                ...(skip !== undefined ? { skip } : {}),
                ...(take !== undefined ? { take } : {}),
                orderBy: sort_by ? { [sort_by]: sort_dir ?? "asc" } : undefined,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items,
            per_page: per_page ?? total,
            total,
            current_page: page ?? 1,
            sort_by: sort_by ?? null,
            sort_dir: sort_dir ?? null,
            filter: filter ?? null,
        };
    }
    async findById(id: string): Promise<Product> {
        return (await this.prisma.product.findUnique({
            where: { id },
        })) as Product;
    }
    async insert(product: Partial<Product>): Promise<Product> {
        return await this.prisma.product.create({
            data: product as any,
        });
    }
    async update(model: Partial<Product>): Promise<Product> {
        const { id, ...data } = model;

        if (!id) throw new Error("ID not provided for update");

        return await this.prisma.product.update({
            where: { id },
            data: data as any,
        });
    }
    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async findByCode(code: string): Promise<Product> {
        return (await this.prisma.product.findFirst({
            where: { barcode: code },
        })) as Product;
    }
    async findByCompanyId(companyId: string): Promise<Product[]> {
        return await this.prisma.product.findMany({
            where: { companyId },
        });
    }
    async findByCategoryId(categoryId: string): Promise<Product[]> {
        return await this.prisma.product.findMany({
            where: { categoryId },
        });
    }

    private buildWhereClause(filter?: string | null): any {
        if (!filter) return {};

        if (filter.includes("=")) {
            const [key, value] = filter.split("=");
            const validKeys = ["name", "description", "barcode", "location"];

            if (validKeys.includes(key.trim())) {
                return { [key.trim()]: { contains: value.trim(), mode: "insensitive" } };
            }
        }

        return {
            OR: [
                { name: { contains: filter, mode: "insensitive" } },
                { description: { contains: filter, mode: "insensitive" } },
                { barcode: { contains: filter, mode: "insensitive" } },
            ],
        };
    }
}