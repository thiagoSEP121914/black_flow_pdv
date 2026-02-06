import { Sale, SaleStatus } from "@prisma/client";
import { IRepository } from "../../../core/interface/IRepository.js";

export interface IFindByDateRangeInput {
    start: Date;
    end: Date;
    companyId: string;
}

export interface IFindSaleByStatusInput {
    status: SaleStatus;
}

export interface ISaleRepository extends IRepository<Sale, Partial<Sale>> {
    findByDateRange(findByDateRangeInput: IFindByDateRangeInput): Promise<Sale>;
    findByStatus(findByStatus: IFindSaleByStatusInput): Promise<Sale[]>;
}
