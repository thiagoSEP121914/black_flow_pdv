import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { ICategoryRepository } from "./repositories/ICategoryRepository.js";
import { Category } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";

export interface CreateCategoryDTO {
    name: string;
    description?: string;
    storeId: string;
    active?: boolean;
}

export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
    active?: boolean;
}

export class CategoryService {
    private categoryRepository: ICategoryRepository;

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Category>> {
        return this.categoryRepository.findAll(params);
    }

    async findById(ctx: UserContext, id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) throw new NotFoundError("Category not found");

        if (category.companyId !== ctx.companyId) {
            throw new NotFoundError("Category not found");
        }

        return category;
    }

    async save(ctx: UserContext, data: CreateCategoryDTO): Promise<Category> {
        const safeData = {
            ...data,
            companyId: ctx.companyId,
        };

        return this.categoryRepository.insert(safeData);
    }

    async update(ctx: UserContext, id: string, data: UpdateCategoryDTO): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) throw new NotFoundError("Category not found");

        if (category.companyId !== ctx.companyId) {
            throw new NotFoundError("Category not found");
        }

        return this.categoryRepository.update({ ...category, ...data });
    }

    async delete(ctx: UserContext, id: string): Promise<void> {
        const category = await this.categoryRepository.findById(id);

        if (!category) throw new NotFoundError("Category not found");

        if (category.companyId !== ctx.companyId) {
            throw new NotFoundError("Category not found");
        }

        await this.categoryRepository.delete(id);
    }
}
