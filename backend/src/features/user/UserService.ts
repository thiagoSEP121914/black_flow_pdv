import prisma from "../../core/prisma.js";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;

export interface CreateUserDTO {
    email: string;
    password: string;
    name: string;
    phone?: string;
    userType: "owner" | "operator";
    companyId?: string;
    storeId?: string;
    role?: string;
}

export interface UpdateUserDTO {
    name?: string;
    phone?: string;
    role?: string;
}

export class UserService {
    // ==================== CREATE ====================

    async createUser(data: CreateUserDTO) {
        // Validações
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error("Email already registered");
        }

        if (data.userType === "owner" && !data.companyId) {
            throw new Error("Company ID is required for owners");
        }

        if (data.userType === "operator") {
            if (!data.storeId) throw new Error("Store ID is required for operators");
            if (!data.role) throw new Error("Role is required for operators");
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        // Cria o usuário
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                userType: data.userType,
                companyId: data.companyId,
                storeId: data.storeId,
                role: data.role,
            },
            include: {
                company:
                    data.userType === "owner"
                        ? {
                              select: {
                                  id: true,
                                  name: true,
                                  status: true,
                              },
                          }
                        : false,
                store:
                    data.userType === "operator"
                        ? {
                              select: {
                                  id: true,
                                  name: true,
                                  status: true,
                                  company: {
                                      select: {
                                          id: true,
                                          name: true,
                                      },
                                  },
                              },
                          }
                        : false,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // ==================== READ ====================

    async getAllUsers() {
        const users = await prisma.user.findMany({
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                company: true,
                store: {
                    include: {
                        company: true,
                    },
                },
            },
        });

        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                company: true,
                store: {
                    include: {
                        company: true,
                    },
                },
            },
        });

        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUsersByCompany(companyId: string) {
        const users = await prisma.user.findMany({
            where: {
                companyId,
                userType: "owner",
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async getUsersByStore(storeId: string) {
        const users = await prisma.user.findMany({
            where: {
                storeId,
                userType: "operator",
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async getActiveUsersByStore(storeId: string) {
        const users = await prisma.user.findMany({
            where: {
                storeId,
                userType: "operator",
                active: true,
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    // ==================== UPDATE ====================

    async updateUser(id: string, data: UpdateUserDTO) {
        const user = await prisma.user.update({
            where: { id },
            data,
            include: {
                company: true,
                store: true,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updatePassword(id: string, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        return { message: "Password updated successfully" };
    }

    async activateUser(id: string) {
        const user = await prisma.user.update({
            where: { id },
            data: { active: true },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async deactivateUser(id: string) {
        const user = await prisma.user.update({
            where: { id },
            data: { active: false },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // ==================== DELETE ====================

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        });
    }

    // ==================== SEARCH & FILTERS ====================

    async searchUsers(searchTerm: string) {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
                    { phone: { contains: searchTerm } },
                ],
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async getUsersByType(userType: "owner" | "operator") {
        const users = await prisma.user.findMany({
            where: { userType },
            include: {
                company: userType === "owner" ? true : false,
                store: userType === "operator" ? true : false,
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    async getUsersByRole(role: string) {
        const users = await prisma.user.findMany({
            where: {
                userType: "operator",
                role,
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return users.map(({ password, ...user }) => user);
    }

    // ==================== STATISTICS ====================

    async getUserStats(userId: string) {
        const [user, totalSales, totalRevenue] = await Promise.all([
            this.getUserById(userId),
            prisma.sale.count({ where: { userId } }),
            prisma.sale.aggregate({
                where: { userId },
                _sum: { total: true },
            }),
        ]);

        return {
            user,
            totalSales,
            totalRevenue: totalRevenue._sum.total || 0,
        };
    }
}

const userService = new UserService();
export default userService;
