import { Company } from "@prisma/client";
import { ICompanyRepository } from "./repositories/ICompanyRepository.js";
import { SearchOutPut, SearchInput } from "../../core/interface/IRepository.js";
import { NotFoundError } from "../../errors/NotFounError.js";
import { UserContext } from "../../core/types/UserContext.js";

export interface CreateCompanyDto {
    name: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
}

export interface UpdateCompanyDto {
    name?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
}

export class CompanyService {
    private repository: ICompanyRepository;

    constructor(repository: ICompanyRepository) {
        this.repository = repository;
    }

    async findAll(ctx: UserContext, params: SearchInput): Promise<SearchOutPut<Company>> {
        const safeParams = {
            ...params,
            companyId: ctx.companyId,
        };

        return this.repository.findAll(safeParams);
    }

    async findById(ctx: UserContext, id: string): Promise<Company> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        if (company.id !== ctx.companyId) {
            throw new NotFoundError("Empresa não encontrada");
        }

        return company;
    }

    async findByCnpj(cnpj: string): Promise<Company> {
        const company = await this.repository.findByCnpj(cnpj);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        return company;
    }

    async save(ctx: UserContext, data: CreateCompanyDto): Promise<Company> {
        return this.repository.insert(data);
    }

    async update(ctx: UserContext, id: string, data: UpdateCompanyDto): Promise<Company> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        if (company.id !== ctx.companyId) {
            throw new NotFoundError("Empresa não encontrada");
        }

        return this.repository.update({ ...company, ...data });
    }

    async delete(ctx: UserContext, id: string): Promise<void> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        if (company.id !== ctx.companyId) {
            throw new NotFoundError("Empresa não encontrada");
        }

        await this.repository.delete(id);
    }
}
