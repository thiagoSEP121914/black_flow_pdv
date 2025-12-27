import { IRepository } from "../../../core/interface/IRepository.js";

export interface IUserRepository<User, CreateUserObj> extends IRepository<User, CreateUserObj> {
    findByEmail(email: string): Promise<User | null>;
}
