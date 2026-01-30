import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Nome do produto é obrigatório"),
    active: z.boolean().default(true),
    categoryId: z.string().optional(),
    barcode: z.string().optional(),
    salePrice: z.coerce
        .number()
        .min(0, "Preço deve ser maior ou igual a 0"),
    costPrice: z.coerce
        .number()
        .min(0, "Custo deve ser maior ou igual a 0")
        .optional(),
    quantity: z.coerce
        .number()
        .int()
        .min(0, "Estoque deve ser maior ou igual a 0")
        .default(0),
    minStock: z.coerce
        .number()
        .int()
        .min(0, "Estoque mínimo deve ser maior ou igual a 0")
        .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
