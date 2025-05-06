import { check } from "express-validator";
import validateResults from "../utils/handleValidator.js";

// Validación para crear un cliente
const validatorCreateClient = [
  check("name").exists().notEmpty().withMessage("El nombre es obligatorio"),
  check("nif").exists().notEmpty().isLength({ min: 8 }).withMessage("El NIF debe tener al menos 8 caracteres"),
  check("email").optional().isEmail().withMessage("El correo debe ser válido"),
  check("phone").optional().isLength({ min: 9 }).withMessage("El teléfono debe tener al menos 9 caracteres"),
  (req, res, next) => validateResults(req, res, next)
];

// Validación para actualizar un cliente (todos los campos opcionales)
const validatorUpdateClient = [
  check("name").optional().notEmpty(),
  check("nif").optional().isLength({ min: 8 }),
  check("email").optional().isEmail(),
  check("phone").optional().isLength({ min: 9 }),
  (req, res, next) => validateResults(req, res, next)
];

export {
  validatorCreateClient,
  validatorUpdateClient
};
