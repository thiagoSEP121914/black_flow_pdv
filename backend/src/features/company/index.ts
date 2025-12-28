import { prisma } from "../../core/prisma.js";
import { CompanyRepositoryImpl } from "../company/repositories/CompanyRepositorieImpl.js";
import { CompanyService } from "./CompanyService.js";
import { CompanyController } from "./CompanyController.js";

const companyRepositoriyImpl = new CompanyRepositoryImpl(prisma);
const companyService = new CompanyService(companyRepositoriyImpl);
const companyController = new CompanyController(companyService);

export { companyRepositoriyImpl, companyService, companyController };
