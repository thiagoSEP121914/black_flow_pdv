import { Session } from "@prisma/client";
import { ISessionRepository } from "./repositories/ISessionRepository.js";

export interface CreateSessionDto {
    token: string;
    userId: string;
    companyId: string;
    userAgent?: string | null;
    ipAddress?: string | null;
}

export class SessionService {
    private sessionRepository: ISessionRepository;

    constructor(sessionRepository: ISessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    async create(data: CreateSessionDto): Promise<Session> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de validade

        return this.sessionRepository.insert({
            token: data.token,
            userId: data.userId,
            companyId: data.companyId,
            expiresAt,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
        });
    }

    async findByToken(token: string): Promise<Session> {
        return this.sessionRepository.findByToken(token);
    }

    async deleteByToken(token: string): Promise<void> {
        return this.sessionRepository.deleteByToken(token);
    }
}
