export async function setupSwagger(app: any) {
    const swaggerUi = (await import("swagger-ui-express")).default;
    const { swaggerSpec } = await import("./swagger.js");

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
