import { IUserRepository } from "./repositories/IUserRepository.js";
import { NotFoundError } from "../../errors/NotFounError.js";
import { ConflictError } from "../../errors/ConflictError.js";
import { User } from "@prisma/client";
import { hashPassword } from "../../utils/bcrypt.js";
import { SearchOutPut } from "../../core/interface/IRepository.js";

export type CreateUserDTO = {
    email: string;
    password: string;
    name: string;
    phone?: string | null;
    active: boolean;
    avatar?: string | null;
    userType: "owner" | "operator";
    role?: string | null;
    companyId: string;
    storeId?: string | null;
};

export type UpdateUserDTO = {
    name?: string;
    phone?: string;
    role?: string;
    password?: string;
};

export class UserService {
    private repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async findAll(params: {
        companyId: string;
        storeId?: string;
        page?: number;
        per_page?: number;
    }): Promise<SearchOutPut<User>> {
        return this.repository.findAll(params);
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findById(id);

        if (!user) throw new NotFoundError("Usuário não encontrado");

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(`User with email ${email} not found`);
        }

        return user;
    }

    async existsByEmail(email: string, _companyId?: string): Promise<boolean> {
        return this.repository.existsByEmail(email);
    }

    async save(data: CreateUserDTO): Promise<Partial<User>> {
        const emailExists = await this.repository.existsByEmail(data.email, data.companyId);

        if (emailExists) throw new ConflictError("Email já está em uso");

        const hashedPassword = await hashPassword(data.password);

        const userToInsert = {
            email: data.email.toLowerCase(),
            password: hashedPassword,
            name: data.name,
            phone: data.phone ?? null,
            avatar: data.avatar ?? null,
            userType: data.userType,
            role: data.role ?? null,
            companyId: data.companyId,
            storeId: data.storeId ?? null,
            active: true,
        };

        return this.repository.insert(userToInsert);
    }

    async update(id: string, data: UpdateUserDTO): Promise<Partial<User>> {
        const user = await this.repository.findById(id);

        if (!user) throw new NotFoundError("Usuário não encontrado");

        const updatedData: any = { ...data };

        if (data.password) {
            updatedData.password = await hashPassword(data.password);
        }

        return this.repository.update({ ...user, ...updatedData });
    }

    async delete(id: string): Promise<void> {
        const user = await this.repository.findById(id);

        if (!user) throw new NotFoundError("Usuário não encontrado");

        await this.repository.delete(id);
    }
}
