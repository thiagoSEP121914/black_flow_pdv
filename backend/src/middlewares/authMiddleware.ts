import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { UserContext } from "../core/types/UserContext.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserContext;
        }
    }
}

export function authMidlleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.substring(7);

    try {
        const payload = verifyAccessToken(token);
        req.user = {
            userId: payload.id,
            companyId: payload.companyId,
            role: payload.role || "user", // Default role
            permissions: [] // TODO: Carregar permissões reais no futuro
        };

        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido ou expirado", error: error });
    }
}
