import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt.js";

export function authMidlleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.substring(7);

    try {
        const user = verifyAccessToken(token); // Usa a função que você criou
        req.user = user; // Agora tipado!
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido ou expirado" });
    }
}
