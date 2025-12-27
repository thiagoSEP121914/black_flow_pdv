// src/features/user/UserRepository.ts
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { User } from "./domain/User.js";
import { AppError } from "../../errors/AppError.js";
import { Repository, SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    userType: "owner" | "operator";
    role?: "cashier" | "manager" | "supervisor";
    phone?: string;
    storeId?: string;
    companyId: string;
};

export type SearchUserInput = SearchInput & {
    companyId: string;
    storeId?: string;
    userType?: string;
    active?: boolean;
};

export class UserRepository implements Repository<User, CreateUserInput> {
    constructor(private prisma: PrismaClient) {}

    async findAll(params: SearchUserInput): Promise<SearchOutPut<User>> {
        const {
            companyId,
            storeId,
            userType,
            active,
            page = 1,
            per_page = 10,
            sort_by = "createdAt",
            sort_dir = "desc",
            filter = null,
        } = params;

        const skip = (page - 1) * per_page;

        const where: any = {
            companyId,
        };

        if (storeId) {
            where.storeId = storeId;
        }

        if (userType) {
            where.userType = userType;
        }

        if (active !== undefined) {
            where.active = active;
        }

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
                skip,
                take: per_page,
                orderBy: { [sort_by]: sort_dir },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            items: items.map((item) => User.fromPrisma(item)),
            per_page,
            total,
            current_page: page,
            sort_by,
            sort_dir,
            filter,
        };
    }

    async findById(id: string, companyId?: string): Promise<User> {
        const where: any = { id };

        if (companyId) {
            where.companyId = companyId;
        }

        const user = await this.prisma.user.findFirst({ where });

        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return User.fromPrisma(user);
    }

    create(data: CreateUserInput): User {
        return User.create(
            data.name,
            data.email,
            data.password,
            data.userType,
            data.companyId,
            data.phone,
            data.role,
            data.storeId,
        );
    }

    async insert(model: User): Promise<User> {
        const data = model.toPrisma();

        const created = await this.prisma.user.create({
            data,
        });

        return User.fromPrisma(created);
    }

    async update(model: User): Promise<User> {
        const data = model.toPrisma();

        const updated = await this.prisma.user.update({
            where: { id: model.id },
            data,
        });

        return User.fromPrisma(updated);
    }

    async delete(id: string, companyId?: string): Promise<void> {
        const where: any = { id };

        if (companyId) {
            where.companyId = companyId;
        }

        await this.prisma.user.updateMany({
            where,
            data: {
                active: false,
            },
        });
    }

   
    async save(user: User): Promise<User> {
        const exists = await this.prisma.user.findUnique({
            where: { id: user.id },
        });

        if (exists) {
            return await this.update(user);
        } else {
            return await this.insert(user);
        }
    }

    async findByEmail(email: string, companyId: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
                companyId,
            },
        });

        return user ? User.fromPrisma(user) : null;
    }

    async existsByEmail(email: string, companyId: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: {
                email: email.toLowerCase(),
                companyId,
            },
        });
        return count > 0;
    }

    async hardDelete(id: string, companyId: string): Promise<void> {
        await this.prisma.user.deleteMany({
            where: {
                id,
                companyId,
            },
        });
    }

    async countByCompany(companyId: string): Promise<number> {
        return await this.prisma.user.count({
            where: { companyId },
        });
    }

    async findByStore(storeId: string, companyId: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                storeId,
                companyId,
                active: true,
            },
        });

        return users.map((user) => User.fromPrisma(user));
    }
}
