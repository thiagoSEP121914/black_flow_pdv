import prisma from "../../core/prisma.js";

export interface CreateStoreDTO {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export interface UpdateStoreDTO {
    name?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
}

export class StoreService {
    // Criar loja vinculada a uma empresa
    async createStore(companyId: string, data: CreateStoreDTO) {
        const store = await prisma.store.create({
            data: {
                ...data,
                companyId,
                status: "active",
            },
        });
        return store;
    }

    // Listar lojas da empresa com paginação
    async getStores(companyId: string, page = 1, perPage = 10) {
        const skip = (page - 1) * perPage;
        const [stores, total] = await Promise.all([
            prisma.store.findMany({
                where: { companyId },
                skip,
                take: perPage,
                orderBy: { createdAt: "desc" },
            }),
            prisma.store.count({ where: { companyId } }),
        ]);

        return {
            data: stores,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        };
    }

    // Obter loja pelo ID (garantindo que pertence à empresa)
    async getStoreById(companyId: string, storeId: string) {
        const store = await prisma.store.findFirst({
            where: { id: storeId, companyId },
        });
        return store;
    }

    // Atualizar loja
    async updateStore(companyId: string, storeId: string, data: UpdateStoreDTO) {
        const store = await prisma.store.updateMany({
            where: { id: storeId, companyId },
            data,
        });

        if (store.count === 0) throw new Error("Store not found or not authorized");

        return await this.getStoreById(companyId, storeId);
    }

    // Desativar loja (soft delete)
    async deleteStore(companyId: string, storeId: string) {
        const store = await prisma.store.updateMany({
            where: { id: storeId, companyId },
            data: { status: "inactive" },
        });

        if (store.count === 0) throw new Error("Store not found or not authorized");

        return { message: "Store deactivated" };
    }
}

export const storeService = new StoreService();
