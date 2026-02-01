import { IRepository } from "../../../core/interface/IRepository.js";
import { Session } from "@prisma/client";

export interface ISessionRepository extends IRepository<Session, Partial<Session>> {
    findByToken(token: string): Promise<Session>;

    deleteByToken(token: string): Promise<void>;
}
