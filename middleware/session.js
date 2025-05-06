// Middleware de autenticación basado en JWT
import jwt from "jsonwebtoken"; // Importa JSON Web Token
import User from "../models/user.js"; // Modelo de usuario
import { handleHttpError } from "../utils/handleError.js"; // Función para manejar errores HTTP

// Middleware para verificar si el usuario está autenticado
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Cabecera Authorization
    if (!authHeader) return handleHttpError(res, "NO_TOKEN", 401); // Si no hay token, error 401

    const token = authHeader.split(" ").pop(); // Extrae el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token

    const user = await User.findById(decoded.id); // Busca el usuario por el ID del token
    if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404); // Si no existe, error

    req.user = user; // Asigna el usuario a la request
    next(); // Continúa al siguiente middleware
  } catch (err) {
    console.log(err);
    handleHttpError(res, "NOT_AUTHENTICATED", 401); // Error de autenticación
  }
};

export default authMiddleware;
