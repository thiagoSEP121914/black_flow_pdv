import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { SaleService, CreateSaleDTO } from "./SaleService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createSaleItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
});

const createSaleSchema: z.ZodType<CreateSaleDTO> = z.object({
    storeId: z.string().min(1),
    customerId: z.string().optional(),
    discount: z.number().int().min(0).optional(),
    paymentMethod: z.enum(["CASH", "CREDIT", "DEBIT", "PIX"]),
    items: z.array(createSaleItemSchema).min(1, "Sale must have at least one item"),
});

export class SaleController extends Controller {
    private saleService: SaleService;

    constructor(saleService: SaleService) {
        super();
        this.saleService = saleService;
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

            const result = await this.saleService.findAll(params);

            return res.status(200).json(result);
        });

        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.saleService.findById(userContext, id);

            return res.status(200).json(response);
        });

        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createSaleSchema.parse(req.body);
            const sale = await this.saleService.createSale(userContext, input);
            res.status(201).json(sale);
        });

        this.route.post("/:id/cancel", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const sale = await this.saleService.cancelSale(userContext, id);
            res.status(200).json(sale);
        });

        this.route.post("/:id/refund", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const sale = await this.saleService.refundSale(userContext, id);
            res.status(200).json(sale);
        });

        return this.route;
    }
}
