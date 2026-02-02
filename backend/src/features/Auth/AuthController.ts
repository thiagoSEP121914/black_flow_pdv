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

    handle() {
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

        this.route.post("/login", async (req: Request, res: Response) => {
            const data = loginSchema.parse(req.body);
            const userAgent = req.headers["user-agent"];
            const ipAddress = req.ip;

            const result = await this.authService.loginUser(data, userAgent, ipAddress);

            return res.json(result);
        });

        this.route.post("/refresh", async (req: Request, res: Response) => {
            const { refreshToken } = req.body;

            if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

            const result = await this.authService.refreshToken(refreshToken);

            return res.json(result);
        });

        this.route.post("/logout", async (req: Request, res: Response) => {
            const { refreshToken } = req.body;

            if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

            const result = await this.authService.logout(refreshToken);

            return res.json(result);
        });

        return this.route;
    }
}
