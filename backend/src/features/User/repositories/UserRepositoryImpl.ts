import { User } from "@prisma/client";
import { IUserRepository } from "./IUserRepository.js";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";
import { PrismaClient } from "@prisma/client/extension";

type UserCreateData = {
    email: string;
    password: string;
    name: string;
    phone: string | null;
    avatar: string | null;
    userType: "owner" | "operator";
    role: string | null;
    companyId: string;
    storeId: string | null;
    active: boolean;
};

export class UserRepositoryImpl implements IUserRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput & { companyId?: string }): Promise<SearchOutPut<User>> {
        const { page, per_page, sort_by, sort_dir, filter, companyId } = params;

        const skip = page && per_page ? (page - 1) * per_page : undefined;
        const take = per_page ?? undefined;

        const where: any = {};

        if (companyId) where.companyId = companyId;

        if (filter) {
            where.OR = [
                { name: { contains: filter, mode: "insensitive" } },
                { email: { contains: filter, mode: "insensitive" } },
                { phone: { contains: filter, mode: "insensitive" } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                ...(skip !== undefined ? { skip } : {}),
                ...(take !== undefined ? { take } : {}),
                orderBy: sort_by ? { [sort_by]: sort_dir ?? "asc" } : undefined,
            }),
            this.prisma.user.count({
                where,
            }),
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

    async findById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        return user;
    }

    async findByEmail(email: string, companyId?: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email: email.toLocaleLowerCase(),
                ...(companyId ? { companyId } : {}),
            },
        });
    }

    async existsByEmail(email: string, companyId?: string): Promise<boolean> {
        const exist = await this.findByEmail(email, companyId);

        return exist ? true : false;
    }

    async insert(model: UserCreateData): Promise<User> {
        return this.prisma.user.create({ data: model });
    }

    async update(model: Partial<User>): Promise<User> {
        const { id, createdAt, updatedAt, ...updateData } = model;
        return await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { active: false },
        });
    }
}
