import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Web Práctica Final",
    version: "1.0.0",
    description: "Documentación de la API para la práctica final de Web Backend",
  },
  servers: [
    {
      url: "http://localhost:3001", // cambia si tu backend corre en otro puerto
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./models/*.js"], // Archivos donde Swagger buscará anotaciones
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
