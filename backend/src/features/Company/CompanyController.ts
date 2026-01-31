import { Router } from "express";
import { Controller } from "../../core/Controller.js";
import { CompanyService } from "./CompanyService.js";
import { Request, Response } from "express";
import { SearchInput } from "../../core/interface/IRepository.js";
import { CreateCompanyDto, UpdateCompanyDto } from "./dtos/index.js";

export class CompanyController extends Controller {
    private companyService: CompanyService;

    constructor(companyService: CompanyService) {
        super();
        this.companyService = companyService;
    }

    handle(): Router {
        this.route.get("/", async (req: Request, res: Response) => {
            const params: SearchInput = {
                page: req.query.page ? Number(req.query.page) : undefined,
                per_page: req.query.per_page ? Number(req.query.per_page) : undefined,
                sort_by: req.query.sort_by as string,
                sort_dir: req.query.sort_dir as "asc" | "desc",
                filter: req.query.filter as string,
            };

            const result = await this.companyService.findAll(params);

            return res.status(200).json(result);
        });

        this.route.get("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const response = await this.companyService.findById(id);

            return res.status(200).json(response);
        });

        this.route.post("/", async (req: Request, res: Response) => {
            const input: CreateCompanyDto = {
                name: req.body.name,
                email: req.body.email,
                cnpj: req.body.cnpj,
                phone: req.body.phone,
                address: req.body.address,
            };
            const company = await this.companyService.save(input);
            res.status(201).json(company);
        });

        this.route.patch("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const input: UpdateCompanyDto = req.body;
            const company = await this.companyService.update(id, input);
            res.status(200).json(company);
        });

        this.route.delete("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            await this.companyService.delete(id);
            res.status(204).send();
        });

        return this.route;
    }
}
