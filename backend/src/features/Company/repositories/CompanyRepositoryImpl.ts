import { Company } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";
import { ICompanyRepository } from "./ICompanyRepository.js";
import { PrismaClient } from "@prisma/client/extension";

export class CompanyRepositoryImpl implements ICompanyRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Company>> {
        const { page, per_page, sort_by, sort_dir, filter, companyId } = params;

        const skip = page && per_page ? (page - 1) * per_page : undefined;
        const take = per_page ?? undefined;

        const where = this.buildWhereClause(filter);

        if (companyId) {
            where.id = companyId;
        }

        const [items, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                ...(skip !== undefined ? { skip } : {}),
                ...(take !== undefined ? { take } : {}),
                orderBy: sort_by ? { [sort_by]: sort_dir ?? "asc" } : undefined,
            }),
            this.prisma.company.count({ where }),
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

    async findById(id: string): Promise<Company> {
        return await this.prisma.company.findUnique({
            where: { id },
        });
    }

    async findByCnpj(cnpj: string): Promise<Company> {
        return await this.prisma.company.findFirst({
            where: { cnpj },
        });
    }

    async insert(model: Partial<Company>): Promise<Company> {
        return await this.prisma.company.create({
            data: model,
        });
    }

    async update(model: Partial<Company>): Promise<Company> {
        const { id, ...data } = model;

        return await this.prisma.company.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.company.update({
            where: { id },
            data: { status: "inactive" },
        });
    }

    private buildWhereClause(filter?: string | null): any {
        if (!filter) return {};

        if (filter.includes("=")) {
            const [key, value] = filter.split("=");
            const validKeys = ["name", "email", "phone", "cnpj", "address"];

            if (validKeys.includes(key.trim())) {
                return { [key.trim()]: { contains: value.trim(), mode: "insensitive" } };
            }
        }

        return {
            OR: [
                { name: { contains: filter, mode: "insensitive" } },
                { email: { contains: filter, mode: "insensitive" } },
                { phone: { contains: filter, mode: "insensitive" } },
                { cnpj: { contains: filter, mode: "insensitive" } },
                { address: { contains: filter, mode: "insensitive" } },
            ],
        };
    }
}
