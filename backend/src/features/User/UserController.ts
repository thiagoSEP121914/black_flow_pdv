import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { UserService } from "./UserService.js";

export class UserController extends Controller {
    private service: UserService;

    constructor(service: UserService) {
        super();
        this.service = service;
    }

    handle(): Router {
        this.route.get("/me", async (req: Request, res: Response) => {
            const userId = req.user?.id;
            const userCompanyId = req.user?.companyId;

            if (!userId || !userCompanyId) {
                return res.status(401).json({
                    error: "Usuário não autenticado",
                    code: "NOT_AUTHENTICATED",
                });
            }

            const user = await this.service.findById(userId);

            if (user.companyId !== userCompanyId) {
                return res.status(403).json({
                    error: "Acesso negado. Dados inconsistentes.",
                    code: "COMPANY_MISMATCH",
                });
            }

            const { password: _password, ...userWithoutPassword } = user;

            return res.json(userWithoutPassword);
        });

        return this.route;
    }
}
