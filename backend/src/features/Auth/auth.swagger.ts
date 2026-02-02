/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e Registro
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - companyName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@empresa.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *         name:
 *           type: string
 *           example: "Admin User"
 *         companyName:
 *           type: string
 *           example: "Nova Empresa S.A."
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@empresa.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *     RefreshTokenDto:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 */

/**
 * @swagger
 * /unauth/signup:
 *   post:
 *     summary: Cria conta de proprietário e empresa
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDto'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 */

/**
 * @swagger
 * /unauth/login:
 *   post:
 *     summary: Autentica usuário e retorna tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */

/**
 * @swagger
 * /unauth/refresh:
 *   post:
 *     summary: Atualiza o Access Token usando Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: Novos tokens gerados
 */

/**
 * @swagger
 * /unauth/logout:
 *   post:
 *     summary: Realiza logout invalidando o refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: Logout realizado
 */
