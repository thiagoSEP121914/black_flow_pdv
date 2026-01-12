// src/features/product/ProductController.ts
import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { productService, CreateProductDTO, UpdateProductDTO } from "./ProductService.js";
import { AccessTokenPayload } from "../../utils/jwt.js";
import { prisma } from "../../core/prisma.js";

// Interface do request autenticado (provavelmente do seu middleware)
export interface AuthenticateRequest extends Request {
    user: AccessTokenPayload; // Espera-se que tenha { companyId: string, ... }
}

export class ProductController extends Controller {
    // Helper para checar se a loja pertence à empresa do usuário logado
    private async checkStoreAccess(companyId: string, storeId: string): Promise<boolean> {
        const store = await prisma.store.findFirst({
            where: { id: storeId, companyId: companyId },
        });

        return !!store;
    }

    handle(): Router {
        this.route.post("/", async (req: Request, res: Response) => {
            try {
                const { companyId } = (req as AuthenticateRequest).user;
                const data = req.body as CreateProductDTO;

                if (!data.storeId) {
                    return res.status(400).json({ error: "storeId is required" });
                }

                const hasAccess = await this.checkStoreAccess(companyId, data.storeId);

                if (!hasAccess) {
                    return res.status(403).json({ error: "Access denied to this store" });
                }

                // ✅ PASSA O companyId
                const product = await productService.createProduct(companyId, data);

                return res.status(201).json(product);
            } catch (err) {
                const error = err as Error;
                console.error(error);

                return res.status(500).json({ error: error.message });
            }
        });

        this.route.get("/", async (req: Request, res: Response) => {
            try {
                const { companyId } = (req as AuthenticateRequest).user;
                const { storeId } = req.params;

                if (!storeId) {
                    return res.status(400).json({ error: "storeId query parameter is required" });
                }

                // Checagem de segurança
                const hasAccess = await this.checkStoreAccess(companyId, storeId);

                if (!hasAccess) {
                    return res.status(403).json({ error: "Access denied to this store" });
                }

                const products = await productService.listProductsByStore(storeId);

                return res.json(products);
            } catch (err) {
                const error = err as Error;
                console.error(error);

                return res.status(500).json({ error: error.message });
            }
        });

        /**
         * Obter um produto específico
         * Requer 'storeId' na query string (?storeId=...)
         */
        this.route.get("/:id", async (req: Request, res: Response) => {
            try {
                const { companyId } = (req as AuthenticateRequest).user;
                const storeId = req.query.storeId as string;
                const { id } = req.params;

                if (!storeId) {
                    return res.status(400).json({ error: "storeId query parameter is required" });
                }

                // Checagem de segurança
                const hasAccess = await this.checkStoreAccess(companyId, storeId);

                if (!hasAccess) {
                    return res.status(403).json({ error: "Access denied to this store" });
                }

                const product = await productService.getProductById(id, storeId);

                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }

                return res.json(product);
            } catch (err) {
                const error = err as Error;
                console.error(error);

                return res.status(500).json({ error: error.message });
            }
        });
        this.route.put("/:id", async (req: Request, res: Response) => {
            try {
                const { companyId } = (req as AuthenticateRequest).user;
                const { storeId } = req.params;
                const { id } = req.params;

                // 🛑 CORREÇÃO APLICADA AQUI:
                // Destrutura para garantir que storeId não seja passado no objeto data,
                // prevenindo que o Prisma tente atualizar o campo de escopo (storeId)
                const { storeId: _storeId, ...data } = req.body as UpdateProductDTO & {
                    storeId?: string;
                };

                if (!storeId) {
                    return res.status(400).json({ error: "storeId query parameter is required" });
                }

                // Checagem de segurança (mantida)
                const hasAccess = await this.checkStoreAccess(companyId, storeId);

                if (!hasAccess) {
                    return res.status(403).json({ error: "Access denied to this store" });
                }

                // Passamos o storeId da QUERY como parâmetro de escopo
                const product = await productService.updateProduct(id, storeId, data);

                return res.json(product);
            } catch (err) {
                const error = err as Error;
                console.error(error);

                // Retorna 404 se o 'update' não encontrou o produto naquela loja
                return res.status(error.message.includes("not found") ? 404 : 400).json({ error: error.message });
            }
        });

        this.route.delete("/:id", async (req: Request, res: Response) => {
            try {
                const { companyId } = (req as AuthenticateRequest).user;
                const { storeId } = req.params;
                const { id } = req.params;

                if (!storeId) {
                    return res.status(400).json({ error: "storeId query parameter is required" });
                }

                const hasAccess = await this.checkStoreAccess(companyId, storeId);

                if (!hasAccess) {
                    return res.status(403).json({ error: "Access denied to this store" });
                }

                await productService.deactivateProduct(id, storeId);

                return res.status(204).send(); // 204 No Content
            } catch (err) {
                const error = err as Error;
                console.error(error);

                return res.status(error.message.includes("not found") ? 404 : 400).json({ error: error.message });
            }
        });

        return this.route;
    }
}
const productController = new ProductController();
export default productController.handle();
