import prisma from "../../core/prisma.js";

// === DTOs ===

export interface CreateProductDTO {
    name: string;
    description?: string;
    costPrice?: number;
    salePrice: number;
    barcode?: string;
    categoryId?: string; // ID da categoria enviado pelo usuário
    storeId: string;
    quantity?: number;
    minStock?: number;
    active?: boolean;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    barcode?: string;
    categoryId?: string;
    quantity?: number;
    minStock?: number;
    // Não incluímos categoryName/Active no update DTO, pois isso
    // é atualizado pelo serviço se o categoryId mudar.
}

// === SERVICE ===

export class ProductService {
    // --- Funções de Leitura (Otimizadas para MongoDB) ---

    /**
     * Lista produtos ativos de uma loja específica.
     * Retorna os dados da categoria incorporados, evitando JOIN.
     */
    async listProductsByStore(storeId: string) {
        return prisma.product.findMany({
            where: {
                storeId,
                active: true,
            },
            // ✅ REMOVIDO include: { category: true } - Usamos os campos incorporados
        });
    }

    /**
     * Busca um produto específico, garantindo a posse pela loja.
     */
    async getProductById(id: string, storeId: string) {
        return prisma.product.findFirst({
            where: { id, storeId },
            // ✅ REMOVIDO include: { category: true }
        });
    }

    // --- Funções de Escrita (Lógica de Incorporação) ---

    /**
     * Cria um novo produto, incorporando dados da categoria (se existir).
     */
    async createProduct(data: CreateProductDTO) {
        const { categoryId, ...productData } = data;
        let categoryFields = {};

        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
                select: { name: true, active: true },
            });

            // Early return caso a categoria não seja encontrada (ou apenas ignora, dependendo da regra)
            if (!category) {
                // Se a regra é permitir o produto sem categoria se o ID for inválido:
                // console.warn(`Category ID ${categoryId} not found.`);
                // Se a regra é FALHAR, você usaria: throw new Error("Category not found.");
            } else {
                // 1. Incorpora os campos de leitura rápida
                categoryFields = {
                    categoryName: category.name,
                    categoryActive: category.active,
                };
            }
        }

        return prisma.product.create({
            data: {
                ...productData, // Dados básicos do produto
                ...categoryFields, // Dados incorporados da categoria
                active: productData.active ?? true,
                quantity: productData.quantity ?? 0,
            },
        });
    }

    /**
     * Atualiza um produto. Atualiza o embedding se o categoryId mudar.
     */
    async updateProduct(id: string, storeId: string, data: Partial<UpdateProductDTO>) {
        // Validação usando early return
        const existingProduct = await this.getProductById(id, storeId);
        if (!existingProduct) {
            throw new Error("Product not found in this store.");
        }

        let categoryFields = {};
        const { categoryId, ...updateData } = data;

        // Se o categoryId foi fornecido na atualização, busca e incorpora os novos dados
        if (categoryId !== undefined) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
                select: { name: true, active: true },
            });

            if (!category && categoryId !== null) {
                throw new Error(`Category ID ${categoryId} not found.`);
            }

            // 2. Define os novos campos incorporados (ou null, se a categoria for removida)
            categoryFields = {
                categoryName: category ? category.name : null,
                categoryActive: category ? category.active : null,
                categoryId: category ? categoryId : null,
            };
        }

        return prisma.product.update({
            where: { id },
            data: {
                ...updateData,
                ...categoryFields,
            },
        });
    }

    /**
     * Desativa um produto, garantindo que ele pertence à loja.
     */
    async deactivateProduct(id: string, storeId: string) {
        // Validação usando early return
        const product = await prisma.product.findFirst({
            where: { id, storeId },
        });

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
