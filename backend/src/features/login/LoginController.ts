import { Router, Request, Response } from "express";
import prisma from "../../core/prisma.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../middlewares/authToken.js";
import { Controller } from "../../core/Controller.js";

interface ILoginDTO {
    email: string;
    password: string;
}

interface IloginResponseDTO {
    accessToken: string;
    refreshToken: string;
    createdAt: string;
    expireIn: string; // Data de expiração da sessão (Refresh Token)
}

export class LoginController extends Controller {
    handle() {
        this.route.post("/login", async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body as ILoginDTO;

                if (!email || !password) {
                    return res.status(400).json({ error: "Email and password are required" });
                }
                const user = await prisma.user.findFirst({
                    where: { email, active: true },
                    include: {
                        company: true,
                        store: { include: { company: true } },
                    },
                });

                if (!user) return res.status(401).json({ error: "Invalid credentials" });
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

                const accessToken = generateAccessToken({
                    id: user.id,
                    email: user.email,
                    userType: user.userType as "owner" | "operator",
                    companyId: user.companyId || "",
                    storeId: user.storeId || undefined,
                    role: user.role || undefined,
                });

                const refreshToken = generateRefreshToken({ id: user.id });
                const createdAt = new Date();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                await prisma.session.create({
                    data: {
                        token: refreshToken,
                        userId: user.id,
                        expiresAt: expiresAt,
                        userAgent: req.headers["user-agent"],
                        ipAddress: req.ip,
                    },
                });

                return res.json({
                    accessToken,
                    refreshToken,
                    createdAt: createdAt.toISOString(),
                    expireIn: expiresAt.toISOString(), // Renomeado para 'expireIn'
                });
            } catch (err: any) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }
        });

        return this.route;
    }
}

const loginController = new LoginController();
export default loginController.handle();
