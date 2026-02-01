import { Category } from "@prisma/client";
import { IRepository } from "../../../core/interface/IRepository.js";

export type ICategoryRepository = IRepository<Category, Partial<Category>>;
