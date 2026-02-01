import { Category } from "@prisma/client";
import { IRepository } from "../../../core/interface/IRepository.js";

export interface ICategoryRepository extends IRepository<Category, Partial<Category>> { }
