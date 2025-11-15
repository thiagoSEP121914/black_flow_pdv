import jwt, { SignOptions } from "jsonwebtoken";

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

export function generateAccessToken(payload: object) {
    // Passando string literal direto
    return jwt.sign(payload, getAccessSecret(), { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" } as SignOptions);
}

export function generateRefreshToken(payload: object) {
    return jwt.sign(payload, getRefreshSecret(), { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" } as SignOptions);
}
