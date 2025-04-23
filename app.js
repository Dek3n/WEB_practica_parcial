import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/mongo.js";
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/client.js";
import projectRoutes from "./routes/project.js";

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

// Puerto
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});

dbConnect();
