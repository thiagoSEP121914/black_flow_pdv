import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { CategoryService, CreateCategoryDTO, UpdateCategoryDTO } from "./CategoryService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createCategorySchema: z.ZodType<CreateCategoryDTO> = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    storeId: z.string(),
    active: z.boolean().optional(),
});

const updateCategorySchema: z.ZodType<UpdateCategoryDTO> = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    active: z.boolean().optional(),
});

export class CategoryController extends Controller {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        super();
        this.categoryService = categoryService;
    }





    handle(): Router {
        this.route.get("/", async (req: Request, res: Response) => {
            const params: SearchInput = {
                page: req.query.page ? Number(req.query.page) : undefined,
                per_page: req.query.per_page ? Number(req.query.per_page) : undefined,
                sort_by: req.query.sort_by as string,
                sort_dir: req.query.sort_dir as "asc" | "desc",
                filter: req.query.filter as string,
                companyId: req.user!.companyId
            };

            const result = await this.categoryService.findAll(params);

            return res.status(200).json(result);
        });
        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.categoryService.findById(userContext, id);

            return res.status(200).json(response);
        });
        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createCategorySchema.parse(req.body);
            const category = await this.categoryService.save(userContext, input);
            res.status(201).json(category);
        });
        this.route.patch("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const input = updateCategorySchema.parse(req.body);
            const category = await this.categoryService.update(userContext, id, input);
            res.status(200).json(category);
        });
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            await this.categoryService.delete(userContext, id);
            res.status(204).send();
        });

        return this.route;
    }
}
