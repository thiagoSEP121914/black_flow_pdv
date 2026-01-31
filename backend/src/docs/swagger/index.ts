import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

export function setupSwagger(app: any) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
