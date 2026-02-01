import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { StoreService, CreateStoreDTO, UpdateStoreDTO } from "./StoreService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createStoreSchema: z.ZodType<CreateStoreDTO> = z.object({
    name: z.string().min(2),
    cnpj: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
});

const updateStoreSchema: z.ZodType<UpdateStoreDTO> = z.object({
    name: z.string().min(2).optional(),
    cnpj: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
});

export class StoreController extends Controller {
    private storeService: StoreService;

    constructor(storeService: StoreService) {
        super();
        this.storeService = storeService;
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

            const result = await this.storeService.getStores(params);
            return res.status(200).json(result);
        });

        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.storeService.getStoreById(userContext, id);
            return res.status(200).json(response);
        });

        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createStoreSchema.parse(req.body);
            const store = await this.storeService.createStore(userContext, input);
            res.status(201).json(store);
        });

        this.route.patch("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const input = updateStoreSchema.parse(req.body);
            const store = await this.storeService.updateStore(userContext, id, input);
            res.status(200).json(store);
        });

        this.route.delete("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            await this.storeService.deleteStore(userContext, id);
            res.status(204).send();
        });

        return this.route;
    }
}
