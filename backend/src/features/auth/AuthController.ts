import { Router, Request, Response } from "express";
import { AuthService } from "./AuthService.js"; // A classe que criamos
import { Controller } from "../../core/Controller.js";

interface SignupDTO {
    email: string;
    password: string;
    name: string;
    companyName: string;
}

interface LoginDTO {
    email: string;
    password: string;
}

export class AuthController extends Controller {
    private authService = new AuthService();

    handle() {
        // ------------------- SIGNUP OWNER -------------------
        this.route.post("/signup", async (req: Request, res: Response) => {
            try {
                const data = req.body as SignupDTO;
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
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message || "Internal server error" });
            }
        });

        // ------------------- LOGIN -------------------
        this.route.post("/login", async (req: Request, res: Response) => {
            try {
                const data = req.body as LoginDTO;
                const result = await this.authService.loginUser(data, req);
                return res.json(result);
            } catch (err: any) {
                console.error(err);
                return res.status(401).json({ error: err.message || "Invalid credentials" });
            }
        });

        // ------------------- REFRESH TOKEN -------------------
        this.route.post("/refresh", async (req: Request, res: Response) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

                const result = await this.authService.refreshToken(refreshToken);
                return res.json(result);
            } catch (err: any) {
                console.error(err);
                return res.status(401).json({ error: err.message || "Invalid or expired refresh token" });
            }
        });

        // ------------------- LOGOUT -------------------
        this.route.post("/logout", async (req: Request, res: Response) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

                const result = await this.authService.logout(refreshToken);
                return res.json(result);
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: err.message || "Internal server error" });
            }
        });

        return this.route;
    }
}

const authController = new AuthController();
export default authController.handle();
