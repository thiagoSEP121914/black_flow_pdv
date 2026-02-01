import { IRepository } from "../../../core/interface/IRepository.js";
import { Store } from "@prisma/client";

export interface IStoreRepository extends IRepository<Store, Partial<Store>> {
    findAllStoreByCompany(id: string);
}
