import { Request, Response } from "express";
import { AuthService } from "./AuthService.js";
import { Controller } from "../../core/Controller.js";
import { SignupDTO, LoginDTO } from "./AuthService.js";
import { z } from "zod";

const signupSchema: z.ZodType<SignupDTO> = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    companyName: z.string().min(2),
});

const loginSchema: z.ZodType<LoginDTO> = z.object({
    email: z.string(),
    password: z.string().min(6),
});

export class AuthController extends Controller {
    private authService: AuthService;

    constructor(authService: AuthService) {
        super();
        this.authService = authService;
    }

    /**
     * @swagger
     * tags:
     *   name: Auth
     *   description: Autenticação e Registro
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     SignupDto:
     *       type: object
     *       required:
     *         - email
     *         - password
     *         - name
     *         - companyName
     *       properties:
     *         email:
     *           type: string
     *           format: email
     *           example: "admin@empresa.com"
     *         password:
     *           type: string
     *           format: password
     *           example: "senha123"
     *         name:
     *           type: string
     *           example: "Admin User"
     *         companyName:
     *           type: string
     *           example: "Nova Empresa S.A."
     *     LoginDto:
     *       type: object
     *       required:
     *         - email
     *         - password
     *       properties:
     *         email:
     *           type: string
     *           format: email
     *           example: "admin@empresa.com"
     *         password:
     *           type: string
     *           format: password
     *           example: "senha123"
     *     RefreshTokenDto:
     *       type: object
     *       required:
     *         - refreshToken
     *       properties:
     *         refreshToken:
     *           type: string
     *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *     AuthResponse:
     *       type: object
     *       properties:
     *         accessToken:
     *           type: string
     *         refreshToken:
     *           type: string
     *         user:
     *           type: object
     *           properties:
     *             id:
     *               type: string
     *             name:
     *               type: string
     *             email:
     *               type: string
     */

    handle() {
        /**
         * @swagger
         * /unauth/signup:
         *   post:
         *     summary: Cria conta de proprietário e empresa
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SignupDto'
         *     responses:
         *       201:
         *         description: Conta criada com sucesso
         */
        this.route.post("/signup", async (req: Request, res: Response) => {
            const data = signupSchema.parse(req.body);
            const result = await this.authService.signupOwner(data);

            return res.status(201).json({
                message: "Owner account created",
                company: result.company,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    userType: result.user.userType,
                },
            });
        });

        /**
         * @swagger
         * /unauth/login:
         *   post:
         *     summary: Autentica usuário e retorna tokens
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginDto'
         *     responses:
         *       200:
         *         description: Login realizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AuthResponse'
         */
        this.route.post("/login", async (req: Request, res: Response) => {
            const data = loginSchema.parse(req.body);
            const userAgent = req.headers["user-agent"];
            const ipAddress = req.ip;

            const result = await this.authService.loginUser(data, userAgent, ipAddress);

            return res.json(result);
        });

        /**
         * @swagger
         * /unauth/refresh:
         *   post:
         *     summary: Atualiza o Access Token usando Refresh Token
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RefreshTokenDto'
         *     responses:
         *       200:
         *         description: Novos tokens gerados
         */
        this.route.post("/refresh", async (req: Request, res: Response) => {
            const { refreshToken } = req.body;

            if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

            const result = await this.authService.refreshToken(refreshToken);

            return res.json(result);
        });

        /**
         * @swagger
         * /unauth/logout:
         *   post:
         *     summary: Realiza logout invalidando o refresh token
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RefreshTokenDto'
         *     responses:
         *       200:
         *         description: Logout realizado
         */
        this.route.post("/logout", async (req: Request, res: Response) => {
            const { refreshToken } = req.body;

            if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

            const result = await this.authService.logout(refreshToken);

            return res.json(result);
        });

        return this.route;
    }
}
