import { IRepository } from "../../../core/interface/IRepository.js";
import { User } from "@prisma/client";

export interface IUserRepository extends IRepository<User, Partial<User>> {
    findByEmail(email: string, companyId?: string): Promise<User | null>;
    existsByEmail(email: string, companyId?: string): Promise<boolean>;
}
