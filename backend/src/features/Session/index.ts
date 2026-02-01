import { prisma } from "../../core/prisma.js";
import { SessionRepositoryImpl } from "./repositories/SessionRepositoryImpl.js";
import { SessionService } from "./SessionService.js";

const sessionRepositoryImpl = new SessionRepositoryImpl(prisma);
const sessionService = new SessionService(sessionRepositoryImpl);

export { sessionRepositoryImpl, sessionService };
