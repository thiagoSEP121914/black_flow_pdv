import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import companyService, { UpdateCompanyDTO } from "./CompanyService.js";
import { authenticateToken } from "../../middlewares/authToken.js";

declare global {
    namespace Express {
        interface Request {
            user?: { companyId?: string; [key: string]: any };
        }
    }
}

export class CompanyController extends Controller {
    handle(): Router {
        this.route.post("/", authenticateToken, async (req: Request, res: Response) => {
            try {
                // Apenas owner pode criar (no MVP, geralmente já criado na signup)
                const data = req.body;
                const company = await companyService.createCompany(data);
                return res.status(201).json(company);
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        });

        this.route.get("/me", authenticateToken, async (req: Request, res: Response) => {
            try {
                const companyId = req.user?.companyId; // middleware auth
                if (!companyId) return res.status(401).json({ error: "Unauthorized" });
                const company = await companyService.getCompanyById(companyId);
                if (!company) return res.status(404).json({ error: "Company not found" });
                return res.json(company);
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        });

        this.route.put("/me", authenticateToken, async (req: Request, res: Response) => {
            try {
                const companyId = req.user?.companyId;
                if (!companyId) return res.status(401).json({ error: "Unauthorized" });
                const data = req.body as UpdateCompanyDTO;
                const company = await companyService.updateCompany(companyId, data);
                return res.json(company);
            } catch (err: any) {
                console.error(err);
                return res.status(400).json({ error: err.message });
            }
        });

        // ------------------ DELETE (SOFT) COMPANY ------------------
        this.route.delete("/me", authenticateToken, async (req: Request, res: Response) => {
            try {
                const companyId = req.user?.companyId;
                if (!companyId) return res.status(401).json({ error: "Unauthorized" });
                const company = await companyService.deleteCompany(companyId);
                return res.json({ message: "Company deactivated", company });
            } catch (err: any) {
                console.error(err);
                return res.status(400).json({ error: err.message });
            }
        });

        // ------------------ STATS ------------------
        this.route.get("/me/stats", authenticateToken, async (req: Request, res: Response) => {
            try {
                const companyId = req.user?.companyId;
                if (!companyId) return res.status(401).json({ error: "Unauthorized" });
                const stats = await companyService.getCompanyStats(companyId);
                return res.json(stats);
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        });

        // ------------------ SEARCH ------------------
        this.route.get("/search", authenticateToken, async (req: Request, res: Response) => {
            try {
                const { q } = req.query;
                if (!q || typeof q !== "string") return res.status(400).json({ error: "Query required" });
                const companies = await companyService.searchCompanies(q);
                return res.json(companies);
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
        });

        return this.route;
    }
}

export const companyController = new CompanyController().handle();
