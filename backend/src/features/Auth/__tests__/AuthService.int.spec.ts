import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { AuthService, SignupDTO, LoginDTO } from "../AuthService.js";
import { UserService } from "../../User/UserService.js";
import { CompanyService } from "../../Company/CompanyService.js";
import { SessionService } from "../../Session/SessionService.js";
import { UserRepositoryImpl } from "../../User/repositories/UserRepositoryImpl.js";
import { CompanyRepositoryImpl } from "../../Company/repositories/CompanyRepositoryImpl.js";
import { SessionRepositoryImpl } from "../../Session/repositories/SessionRepositoryImpl.js";
import { UnauthorizedError } from "../../../errors/UnauthorizedError.js";
import { NotFoundError } from "../../../errors/NotFounError.js";

const prisma = new PrismaClient();

describe("Auth Integration Tests", () => {
    let authService: AuthService;
    let userService: UserService;
    let companyService: CompanyService;
    let sessionService: SessionService;

    beforeAll(async () => {
        await prisma.$connect();

        // Create real services with real repositories
        const userRepository = new UserRepositoryImpl(prisma);
        const companyRepository = new CompanyRepositoryImpl(prisma);
        const sessionRepository = new SessionRepositoryImpl(prisma);

        userService = new UserService(userRepository);
        companyService = new CompanyService(companyRepository);
        sessionService = new SessionService(sessionRepository);

        authService = new AuthService(userService, companyService, sessionService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        // Cleanup database before each test
        await prisma.saleItem.deleteMany();
        await prisma.sale.deleteMany();
        await prisma.product.deleteMany();
        await prisma.cashier.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.customer.deleteMany();
        await prisma.financial.deleteMany();
        await prisma.permission.deleteMany();
        await prisma.store.deleteMany();
        await prisma.category.deleteMany();
        await prisma.company.deleteMany();
    });

    describe("signupOwner", () => {
        it("should create a company and owner user in the database", async () => {
            const signupData: SignupDTO = {
                email: "owner@newcompany.com",
                password: "password123",
                name: "Company Owner",
                companyName: "My New Company",
            };

            const result = await authService.signupOwner(signupData);

            expect(result.company).toBeDefined();
            expect(result.company.name).toBe("My New Company");
            expect(result.company.status).toBe("active");

            expect(result.user).toBeDefined();
            expect(result.user.email).toBe("owner@newcompany.com");
            expect(result.user.name).toBe("Company Owner");
            expect(result.user.companyId).toBe(result.company.id);

            // Verify in database
            const companyInDb = await prisma.company.findUnique({ where: { id: result.company.id } });
            expect(companyInDb).toBeDefined();
            expect(companyInDb?.name).toBe("My New Company");

            const userInDb = await prisma.user.findUnique({ where: { id: result.user.id } });
            expect(userInDb).toBeDefined();
            expect(userInDb?.email).toBe("owner@newcompany.com");
        });
    });

    describe("loginUser", () => {
        let companyId: string;
        const testPassword = "testpassword123";

        beforeEach(async () => {
            // Create a company and user for login tests
            const signupResult = await authService.signupOwner({
                email: "logintest@test.com",
                password: testPassword,
                name: "Login Test User",
                companyName: "Login Test Company",
            });
            companyId = signupResult.company.id;
        });

        it("should return tokens when credentials are valid", async () => {
            const loginData: LoginDTO = {
                email: "logintest@test.com",
                password: testPassword,
            };

            const result = await authService.loginUser(loginData, "test-agent", "127.0.0.1");

            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(result.expireIn).toBe("1h");
            expect(result.createdAt).toBeDefined();

            // Verify session was created in database
            const sessions = await prisma.session.findMany({
                where: { companyId },
            });
            expect(sessions.length).toBe(1);
            expect(sessions[0].token).toBe(result.refreshToken);
        });

        it("should throw NotFoundError when email does not exist", async () => {
            const loginData: LoginDTO = {
                email: "nonexistent@test.com",
                password: "anypassword",
            };

            await expect(authService.loginUser(loginData)).rejects.toThrow(NotFoundError);
        });

        it("should throw UnauthorizedError when password is wrong", async () => {
            const loginData: LoginDTO = {
                email: "logintest@test.com",
                password: "wrongpassword",
            };

            await expect(authService.loginUser(loginData)).rejects.toThrow(UnauthorizedError);
        });

        it("should throw UnauthorizedError when user is inactive", async () => {
            // Deactivate user
            await prisma.user.updateMany({
                where: { email: "logintest@test.com" },
                data: { active: false },
            });

            const loginData: LoginDTO = {
                email: "logintest@test.com",
                password: testPassword,
            };

            await expect(authService.loginUser(loginData)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe("logout", () => {
        it("should delete session from database", async () => {
            // Create user and login
            const signupResult = await authService.signupOwner({
                email: "logout@test.com",
                password: "password123",
                name: "Logout Test",
                companyName: "Logout Company",
            });

            const loginResult = await authService.loginUser({
                email: "logout@test.com",
                password: "password123",
            });

            // Verify session exists
            const sessionBefore = await prisma.session.findUnique({
                where: { token: loginResult.refreshToken },
            });
            expect(sessionBefore).toBeDefined();

            // Logout
            await authService.logout(loginResult.refreshToken);

            // Verify session was deleted
            const sessionAfter = await prisma.session.findUnique({
                where: { token: loginResult.refreshToken },
            });
            expect(sessionAfter).toBeNull();
        });
    });

    describe("refreshToken", () => {
        it("should return new access token when refresh token is valid", async () => {
            // Setup
            await authService.signupOwner({
                email: "refresh@test.com",
                password: "password123",
                name: "Refresh Test",
                companyName: "Refresh Company",
            });

            const loginResult = await authService.loginUser({
                email: "refresh@test.com",
                password: "password123",
            });

            // Refresh
            const refreshResult = await authService.refreshToken(loginResult.refreshToken);

            expect(refreshResult.accessToken).toBeDefined();
            expect(refreshResult.expireIn).toBe("1h");
        });

        it("should throw UnauthorizedError when refresh token does not exist", async () => {
            await expect(authService.refreshToken("invalid-token")).rejects.toThrow();
        });

        it("should throw UnauthorizedError when refresh token is expired", async () => {
            // Setup
            await authService.signupOwner({
                email: "expired@test.com",
                password: "password123",
                name: "Expired Test",
                companyName: "Expired Company",
            });

            const loginResult = await authService.loginUser({
                email: "expired@test.com",
                password: "password123",
            });

            // Expire the session manually
            await prisma.session.update({
                where: { token: loginResult.refreshToken },
                data: { expiresAt: new Date(Date.now() - 1000) },
            });

            await expect(authService.refreshToken(loginResult.refreshToken)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe("Full Auth Flow", () => {
        it("should complete signup -> login -> refresh -> logout flow", async () => {
            // 1. Signup
            const signupResult = await authService.signupOwner({
                email: "fullflow@test.com",
                password: "password123",
                name: "Full Flow User",
                companyName: "Full Flow Company",
            });
            expect(signupResult.company).toBeDefined();
            expect(signupResult.user).toBeDefined();

            // 2. Login
            const loginResult = await authService.loginUser({
                email: "fullflow@test.com",
                password: "password123",
            });
            expect(loginResult.accessToken).toBeDefined();
            expect(loginResult.refreshToken).toBeDefined();

            // 3. Refresh Token
            const refreshResult = await authService.refreshToken(loginResult.refreshToken);
            expect(refreshResult.accessToken).toBeDefined();

            // 4. Logout
            const logoutResult = await authService.logout(loginResult.refreshToken);
            expect(logoutResult.message).toBe("User logged out successfully");

            // 5. Verify session is gone
            await expect(authService.refreshToken(loginResult.refreshToken)).rejects.toThrow();
        });
    });
});
