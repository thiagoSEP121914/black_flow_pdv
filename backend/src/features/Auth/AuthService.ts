import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

import { UserService } from "../User/UserService.js";
import { CompanyService } from "../Company/CompanyService.js";
import { UnauthorizedError } from "../../errors/UnauthorizedError.js";
import { NotFoundError } from "../../errors/NotFounError.js";
import { comparePasword } from "../../utils/bcrypt.js";
import { SessionService } from "../Session/SessionService.js";

export type SignupDTO = {
    email: string;
    password: string;
    name: string;
    companyName: string;
};

export type LoginDTO = {
    email: string;
    password: string;
};

type LoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    expireIn: string;
    createdAt: string;
};

export class AuthService {
    private userService: UserService;
    private companyService: CompanyService;
    private sessionService: SessionService;

    constructor(
        userService: UserService,
        companyService: CompanyService,
        sessionService: SessionService
    ) {
        this.userService = userService;
        this.companyService = companyService;
        this.sessionService = sessionService;
    }

    async signupOwner(data: SignupDTO) {
        const systemContext = { userId: "system", companyId: "system", role: "owner" };

        const company = await this.companyService.save(systemContext, {
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

    async loginUser(data: LoginDTO, userAgent?: string, ipAddress?: string) {
        const user = await this.userService.findByEmail(data.email);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!user.active) {
            throw new UnauthorizedError("User does not have authorization");
        }

        const isValid = await comparePasword(data.password, user.password);

        if (!isValid) throw new UnauthorizedError("Invalid credentials");

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            userType: user.userType as "owner" | "operator",
            companyId: user.companyId,
        });
        const refreshToken = generateRefreshToken({ id: user.id });
        await this.createSession(user.id, refreshToken, userAgent, ipAddress);

        const createdAt = new Date().toISOString();

        return { accessToken, refreshToken, expireIn: "1h", createdAt };
    }

    async logout(refreshToken: string) {
        await this.sessionService.deleteByToken(refreshToken);

        return { message: "User logged out successfully" };
    }

    async refreshToken(refreshToken: string) {
        const session = await this.sessionService.findByToken(refreshToken);

        if (!session) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (session.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token expired");
        }

        // Precisamos do usuario completo.
        const user = await this.userService.findById(session.userId);

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            userType: user.userType as "owner" | "operator",
            companyId: session.companyId,
        });

        return {
            accessToken,
            expireIn: "1h",
        };
    }

    private async createSession(userId: string, token: string, userAgent?: string, ipAddress?: string) {
        const user = await this.userService.findById(userId);

        await this.sessionService.create({
            token,
            userId,
            companyId: user.companyId,
            userAgent: userAgent || null,
            ipAddress: ipAddress || null,
        });
    }
}
