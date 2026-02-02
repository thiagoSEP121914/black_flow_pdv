import { IStoreRepository } from "./repositories/IStoreRepository.js";
import { SearchInput, SearchOutPut } from "../../core/interface/IRepository.js";
import { Store } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";

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
    private storeRepository: IStoreRepository;

    constructor(storeRepository: IStoreRepository) {
        this.storeRepository = storeRepository;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Store>> {
        return this.storeRepository.findAll(params);
    }

    async findStoreById(ctx: UserContext, id: string): Promise<Store> {
        const store = await this.storeRepository.findById(id);

        if (!store) throw new NotFoundError("Store not found");

        if (store.companyId !== ctx.companyId) {
            throw new NotFoundError("Store not found");
        }

        return store;
    }

    async createStore(ctx: UserContext, data: CreateStoreDTO): Promise<Store> {
        return this.storeRepository.insert({
            ...data,
            companyId: ctx.companyId,
            status: "active",
        });
    }

    async updateStore(ctx: UserContext, id: string, data: UpdateStoreDTO): Promise<Store> {
        const store = await this.storeRepository.findById(id);

        if (!store) throw new NotFoundError("Store not found");

        if (store.companyId !== ctx.companyId) {
            throw new NotFoundError("Store not found");
        }

        return this.storeRepository.update({ ...store, ...data });
    }

    async deleteStore(ctx: UserContext, id: string): Promise<void> {
        const store = await this.storeRepository.findById(id);

        if (!store) throw new NotFoundError("Store not found");

        if (store.companyId !== ctx.companyId) {
            throw new NotFoundError("Store not found");
        }

        await this.storeRepository.update({ ...store, status: "inactive" });
    }
}
