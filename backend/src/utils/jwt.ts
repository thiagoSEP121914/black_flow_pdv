import jwt, { SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
    id: string;
    email: string;
    userType: "owner" | "operator";
    companyId: string;
    storeId?: string;
    role?: string;
}

export interface RefreshTokenPayload {
    id: string;
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

// ===== GERAR TOKENS =====
export function generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, getAccessSecret(), {
        expiresIn: process.env.ACCESS_EXPIRES_IN || "15m",
    } as SignOptions);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, getRefreshSecret(), {
        expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
    } as SignOptions);
}

// ===== VERIFICAR TOKENS ===== (AQUI QUE FALTAVA!)
export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, getAccessSecret()) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, getRefreshSecret()) as RefreshTokenPayload;
}
