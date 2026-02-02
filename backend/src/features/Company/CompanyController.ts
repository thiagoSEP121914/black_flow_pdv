import { Router } from "express";
import { Controller } from "../../core/Controller.js";
import { CompanyService, CreateCompanyDto, UpdateCompanyDto } from "./CompanyService.js";
import { Request, Response } from "express";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";


const createCompanySchema: z.ZodType<CreateCompanyDto> = z.object({
    name: z.string().min(2),
    cnpj: z.string().min(14).optional(),
    phone: z.string().min(11).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
});

const updateCompanySchema: z.ZodType<UpdateCompanyDto> = z.object({
    name: z.string().min(2).optional(),
    cnpj: z.string().min(14).optional(),
    phone: z.string().min(11).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
});

export class CompanyController extends Controller {
    private companyService: CompanyService;

    constructor(companyService: CompanyService) {
        super();
        this.companyService = companyService;
    }




    handle(): Router {
        this.route.get("/", async (req: Request, res: Response) => {
            const userContext = req.user!; // Middleware garante que existe
            const params: SearchInput = {
                page: req.query.page ? Number(req.query.page) : undefined,
                per_page: req.query.per_page ? Number(req.query.per_page) : undefined,
                sort_by: req.query.sort_by as string,
                sort_dir: req.query.sort_dir as "asc" | "desc",
                filter: req.query.filter as string,
                companyId: userContext.companyId // Passando explicito, mas o Service vai sobrescrever/garantir
            };

            const result = await this.companyService.findAll(userContext, params);

            return res.status(200).json(result);
        });
        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.companyService.findById(userContext, id);

            return res.status(200).json(response);
        });
        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createCompanySchema.parse(req.body);
            const company = await this.companyService.save(userContext, input);
            res.status(201).json(company);
        });
        this.route.patch("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const input = updateCompanySchema.parse(req.body);
            const company = await this.companyService.update(userContext, id, input);
            res.status(200).json(company);
        });
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            await this.companyService.delete(userContext, id);
            res.status(204).send();
        });

        return this.route;
    }
}
