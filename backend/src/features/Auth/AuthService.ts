import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { Request } from "express";
import { UserService } from "../User/UserService.js";
import { CompanyService } from "../Company/CompanyService.js";
import { UnauthorizedError } from "../../errors/UnauthorizedError.js";
import { NotFoundError } from "../../errors/NotFounError.js";
import { comparePasword } from "../../utils/bcrypt.js";
import { prisma } from "../../core/prisma.js";
import { PrismaClient } from "@prisma/client/extension";

type SignupDTO = {
    email: string;
    password: string;
    name: string;
    companyName: string;
};

type LoginDTO = {
    email: string;
    password: string;
};

/*
type LoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    expireIn: string;
    createdAt: string;
};
*/

export class AuthService {
    private userService: UserService;
    private companyService: CompanyService;
    prisma: PrismaClient;

    constructor(userService: UserService, companyService: CompanyService) {
        this.userService = userService;
        this.companyService = companyService;
        this.prisma = prisma;
    }

    async signupOwner(data: SignupDTO) {
        const company = await this.companyService.save({
            name: data.companyName,
            status: "active",
        });

        const user = await this.userService.save({
            email: data.email,
            password: data.password,
            name: data.name,
            userType: "owner",
            companyId: company.id,
            active: true,
        });

        return { company, user };
    }

    async loginUser(data: LoginDTO, req: Request) {
        const user = await this.userService.findByEmail(data.email);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!user.active) {
            throw new UnauthorizedError("User does not have authorization");
        }

        const isValid = await comparePasword(data.password, user.password);

        if (!isValid) throw new UnauthorizedError("Invalid credentials"); // 401

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            userType: user.userType as "owner" | "operator",
            companyId: user.companyId,
        });
        const refreshToken = generateRefreshToken({ id: user.id });
        await this.createSession(user.id, refreshToken, req);

        const createdAt = new Date().toISOString();

        return { accessToken, refreshToken, expireIn: "1h", createdAt };
    }
    async logout(refreshToken: string) {
        await prisma.session.deleteMany({
            where: {
                token: refreshToken,
            },
        });

        return { message: "User logged out successfully" };
    }

    async refreshToken(refreshToken: string) {
        const session = await prisma.session.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!session) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (session.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token expired");
        }

        const accessToken = generateAccessToken({
            id: session.user.id,
            email: session.user.email,
            userType: session.user.userType as "owner" | "operator",
            companyId: session.companyId,
        });

        return {
            accessToken,
            expireIn: "1h",
        };
    }

    private async createSession(userId: string, token: string, req: Request) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.session.create({
            data: {
                token,
                userId,
                companyId: (await this.userService.findById(userId)).companyId,
                expiresAt,
                userAgent: req.headers["user-agent"],
                ipAddress: req.ip,
            },
        });
    }
}
