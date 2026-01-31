export interface ResponseCompanyDto {
    id: string;
    name: string;
    cnpj: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
