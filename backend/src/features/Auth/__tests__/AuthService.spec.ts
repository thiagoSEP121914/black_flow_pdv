import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { AuthService, SignupDTO, LoginDTO } from "../AuthService.js";
import { UserService } from "../../User/UserService.js";
import { CompanyService } from "../../Company/CompanyService.js";
import { SessionService } from "../../Session/SessionService.js";
import { User, Company, Session } from "@prisma/client";
import { UnauthorizedError } from "../../../errors/UnauthorizedError.js";
import { NotFoundError } from "../../../errors/NotFounError.js";

type MockUserService = jest.Mocked<UserService>;
type MockCompanyService = jest.Mocked<CompanyService>;
type MockSessionService = jest.Mocked<SessionService>;

describe("AuthService unit tests", () => {
    let authService: AuthService;
    let mockUserService: MockUserService;
    let mockCompanyService: MockCompanyService;
    let mockSessionService: MockSessionService;

    const makeUser = (overrides: Partial<User> = {}): User =>
        ({
            id: "user-1",
            email: "test@example.com",
            password: "$2b$10$hashedpassword123", // Realistic bcrypt hash format
            name: "Test User",
            phone: null,
            avatar: null,
            userType: "owner",
            role: null,
            companyId: "company-1",
            storeId: null,
            active: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as User;

    const makeCompany = (overrides: Partial<Company> = {}): Company =>
        ({
            id: "company-1",
            name: "Test Company",
            status: "active",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as Company;

    const makeSession = (overrides: Partial<Session> = {}): Session =>
        ({
            id: "session-1",
            token: "mock-refresh-token",
            userId: "user-1",
            companyId: "company-1",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            userAgent: "test-agent",
            ipAddress: "127.0.0.1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            ...overrides,
        }) as Session;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUserService = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            existsByEmail: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as MockUserService;

        mockCompanyService = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as MockCompanyService;

        mockSessionService = {
            create: jest.fn(),
            findByToken: jest.fn(),
            deleteByToken: jest.fn(),
        } as unknown as MockSessionService;

        authService = new AuthService(mockUserService, mockCompanyService, mockSessionService);
    });

    describe("signupOwner", () => {
        it("should create a company and owner user", async () => {
            const signupData: SignupDTO = {
                email: "newowner@test.com",
                password: "password123",
                name: "New Owner",
                companyName: "New Company",
            };

            const company = makeCompany({ name: "New Company" });
            const user = makeUser({ email: "newowner@test.com", name: "New Owner" });

            mockCompanyService.save.mockResolvedValue(company);
            mockUserService.save.mockResolvedValue(user);

            const result = await authService.signupOwner(signupData);

            expect(mockCompanyService.save).toHaveBeenCalledWith(
                expect.objectContaining({ userId: "system", companyId: "system" }),
                expect.objectContaining({ name: "New Company", status: "active" }),
            );
            expect(mockUserService.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "newowner@test.com",
                    password: "password123",
                    name: "New Owner",
                    userType: "owner",
                    companyId: company.id,
                    active: true,
                }),
            );
            expect(result.company).toEqual(company);
            expect(result.user).toEqual(user);
        });
    });

    describe("loginUser", () => {
        it("should throw NotFoundError when user not found", async () => {
            const loginData: LoginDTO = { email: "notfound@example.com", password: "password123" };

            mockUserService.findByEmail.mockRejectedValue(new NotFoundError("User not found"));

            await expect(authService.loginUser(loginData)).rejects.toThrow(NotFoundError);
        });

        it("should throw UnauthorizedError when user is inactive", async () => {
            const loginData: LoginDTO = { email: "test@example.com", password: "password123" };
            const inactiveUser = makeUser({ active: false });

            mockUserService.findByEmail.mockResolvedValue(inactiveUser);

            await expect(authService.loginUser(loginData)).rejects.toThrow(UnauthorizedError);
            await expect(authService.loginUser(loginData)).rejects.toThrow("User does not have authorization");
        });

        it("should throw UnauthorizedError when password is invalid", async () => {
            const loginData: LoginDTO = { email: "test@example.com", password: "wrongpassword" };
            const user = makeUser();

            mockUserService.findByEmail.mockResolvedValue(user);

            // bcrypt.compare will actually run and return false since password doesn't match
            await expect(authService.loginUser(loginData)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe("logout", () => {
        it("should delete session and return success message", async () => {
            mockSessionService.deleteByToken.mockResolvedValue();

            const result = await authService.logout("mock-refresh-token");

            expect(mockSessionService.deleteByToken).toHaveBeenCalledWith("mock-refresh-token");
            expect(result.message).toBe("User logged out successfully");
        });
    });

    describe("refreshToken", () => {
        it("should return new access token when refresh token is valid", async () => {
            const session = makeSession();
            const user = makeUser();

            mockSessionService.findByToken.mockResolvedValue(session);
            mockUserService.findById.mockResolvedValue(user);

            const result = await authService.refreshToken("mock-refresh-token");

            expect(mockSessionService.findByToken).toHaveBeenCalledWith("mock-refresh-token");
            expect(mockUserService.findById).toHaveBeenCalledWith(session.userId);
            // Just check that accessToken is a JWT (starts with 'eyJ')
            expect(result.accessToken).toMatch(/^eyJ/);
            expect(result.expireIn).toBe("1h");
        });

        it("should throw UnauthorizedError when session not found", async () => {
            mockSessionService.findByToken.mockResolvedValue(null as any);

            await expect(authService.refreshToken("invalid-token")).rejects.toThrow(UnauthorizedError);
            await expect(authService.refreshToken("invalid-token")).rejects.toThrow("Invalid refresh token");
        });

        it("should throw UnauthorizedError when refresh token is expired", async () => {
            const expiredSession = makeSession({
                expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
            });

            mockSessionService.findByToken.mockResolvedValue(expiredSession);

            await expect(authService.refreshToken("expired-token")).rejects.toThrow(UnauthorizedError);
            await expect(authService.refreshToken("expired-token")).rejects.toThrow("Refresh token expired");
        });
    });
});
