import { prisma } from "../../core/prisma.js";
import { StoreController } from "./StoreController.js";
import { StoreRepositoryImpl } from "./repositories/StoreRepositoryImpl.js";
import { StoreService } from "./StoreService.js";

const storeRepositoryImpl = new StoreRepositoryImpl(prisma);
const storeService = new StoreService(storeRepositoryImpl);
const storeController = new StoreController(storeService);

export { storeController, storeService, storeRepositoryImpl };
