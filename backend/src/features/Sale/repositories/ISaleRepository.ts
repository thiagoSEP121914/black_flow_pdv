import { Sale, SaleStatus } from "@prisma/client";
import { IRepository } from "../../../core/interface/IRepository.js";

export interface IFindByDateRangeInput {
    start: Date;
    end: Date;
    companyId: string;
}

export interface IFindSaleByStatusInput {
    status: SaleStatus;
    companyId: string;
}

export interface ISaleRepository extends IRepository<Sale, Partial<Sale>> {
    findByDateRange(input: IFindByDateRangeInput): Promise<Sale[]>;
    findByStatus(input: IFindSaleByStatusInput): Promise<Sale[]>;
    findByUserId(userId: string, companyId: string): Promise<Sale[]>;
    findByCustomerId(customerId: string, companyId: string): Promise<Sale[]>;
}
