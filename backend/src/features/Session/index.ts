import { prisma } from "../../core/prisma.js";
import { SessionRepositoryImpl } from "./repositories/SessionRepositoryImpl.js";


const sessionRepositoryImpl = new SessionRepositoryImpl(prisma);

export { sessionRepositoryImpl };