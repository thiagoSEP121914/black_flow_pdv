import { prisma } from "../../core/prisma.js";
import { ProductRepositoryImpl } from "./repositories/ProductRepository.js";
import { ProductService } from "./ProductService.js";
import { ProductController } from "./ProductController.js";
import { storeService } from "../Store/index.js";

const productRepositoryImpl = new ProductRepositoryImpl(prisma);
const productService = new ProductService(productRepositoryImpl, storeService);
const productController = new ProductController(productService);

export { productRepositoryImpl, productService, productController };
