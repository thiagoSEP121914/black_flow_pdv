import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { CategoryService, CreateCategoryDTO, UpdateCategoryDTO } from "./CategoryService.js";
import { SearchInput } from "../../core/interface/IRepository.js";
import { z } from "zod";

const createCategorySchema: z.ZodType<CreateCategoryDTO> = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    storeId: z.string(),
    active: z.boolean().optional(),
});

const updateCategorySchema: z.ZodType<UpdateCategoryDTO> = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    active: z.boolean().optional(),
});

export class CategoryController extends Controller {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        super();
        this.categoryService = categoryService;
    }

    /**
     * @swagger
     * tags:
     *   name: Categories
     *   description: Gerenciamento de Categorias
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Category:
     *       type: object
     *       required:
     *         - name
     *         - storeId
     *       properties:
     *         id:
     *           type: string
     *           description: ID da categoria
     *         name:
     *           type: string
     *           description: Nome da categoria
     *         description:
     *           type: string
     *           description: Descrição da categoria
     *         active:
     *           type: boolean
     *           description: Status da categoria
     *         storeId:
     *           type: string
     *           description: ID da loja
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *     CreateCategoryDto:
     *       type: object
     *       required:
     *         - name
     *         - storeId
     *       properties:
     *         name:
     *           type: string
     *           example: "Bebidas"
     *         description:
     *           type: string
     *           example: "Refrigerantes e sucos"
     *         storeId:
     *           type: string
     *           example: "uuid-store"
     *         active:
     *           type: boolean
     *           example: true
     */

    handle(): Router {
        /**
         * @swagger
         * /auth/categories:
         *   get:
         *     summary: Lista categorias com paginação e filtros
         *     tags: [Categories]
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
         *         description: Texto para busca (nome, descrição)
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
         *         description: Lista de categorias
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Category'
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

            const result = await this.categoryService.findAll(params);

            return res.status(200).json(result);
        });

        /**
         * @swagger
         * /auth/categories/{id}:
         *   get:
         *     summary: Busca uma categoria pelo ID
         *     tags: [Categories]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da categoria
         *     responses:
         *       200:
         *         description: Categoria encontrada
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Category'
         */
        this.route.get("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const response = await this.categoryService.findById(userContext, id);

            return res.status(200).json(response);
        });

        /**
         * @swagger
         * /auth/categories:
         *   post:
         *     summary: Cria uma nova categoria
         *     tags: [Categories]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCategoryDto'
         *     responses:
         *       201:
         *         description: Categoria criada com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Category'
         */
        this.route.post("/", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const input = createCategorySchema.parse(req.body);
            const category = await this.categoryService.save(userContext, input);
            res.status(201).json(category);
        });

        /**
         * @swagger
         * /auth/categories/{id}:
         *   patch:
         *     summary: Atualiza dados de uma categoria
         *     tags: [Categories]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da categoria
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCategoryDto'
         *     responses:
         *       200:
         *         description: Categoria atualizada
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Category'
         */
        this.route.patch("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            const input = updateCategorySchema.parse(req.body);
            const category = await this.categoryService.update(userContext, id, input);
            res.status(200).json(category);
        });

        /**
         * @swagger
         * /auth/categories/{id}:
         *   delete:
         *     summary: Remove uma categoria
         *     tags: [Categories]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da categoria
         *     responses:
         *       204:
         *         description: Categoria removida com sucesso
         */
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const userContext = req.user!;
            const id = req.params.id;
            await this.categoryService.delete(userContext, id);
            res.status(204).send();
        });

        return this.route;
    }
}
