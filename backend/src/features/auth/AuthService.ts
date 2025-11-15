import prisma from "../../core/prisma.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../middlewares/authToken.js";
import { Request } from "express";

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

interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    expireIn: string;
    createdAt: string;
}

export class AuthService {
    // ------------------- SIGNUP -------------------
    async signupOwner(data: SignupDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const company = await prisma.company.create({
            data: {
                name: data.companyName,
                status: "active",
            },
        });

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                userType: "owner",
                companyId: company.id,
                active: true,
            },
        });

        return { company, user };
    }

    // ------------------- LOGIN -------------------
    async loginUser(data: LoginDTO, req: Request): Promise<LoginResponseDTO> {
        const user = await prisma.user.findFirst({
            where: { email: data.email, active: true },
        });

        if (!user) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        // Gera tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            userType: user.userType as "owner" | "operator",
            companyId: user.companyId,
            storeId: user.storeId || undefined,
            role: user.role || undefined,
        });

        const refreshToken = generateRefreshToken({ id: user.id });

        const createdAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

        // Salva sessão
        await prisma.session.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
                userAgent: req.headers["user-agent"],
                ipAddress: req.ip,
            },
        });

        return {
            accessToken,
            refreshToken,
            createdAt: createdAt.toISOString(),
            expireIn: expiresAt.toISOString(),
        };
    }

    // ------------------- REFRESH TOKEN -------------------
    async refreshToken(token: string): Promise<{ accessToken: string }> {
        const session = await prisma.session.findUnique({
            where: { token },
        });

        if (!session || session.expiresAt < new Date()) {
            throw new Error("Invalid or expired session");
        }

        const user = await prisma.user.findUnique({ where: { id: session.userId } });
        if (!user) throw new Error("User not found");

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            userType: user.userType as "owner" | "operator",
            companyId: user.companyId,
            storeId: user.storeId || undefined,
            role: user.role || undefined,
        });

        return { accessToken };
    }

    // ------------------- LOGOUT -------------------
    async logout(token: string) {
        await prisma.session.deleteMany({ where: { token } });
        return { message: "Logged out successfully" };
    }
}
