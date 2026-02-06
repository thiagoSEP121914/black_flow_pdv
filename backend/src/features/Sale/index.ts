import { prisma } from "../../core/prisma.js";
import { SaleRepositoryImpl } from "./repositories/SaleRepository.js";
import { SaleService } from "./SaleService.js";
import { SaleController } from "./SaleController.js";
import { storeService } from "../Store/index.js";
import { productService } from "../Product/index.js";

const saleRepositoryImpl = new SaleRepositoryImpl(prisma);
const saleService = new SaleService(saleRepositoryImpl, storeService, productService);
const saleController = new SaleController(saleService);

export { saleRepositoryImpl, saleService, saleController };
