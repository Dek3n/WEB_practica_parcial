import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/mongo.js";
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/client.js";
import projectRoutes from "./routes/project.js";
import deliveryNoteRoutes from "./routes/deliveryNote.js";
import path from "path";
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

app.use("/api/project", projectRoutes);

app.use("/api/deliverynote", deliveryNoteRoutes);

const __dirname = path.resolve();
app.use("/static", express.static(path.join(__dirname, "pdfs")));

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
