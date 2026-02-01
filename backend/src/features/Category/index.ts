import { prisma } from "../../core/prisma.js";
import { CategoryRepositoryImpl } from "./repositories/CategoryRepositoryImpl.js";
import { CategoryService } from "./CategoryService.js";
import { CategoryController } from "./CategoryController.js";

const categoryRepositoryImpl = new CategoryRepositoryImpl(prisma);
const categoryService = new CategoryService(categoryRepositoryImpl);
const categoryController = new CategoryController(categoryService);

export { categoryRepositoryImpl, categoryService, categoryController };
