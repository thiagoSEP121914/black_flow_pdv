import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";
import { IStoreRepository } from "./IStoreRepository.js";
import { PrismaClient, Store } from "@prisma/client";

export class StoreRepositoryImpl implements IStoreRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async findAllStoreByCompany(id: string): Promise<Store[]> {
        return await this.prisma.store.findMany({
            where: { companyId: id },
        });
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Store>> {
        const { page, per_page, sort_by, sort_dir, filter, companyId } = params;

        const skip = page && per_page ? (page - 1) * per_page : undefined;
        const take = per_page ?? undefined;

        const where: any = this.buildWhereClause(filter);

        if (companyId) {
            where.companyId = companyId;
        }

        const [items, total] = await Promise.all([
            this.prisma.store.findMany({
                where,
                ...(skip !== undefined ? { skip } : {}),
                ...(take !== undefined ? { take } : {}),
                orderBy: sort_by ? { [sort_by]: sort_dir ?? "asc" } : undefined,
            }),
            this.prisma.store.count({ where }),
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


    async findById(id: string): Promise<Store> {
        return (await this.prisma.store.findUnique({
            where: { id },
        })) as Store;
    }

    async insert(model: Partial<Store>): Promise<Store> {
        return await this.prisma.store.create({
            data: model as any,
        });
    }

    async update(model: Partial<Store>): Promise<Store> {
        const { id, ...data } = model;
        if (!id) throw new Error("ID required for update");

        return await this.prisma.store.update({
            where: { id },
            data: data as any,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.store.delete({
            where: { id },
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