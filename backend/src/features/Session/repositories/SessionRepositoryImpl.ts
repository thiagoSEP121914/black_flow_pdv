import { ISessionRepository } from "./ISessionRepository.js";
import { Session } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";
import { PrismaClient } from "@prisma/client";

export class SessionRepositoryImpl implements ISessionRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Session>> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Session> {
        throw new Error("Method not implemented.");
    }

    async findByToken(token: string): Promise<Session> {
        const session = await this.prisma.session.findUnique({
            where: { token },
        });

        if (!session) throw new Error("Session not found");

        return session;
    }

    async insert(model: Partial<Session>): Promise<Session> {
        return this.prisma.session.create({
            data: model as any,
        });
    }

    async update(model: Session): Promise<Session> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        await this.prisma.session.delete({
            where: { id },
        });
    }

    async deleteByToken(token: string): Promise<void> {
        await this.prisma.session.delete({
            where: { token },
        });
    }
}