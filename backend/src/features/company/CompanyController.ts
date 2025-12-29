import { Router } from "express";
import { Controller } from "../../core/Controller.js";
import { CompanyService } from "./CompanyService.js";
import { Request, Response } from "express";

export class CompanyController extends Controller {
    private companyService: CompanyService;

    constructor(companyService: CompanyService) {
        super();
        this.companyService = companyService;
    }

    handle(): Router {
        this.route.get("/", (req: Request, res: Response) => {
            return res.status(200).json("OK");
        });

        return this.route;
    }
}
