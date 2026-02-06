import { ISaleRepository, IFindByDateRangeInput, IFindSaleByStatusInput } from "./ISaleRepository.js";
import { Sale, PrismaClient, SaleItem } from "@prisma/client";
import { SearchInput, SearchOutPut } from "../../../core/interface/IRepository.js";

export type SaleWithItems = Sale & { items: SaleItem[] };

export interface CreateSaleData {
    date?: Date;
    total: number;
    discount?: number;
    paymentMethod: "CASH" | "CREDIT" | "DEBIT" | "PIX";
    status?: "COMPLETED" | "CANCELED" | "REFUNDED" | "PENDING";
    companyId: string;
    storeId: string;
    userId: string;
    customerId?: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
}

export class SaleRepositoryImpl implements ISaleRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(params: SearchInput): Promise<SearchOutPut<Sale>> {
        const { page, per_page, sort_by, sort_dir, filter, companyId } = params;

        const skip = page && per_page ? (page - 1) * per_page : undefined;
        const take = per_page ?? undefined;

        const where: any = this.buildWhereClause(filter);
        where.companyId = companyId;

        const [items, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                ...(skip !== undefined ? { skip } : {}),
                ...(take !== undefined ? { take } : {}),
                orderBy: sort_by ? { [sort_by]: sort_dir ?? "desc" } : { date: "desc" },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    user: { select: { id: true, name: true } },
                },
            }),
            this.prisma.sale.count({ where }),
        ]);

        return {
            items,
            per_page: per_page ?? total,
            total,
            current_page: page ?? 1,
            sort_by: sort_by ?? null,
            sort_dir: sort_dir ?? null,
            filter: filter ?? null,
        };
    }

    async findById(id: string): Promise<Sale> {
        return (await this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                customer: true,
                user: { select: { id: true, name: true } },
                store: { select: { id: true, name: true } },
            },
        })) as Sale;
    }

    async insert(data: Partial<Sale>): Promise<Sale> {
        return await this.prisma.sale.create({
            data: data as any,
            include: {
                items: true,
                customer: true,
            },
        });
    }

    async insertWithItems(data: CreateSaleData): Promise<SaleWithItems> {
        const { items, ...saleData } = data;

        return await this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    ...saleData,
                    items: {
                        create: items,
                    },
                },
                include: {
                    items: true,
                    customer: true,
                },
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        quantity: { decrement: item.quantity },
                    },
                });
            }

            return sale;
        });
    }

    async update(model: Partial<Sale>): Promise<Sale> {
        const { id, ...data } = model;

        if (!id) throw new Error("ID not provided for update");

        return await this.prisma.sale.update({
            where: { id },
            data: data as any,
            include: {
                items: { include: { product: true } },
                customer: true,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.saleItem.deleteMany({ where: { saleId: id } });
            await tx.sale.delete({ where: { id } });
        });
    }

    async findByDateRange(input: IFindByDateRangeInput): Promise<Sale[]> {
        const { start, end, companyId } = input;

        return await this.prisma.sale.findMany({
            where: {
                companyId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                items: { include: { product: true } },
                customer: true,
            },
            orderBy: { date: "desc" },
        });
    }

    async findByStatus(input: IFindSaleByStatusInput): Promise<Sale[]> {
        const { status, companyId } = input;

        return await this.prisma.sale.findMany({
            where: { status, companyId },
            include: {
                items: { include: { product: true } },
                customer: true,
            },
            orderBy: { date: "desc" },
        });
    }

    async findByUserId(userId: string, companyId: string): Promise<Sale[]> {
        return await this.prisma.sale.findMany({
            where: { userId, companyId },
            include: {
                items: { include: { product: true } },
                customer: true,
            },
            orderBy: { date: "desc" },
        });
    }

    async findByCustomerId(customerId: string, companyId: string): Promise<Sale[]> {
        return await this.prisma.sale.findMany({
            where: { customerId, companyId },
            include: {
                items: { include: { product: true } },
                customer: true,
            },
            orderBy: { date: "desc" },
        });
    }

    private buildWhereClause(filter?: string | null): any {
        if (!filter) return {};

        if (filter.includes("=")) {
            const [key, value] = filter.split("=");
            const validKeys = ["status", "paymentMethod", "storeId", "userId"];

            if (validKeys.includes(key.trim())) {
                return { [key.trim()]: value.trim() };
            }
        }

        return {};
    }
}
