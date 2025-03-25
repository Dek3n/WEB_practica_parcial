const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("email").exists().notEmpty().isEmail().withMessage("Email inválido"), // Verifica que el email es válido
    check("password").exists().notEmpty().isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"), // Mínimo 8 caracteres
    (req, res, next) => validateResults(req, res, next) // Ejecuta la validación y maneja errores
];

module.exports = { validatorRegister };
