/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Gerenciamento de Vendas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: ID do item
 *         productId:
 *           type: string
 *           description: ID do produto
 *         quantity:
 *           type: integer
 *           description: Quantidade
 *         unitPrice:
 *           type: integer
 *           description: Preço unitário (em centavos)
 *         subtotal:
 *           type: integer
 *           description: Subtotal (em centavos)
 *     Sale:
 *       type: object
 *       required:
 *         - total
 *         - paymentMethod
 *         - storeId
 *       properties:
 *         id:
 *           type: string
 *           description: ID da venda
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da venda
 *         total:
 *           type: integer
 *           description: Total da venda (em centavos)
 *         discount:
 *           type: integer
 *           description: Desconto aplicado (em centavos)
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, CREDIT, DEBIT, PIX]
 *           description: Método de pagamento
 *         status:
 *           type: string
 *           enum: [COMPLETED, CANCELED, REFUNDED, PENDING]
 *           description: Status da venda
 *         storeId:
 *           type: string
 *           description: ID da loja
 *         userId:
 *           type: string
 *           description: ID do operador
 *         customerId:
 *           type: string
 *           description: ID do cliente (opcional)
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateSaleItemDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         quantity:
 *           type: integer
 *           example: 2
 *     CreateSaleDto:
 *       type: object
 *       required:
 *         - storeId
 *         - paymentMethod
 *         - items
 *       properties:
 *         storeId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         customerId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         discount:
 *           type: integer
 *           example: 500
 *           description: Desconto em centavos
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, CREDIT, DEBIT, PIX]
 *           example: "PIX"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateSaleItemDto'
 */

/**
 * @swagger
 * /auth/sales:
 *   get:
 *     summary: Lista vendas com paginação e filtros
 *     tags: [Sales]
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
 *         description: "Filtro (ex: status=COMPLETED, paymentMethod=PIX)"
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
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 total:
 *                   type: integer
 */

/**
 * @swagger
 * /auth/sales/{id}:
 *   get:
 *     summary: Busca uma venda pelo ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Venda não encontrada
 */

/**
 * @swagger
 * /auth/sales:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleDto'
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 */

/**
 * @swagger
 * /auth/sales/{id}/cancel:
 *   post:
 *     summary: Cancela uma venda
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Venda já cancelada ou reembolsada
 *       404:
 *         description: Venda não encontrada
 */

/**
 * @swagger
 * /auth/sales/{id}/refund:
 *   post:
 *     summary: Estorna uma venda
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda estornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Venda não pode ser estornada (já reembolsada, cancelada ou pendente)
 *       404:
 *         description: Venda não encontrada
 */
