import { prisma } from "../../core/prisma.js";
import { StoreController } from "./StoreController.js";
import { StoreRepositoryImpl } from "./Repositorie/StoreRepositoryImpl.js";
import { StoreService } from "./StoreService.js";

const storeRepository = new StoreRepositoryImpl(prisma);
const storeService = new StoreService(storeRepository);
const storeController = new StoreController(storeService);

export { storeController, storeService, storeRepository };
