import { Category, PrismaClient } from "@prisma/client";
import { ICategoryRepository } from "./ICategoryRepository.js";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";

export class CategoryRepositoryImpl implements ICategoryRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Category>> {
        const { page = 1, per_page = 10, sort_by = "createdAt", sort_dir = "desc", filter, companyId } = params;

        const skip = (page - 1) * per_page;

        const where: any = {
            companyId,
        };

        if (filter) {
            where.OR = [
                { name: { contains: filter, mode: "insensitive" } },
                { description: { contains: filter, mode: "insensitive" } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take: per_page,
                orderBy: {
                    [sort_by]: sort_dir,
                },
            }),
            this.prisma.category.count({ where }),
        ]);

        return {
            items,
            per_page,
            total,
            current_page: page,
            sort_by,
            sort_dir,
            filter: filter || null,
        };
    }

    async findById(id: string): Promise<Category> {
        return (await this.prisma.category.findUnique({
            where: { id },
        })) as Category;
    }

    async insert(data: Partial<Category>): Promise<Category> {
        return this.prisma.category.create({
            data: data as any,
        });
    }

    async update(data: Category): Promise<Category> {
        return this.prisma.category.update({
            where: { id: data.id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: { active: false },
        });
    }
}
