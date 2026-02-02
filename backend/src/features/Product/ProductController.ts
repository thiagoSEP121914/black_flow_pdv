import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { ProductService, CreateProductDTO, UpdateProductDTO } from "./ProductService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createProductSchema: z.ZodType<CreateProductDTO> = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    costPrice: z.number().optional(),
    salePrice: z.number(),
    barcode: z.string().optional(),
    categoryId: z.string().optional(),
    storeId: z.string(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
    active: z.boolean().optional(),
});

const updateProductSchema: z.ZodType<UpdateProductDTO> = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    costPrice: z.number().optional(),
    salePrice: z.number().optional(),
    barcode: z.string().optional(),
    categoryId: z.string().optional(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
});

export class ProductController extends Controller {
    private productService: ProductService;

    constructor(productService: ProductService) {
        super();
        this.productService = productService;
    }

    handle(): Router {
        this.route.get("/", async (req: Request, res: Response) => {
            const params: SearchInput = {
                page: req.query.page ? Number(req.query.page) : undefined,
                per_page: req.query.per_page ? Number(req.query.per_page) : undefined,
                sort_by: req.query.sort_by as string,
                sort_dir: req.query.sort_dir as "asc" | "desc",
                filter: req.query.filter as string,
                companyId: req.user!.companyId,
            };

            const result = await this.productService.findAll(params);

            return res.status(200).json(result);
        });
        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.productService.findById(userContext, id);

            return res.status(200).json(response);
        });
        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createProductSchema.parse(req.body);
            const product = await this.productService.save(userContext, input);
            res.status(201).json(product);
        });
        this.route.patch("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const input = updateProductSchema.parse(req.body);
            const product = await this.productService.update(userContext, id, input);
            res.status(200).json(product);
        });
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            await this.productService.delete(userContext, id);
            res.status(204).send();
        });

        return this.route;
    }
}
