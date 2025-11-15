import { Router, Request, Response } from "express";
import prisma from "../../core/prisma.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../middlewares/authToken.js";
import { Controller } from "../../core/Controller.js";

interface ILoginDTO {
    email: string;
    password: string;
}

export class LoginController extends Controller {
    handle() {
        this.route.post("/", async (req: Request, res: Response) => {
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

                const { password: _, ...userData } = user;

                // Gera token com payload tipado
                const accessToken = generateAccessToken({
                    id: user.id,
                    email: user.email,
                    userType: user.userType as "owner" | "operator",
                    companyId: user.companyId || "", // obrigatório
                    storeId: user.storeId || undefined,
                    role: user.role || undefined,
                });

                return res.json({ accessToken, user: userData });
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
