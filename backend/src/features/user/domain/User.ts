// src/domain/entities/User.ts
import { User as PrismaUser } from "@prisma/client";

export type UserType = "owner" | "operator";
export type UserRole = "cashier" | "manager" | "supervisor";

export class User {
    private constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        private password: string,
        public phone: string | null,
        public active: boolean,
        public avatar: string | null,
        public userType: UserType,
        public role: UserRole | null,
        public companyId: string,
        public storeId: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date,
    ) {}

    static create(
        name: string,
        email: string,
        password: string,
        userType: UserType,
        companyId: string,
        phone?: string,
        role?: UserRole,
        storeId?: string,
    ): User {
        // Validações de domínio
        if (!name || name.trim().length < 3) {
            throw new Error("Nome deve ter no mínimo 3 caracteres");
        }

        if (!User.isValidEmail(email)) {
            throw new Error("Email inválido");
        }

        if (!password || password.length < 6) {
            throw new Error("Senha deve ter no mínimo 3 caracteres");
        }

        if (userType === "operator" && !role) {
            throw new Error("Operador deve ter uma role definida");
        }

        if (role && !storeId) {
            throw new Error("Usuário com role deve estar associado a uma loja");
        }

        return new User(
            crypto.randomUUID(),
            name.trim(),
            email.toLowerCase(),
            password,
            phone || null,
            true, // active por padrão
            null, // sem avatar inicial
            userType,
            role || null,
            companyId,
            storeId || null,
            new Date(),
            new Date(),
        );
    }

    static fromPrisma(data: PrismaUser): User {
        return new User(
            data.id,
            data.name,
            data.email,
            data.password,
            data.phone,
            data.active,
            data.avatar,
            data.userType as UserType,
            data.role as UserRole | null,
            data.companyId,
            data.storeId,
            data.createdAt,
            data.updatedAt,
        );
    }

    changeName(newName: string): void {
        if (!newName || newName.trim().length < 3) {
            throw new Error("Nome deve ter no mínimo 3 caracteres");
        }
        this.name = newName.trim();
        this.touch();
    }

    changeEmail(newEmail: string): void {
        if (!User.isValidEmail(newEmail)) {
            throw new Error("Email inválido");
        }
        this.email = newEmail.toLowerCase();
        this.touch();
    }

    changePhone(newPhone: string): void {
        if (newPhone && !User.isValidPhone(newPhone)) {
            throw new Error("Telefone inválido");
        }
        this.phone = newPhone;
        this.touch();
    }

    assignToStore(storeId: string): void {
        if (!storeId) {
            throw new Error("Store ID é obrigatório");
        }
        this.storeId = storeId;
        this.touch();
    }

    changeRole(newRole: UserRole): void {
        if (this.userType === "owner") {
            throw new Error("Owner não pode ter role");
        }
        if (!this.storeId) {
            throw new Error("Usuário deve estar em uma loja para ter role");
        }
        this.role = newRole;
        this.touch();
    }

    activate(): void {
        this.active = true;
        this.touch();
    }

    deactivate(): void {
        this.active = false;
        this.touch();
    }

    updateAvatar(avatarUrl: string): void {
        this.avatar = avatarUrl;
        this.touch();
    }

    canAccessStore(storeId: string): boolean {
        if (this.userType === "owner") {
            return true; // Owner acessa todas lojas da empresa
        }
        return this.storeId === storeId;
    }

    hasPermission(requiredRole: UserRole): boolean {
        if (this.userType === "owner") {
            return true;
        }

        const roleHierarchy: Record<UserRole, number> = {
            supervisor: 3,
            manager: 2,
            cashier: 1,
        };

        if (!this.role) return false;

        return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static isValidPhone(phone: string): boolean {
        const cleaned = phone.replace(/\D/g, "");
        return cleaned.length >= 10 && cleaned.length <= 11;
    }

    toPrisma(): Omit<PrismaUser, "sessions" | "sales" | "cashiers"> {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
            active: this.active,
            avatar: this.avatar,
            userType: this.userType,
            role: this.role,
            companyId: this.companyId,
            storeId: this.storeId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            active: this.active,
            avatar: this.avatar,
            userType: this.userType,
            role: this.role,
            companyId: this.companyId,
            storeId: this.storeId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    private touch(): void {
        this.updatedAt = new Date();
    }

    getPasswordHash(): string {
        return this.password;
    }
}
