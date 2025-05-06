import { validationResult } from "express-validator";

// Valida los resultados de las reglas definidas para cada ruta
const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw(); // Lanza error si hay problemas
    return next(); // Si no hay errores, sigue
  } catch (err) {
    res.status(400).json({
      errors: err.array()
    });
  }
};

export default validateResults;
