// Importa el framework Express para crear el servidor
import express from "express";
// Habilita CORS para permitir peticiones desde otros orígenes
import cors from "cors";
// Carga variables de entorno desde el archivo .env
import dotenv from "dotenv";
// Conexión a la base de datos MongoDB
import dbConnect from "./config/mongo.js";
// Importa las rutas para autenticación
import authRoutes from "./routes/auth.js";
// Importa las rutas relacionadas con clientes
import clientRoutes from "./routes/client.js";
// Importa las rutas relacionadas con proyectos
import projectRoutes from "./routes/project.js";
// Importa las rutas relacionadas con albaranes (delivery notes)
import deliveryNoteRoutes from "./routes/deliveryNote.js";
// Importa el módulo path para manipular rutas de archivos
import path from "path";
// Documentación Swagger (API REST docs)
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Aquí montamos las rutas de autenticación
app.use("/api/auth", authRoutes);

//NUEVA ruta de clientes
app.use("/api/client", clientRoutes);

// Ruta base para operaciones sobre proyectos
app.use("/api/project", projectRoutes);

// Ruta base para operaciones sobre albaranes
app.use("/api/deliverynote", deliveryNoteRoutes);

// Define el directorio donde se servirán archivos estáticos (PDFs generados)
const __dirname = path.resolve();
app.use("/static", express.static(path.join(__dirname, "pdfs")));

// Ruta para visualizar la documentación Swagger de la API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port);
  });
}

dbConnect();

export default app;
