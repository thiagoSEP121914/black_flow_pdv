import { Company } from "@prisma/client";
import { IRepository } from "../../../core/interface/IRepository.js";

export interface ICompanyRepository extends IRepository<Company, Partial<Company>> {
    findByCnpj(cnpj: string): Promise<Company>;
}
