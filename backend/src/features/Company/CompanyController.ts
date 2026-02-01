import { Router } from "express";
import { Controller } from "../../core/Controller.js";
import { CompanyService } from "./CompanyService.js";
import { Request, Response } from "express";
import { SearchInput } from "../../core/interface/IRepository.js";
import { CreateCompanyDto, UpdateCompanyDto } from "./dtos/index.js";

export class CompanyController extends Controller {
    private companyService: CompanyService;

    constructor(companyService: CompanyService) {
        super();
        this.companyService = companyService;
    }

    /**
     * @swagger
     * tags:
     *   name: Companies
     *   description: Gerenciamento de Empresas
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Company:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - cnpj
     *         - phone
     *       properties:
     *         id:
     *           type: string
     *           description: ID da empresa
     *         name:
     *           type: string
     *           description: Nome da empresa
     *         email:
     *           type: string
     *           description: Email de contato
     *         cnpj:
     *           type: string
     *           description: CNPJ da empresa
     *         phone:
     *           type: string
     *           description: Telefone de contato
     *         address:
     *           type: string
     *           description: Endereço completo
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *     CreateCompanyDto:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - cnpj
     *         - phone
     *       properties:
     *         name:
     *           type: string
     *           example: "Minha Empresa LTDA"
     *         email:
     *           type: string
     *           example: "contato@empresa.com"
     *         cnpj:
     *           type: string
     *           example: "12345678000199"
     *         phone:
     *           type: string
     *           example: "11999999999"
     *         address:
     *           type: string
     *           example: "Rua Exemplo, 123"
     */

    handle(): Router {
        /**
         * @swagger
         * /auth/companies:
         *   get:
         *     summary: Lista empresas com paginação e filtros
         *     tags: [Companies]
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
         *         description: Texto para busca
         *     responses:
         *       200:
         *         description: Lista de empresas
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Company'
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
            };

            const result = await this.companyService.findAll(params);

            return res.status(200).json(result);
        });

        /**
         * @swagger
         * /auth/companies/{id}:
         *   get:
         *     summary: Busca uma empresa pelo ID
         *     tags: [Companies]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da empresa
         *     responses:
         *       200:
         *         description: Dados da empresa
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Company'
         */
        this.route.get("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const response = await this.companyService.findById(id);

            return res.status(200).json(response);
        });

        /**
         * @swagger
         * /auth/companies:
         *   post:
         *     summary: Cria uma nova empresa
         *     tags: [Companies]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCompanyDto'
         *     responses:
         *       201:
         *         description: Empresa criada com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Company'
         */
        this.route.post("/", async (req: Request, res: Response) => {
            const input: CreateCompanyDto = {
                name: req.body.name,
                email: req.body.email,
                cnpj: req.body.cnpj,
                phone: req.body.phone,
                address: req.body.address,
            };
            const company = await this.companyService.save(input);
            res.status(201).json(company);
        });

        /**
         * @swagger
         * /auth/companies/{id}:
         *   patch:
         *     summary: Atualiza dados de uma empresa
         *     tags: [Companies]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da empresa
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateCompanyDto'
         *     responses:
         *       200:
         *         description: Empresa atualizada
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Company'
         */

        this.route.patch("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const input: UpdateCompanyDto = req.body;
            const company = await this.companyService.update(id, input);
            res.status(200).json(company);
        });

        /**
         * @swagger
         * /auth/companies/{id}:
         *   delete:
         *     summary: Remove uma empresa
         *     tags: [Companies]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: ID da empresa
         *     responses:
         *       204:
         *         description: Empresa removida com sucesso
         */
        this.route.delete("/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            await this.companyService.delete(id);
            res.status(204).send();
        });

        return this.route;
    }
}
