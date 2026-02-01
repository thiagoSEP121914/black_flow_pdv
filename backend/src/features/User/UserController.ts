import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { UserService } from "./UserService.js";

export class UserController extends Controller {
    private service: UserService;

    constructor(service: UserService) {
        super();
        this.service = service;
    }

    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Gerenciamento de Usuários
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *         name:
     *           type: string
     *         email:
     *           type: string
     *           format: email
     *         userType:
     *           type: string
     *           enum: [OWNER, ADMIN, CAIXA]
     *         companyId:
     *           type: string
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     */

    handle(): Router {
        /**
         * @swagger
         * /auth/users/me:
         *   get:
         *     summary: Retorna dados do usuário autenticado
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Dados do usuário
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         */
        this.route.get("/me", async (req: Request, res: Response) => {
            const userId = req.user?.userId;
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
