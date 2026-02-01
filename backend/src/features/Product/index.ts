import { prisma } from "../../core/prisma.js";
import { ProductRepositoryImpl } from "./repositories/ProductRepositorie.js";
import { ProductService } from "./ProductService.js";
import { ProductController } from "./ProductController.js";

const productRepositoryImpl = new ProductRepositoryImpl(prisma);
const productService = new ProductService(productRepositoryImpl);
const productController = new ProductController(productService);

export { productRepositoryImpl, productService, productController };
