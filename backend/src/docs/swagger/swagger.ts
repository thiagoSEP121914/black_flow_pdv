import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Black Flow PDV API",
            version: "1.0.0",
            description: "API de Ponto de Venda",
        },
    },
    apis: ["./src/features/**/*.ts"],
});
