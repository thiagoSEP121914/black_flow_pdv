import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { ProductService, CreateProductDTO, UpdateProductDTO } from "./ProductService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createProductSchema: z.ZodType<CreateProductDTO> = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    costPrice: z.number().optional(),
    salePrice: z.number(),
    barcode: z.string().optional(),
    categoryId: z.string().optional(),
    storeId: z.string(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
    active: z.boolean().optional(),
});

const updateProductSchema: z.ZodType<UpdateProductDTO> = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    costPrice: z.number().optional(),
    salePrice: z.number().optional(),
    barcode: z.string().optional(),
    categoryId: z.string().optional(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
});

export class ProductController extends Controller {
    private productService: ProductService;

    constructor(productService: ProductService) {
        super();
        this.productService = productService;
    }

    /**
     * @swagger
     * tags:
     *   name: Products
     *   description: Gerenciamento de Produtos
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Product:
     *       type: object
     *       required:
     *         - name
     *         - salePrice
     *         - storeId
     *       properties:
     *         id:
     *           type: string
     *           description: ID do produto
     *         name:
     *           type: string
     *           description: Nome do produto
     *         description:
     *           type: string
     *           description: Descrição do produto
     *         costPrice:
     *           type: number
     *           description: Preço de custo
     *         salePrice:
     *           type: number
     *           description: Preço de venda
     *         barcode:
     *           type: string
     *           description: Código de barras
     *         quantity:
     *           type: integer
     *           description: Quantidade em estoque
     *         minStock:
     *           type: integer
     *           description: Estoque mínimo
     *         active:
     *           type: boolean
     *           description: Status do produto
     *         storeId:
     *           type: string
     *           description: ID da loja
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *     CreateProductDto:
     *       type: object
     *       required:
     *         - name
     *         - salePrice
     *         - storeId
     *       properties:
     *         name:
     *           type: string
     *           example: "Coca Cola"
     *         description:
     *           type: string
     *           example: "Refrigerante 2L"
     *         salePrice:
     *           type: number
     *           example: 10.50
     *         costPrice:
     *           type: number
     *           example: 5.00
     *         storeId:
     *           type: string
     *           example: "64e..."
     *         barcode:
     *           type: string
     *           example: "789..."
     */

    handle(): Router {
        /**
         * @swagger
         * /auth/products:
         *   get:
         *     summary: Lista produtos com paginação e filtros
         *     tags: [Products]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Número da página
         *       - in: query
         *         name: per_page
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Itens por página
         *       - in: query
         *         name: filter
         *         schema:
         *           type: string
         *         description: Texto para busca (nome, descrição, código de barras)
         *       - in: query
         *         name: sort_by
         *         schema:
         *           type: string
         *         description: Campo para ordenação
         *       - in: query
         *         name: sort_dir
         *         schema:
         *           type: string
         *           enum: [asc, desc]
         *         description: Direção da ordenação
         *     responses:
         *       200:
         *         description: Lista de produtos
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Product'
         *                 total:
         *                   type: integer
         */
        this.route.get("/", async (req: Request, res: Response) => {
            const params: SearchInput = {
                page: req.query.page ? Number(req.query.page) : undefined,
                per_page: req.query.per_page ? Number(req.query.per_page) : undefined,
                sort_by: req.query.sort_by as string,
                sort_dir: req.query.sort_dir as "asc" | "desc",
                filter: req.query.filter as string,
                companyId: req.user!.companyId
            };

            const result = await this.productService.findAll(params);

            return res.status(200).json(result);
        });

        /**
         * @swagger
         * /auth/products/{id}:
         *   get:
         *     summary: Busca um produto pelo ID
         *     tags: [Products]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do produto
         *     responses:
         *       200:
         *         description: Produto encontrado
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Product'
         */
        this.route.get("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const response = await this.productService.findById(id);

            return res.status(200).json(response);
        });

        /**
         * @swagger
         * /auth/products:
         *   post:
         *     summary: Cria um novo produto
         *     tags: [Products]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateProductDto'
         *     responses:
         *       201:
         *         description: Produto criado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Product'
         */
        this.route.post("/", async (req: Request, res: Response) => {
            const input = createProductSchema.parse(req.body);
            const product = await this.productService.save(input);
            res.status(201).json(product);
        });

        /**
         * @swagger
         * /auth/products/{id}:
         *   patch:
         *     summary: Atualiza dados de um produto
         *     tags: [Products]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do produto
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateProductDto'
         *     responses:
         *       200:
         *         description: Produto atualizado
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Product'
         */
        this.route.patch("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const input = updateProductSchema.parse(req.body);
            const product = await this.productService.update(id, input);
            res.status(200).json(product);
        });

        /**
         * @swagger
         * /auth/products/{id}:
         *   delete:
         *     summary: Remove um produto
         *     tags: [Products]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID do produto
         *     responses:
         *       204:
         *         description: Produto removido com sucesso
         */
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            await this.productService.delete(id);
            res.status(204).send();
        });

        return this.route;
    }
}
