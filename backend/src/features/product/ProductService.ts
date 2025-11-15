import prisma from "../../core/prisma.js";

export interface CreateProductDTO {
    name: string;
    description?: string;
    costPrice?: number;
    salePrice: number; // Corrigido de 'price' para 'salePrice'
    barcode?: string;
    categoryId?: string;
    storeId: string; // Adicionado campo obrigatório
    quantity?: number;
    minStock?: number;
    active?: boolean;
}

// DTO para atualização
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    barcode?: string;
    categoryId?: string;
    quantity?: number;
    minStock?: number;
}

export class ProductService {
    /**
     * Lista produtos de uma loja específica
     */
    async listProductsByStore(storeId: string) {
        return prisma.product.findMany({
            where: {
                storeId,
                active: true,
            },
            include: { category: true },
        });
    }

    /**
     * Busca um produto específico, garantindo que ele pertence à loja
     */
    async getProductById(id: string, storeId: string) {
        return prisma.product.findFirst({
            where: { id, storeId },
            include: { category: true },
        });
    }

    /**
     * Cria um novo produto para uma loja
     */
    async createProduct(data: CreateProductDTO) {
        // A 'storeId' já está em 'data'
        const product = await prisma.product.create({
            data: {
                ...data,
                active: data.active ?? true,
                quantity: data.quantity ?? 0,
            },
        });

        // Remove a lógica de 'stock.create' pois 'quantity' está no produto
        return product;
    }

    /**
     * Atualiza um produto, garantindo que ele pertence à loja
     */
    async updateProduct(id: string, storeId: string, data: Partial<UpdateProductDTO>) {
        // Validação para garantir que o produto pertence à loja antes de atualizar
        const product = await this.getProductById(id, storeId);
        if (!product) {
            throw new Error("Product not found in this store.");
        }

        return prisma.product.update({
            where: { id },
            data,
        });
    }

    /**
     * Desativa um produto, garantindo que ele pertence à loja
     */
    async deactivateProduct(id: string, storeId: string) {
        // Validação
        const product = await this.getProductById(id, storeId);
        if (!product) {
            throw new Error("Product not found in this store.");
        }

        return prisma.product.update({
            where: { id },
            data: { active: false },
        });
    }
}

export const productService = new ProductService();
