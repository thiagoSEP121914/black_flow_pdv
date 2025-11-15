import prisma from "../../core/prisma.js";

export interface CreateCompanyDTO {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
}

export interface UpdateCompanyDTO {
    name?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
}

export class CompanyService {
    async createCompany(data: CreateCompanyDTO) {
        const company = await prisma.company.create({
            data: {
                name: data.name,
                cnpj: data.cnpj,
                phone: data.phone,
                email: data.email,
                address: data.address,
                status: data.status || "active",
            },
            include: {
                owners: true,
                stores: true,
            },
        });

        return company;
    }

    async getAllCompanies() {
        return await prisma.company.findMany({
            include: {
                owners: {
                    where: { active: true },
                },
                stores: {
                    where: { status: "active" },
                },
                _count: {
                    select: {
                        stores: true,
                        owners: true,
                        financialItems: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async getCompanyById(id: string) {
        return await prisma.company.findUnique({
            where: { id },
            include: {
                owners: {
                    where: { active: true },
                },
                stores: true,
                financialItems: {
                    orderBy: { date: "desc" },
                    take: 10,
                },
            },
        });
    }

    async updateCompany(id: string, data: UpdateCompanyDTO) {
        return await prisma.company.update({
            where: { id },
            data,
            include: {
                owners: true,
                stores: true,
            },
        });
    }

    async deleteCompany(id: string) {
        // Soft delete: apenas desativa
        return await prisma.company.update({
            where: { id },
            data: { status: "inactive" },
        });
    }

    async hardDeleteCompany(id: string) {
        // Delete físico (cuidado com as relações em cascata!)
        return await prisma.company.delete({
            where: { id },
        });
    }

    async getCompanyStats(companyId: string) {
        const [company, totalStores, activeStores, totalOwners, financialSummary] = await Promise.all([
            prisma.company.findUnique({
                where: { id: companyId },
                select: {
                    id: true,
                    name: true,
                    status: true,
                },
            }),
            prisma.store.count({
                where: { companyId },
            }),
            prisma.store.count({
                where: {
                    companyId,
                    status: "active",
                },
            }),
            prisma.owner.count({
                where: {
                    companyId,
                    active: true,
                },
            }),
            prisma.financial.groupBy({
                by: ["type"],
                where: { companyId },
                _sum: {
                    amount: true,
                },
            }),
        ]);

        return {
            company,
            totalStores,
            activeStores,
            totalOwners,
            financialSummary,
        };
    }

    async getCompaniesByStatus(status: string) {
        return await prisma.company.findMany({
            where: { status },
            include: {
                _count: {
                    select: {
                        stores: true,
                        owners: true,
                    },
                },
            },
        });
    }

    async searchCompanies(searchTerm: string) {
        return await prisma.company.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { cnpj: { contains: searchTerm } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
                ],
            },
            include: {
                _count: {
                    select: {
                        stores: true,
                        owners: true,
                    },
                },
            },
        });
    }
}

const companyService = new CompanyService();
export default companyService;
