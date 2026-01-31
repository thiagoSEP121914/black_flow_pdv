import { Company } from "@prisma/client";
import { ICompanyRepository } from "./repositories/ICompanyRepository.js";
import { SearchOutPut } from "../../core/interface/IRepository.js";
import { NotFoundError } from "../../errors/NotFounError.js";
import { CreateCompanyDto, UpdateCompanyDto } from "./dtos/index.js";

export class CompanyService {
    private repository: ICompanyRepository;

    constructor(repository: ICompanyRepository) {
        this.repository = repository;
    }

    async findAll(params: { page?: number; per_page?: number }): Promise<SearchOutPut<Company>> {
        return this.repository.findAll(params);
    }

    async findById(id: string): Promise<Company> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        return company;
    }

    async findByCnpj(cnpj: string): Promise<Company> {
        const company = await this.repository.findByCnpj(cnpj);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        return company;
    }

    async save(data: CreateCompanyDto): Promise<Company> {
        return this.repository.insert(data);
    }

    async update(id: string, data: UpdateCompanyDto): Promise<Company> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        return this.repository.update({ ...company, ...data });
    }

    async delete(id: string): Promise<void> {
        const company = await this.repository.findById(id);

        if (!company) throw new NotFoundError("Empresa não encontrada");

        await this.repository.delete(id);
    }
}
