// authToken.ts
import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
    id: string; // user id
    email: string;
    userType: "owner" | "operator";
    companyId: string;
    storeId?: string;
    role?: string;
}

export interface RefreshTokenPayload {
    id: number;
}

function getAccessSecret(): string {
    const key = process.env.JWT_ACCESS_SECRET;
    if (!key) throw new Error("JWT_ACCESS_SECRET não definido no env");
    return key;
}

function getRefreshSecret(): string {
    const key = process.env.JWT_REFRESH_SECRET;
    if (!key) throw new Error("JWT_REFRESH_SECRET não definido no env");
    return key;
}

// ----- GERAÇÃO DE TOKENS -----
export function generateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, getAccessSecret(), {
        expiresIn: process.env.ACCESS_EXPIRES_IN || "15m",
    } as SignOptions);
}

export function generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, getRefreshSecret(), {
        expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
    } as SignOptions);
}

// ----- MIDDLEWARE DE AUTENTICAÇÃO -----
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
        const user = jwt.verify(token, getAccessSecret()) as AccessTokenPayload;
        (req as any).user = user; // você pode tipar melhor se quiser
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido ou expirado" });
    }
}
