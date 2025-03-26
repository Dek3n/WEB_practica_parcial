const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
    check("email").exists().notEmpty().isEmail().withMessage("Email inválido"), // Verifica que el email es válido
    check("password").exists().notEmpty().isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"), // Mínimo 8 caracteres
    (req, res, next) => validateResults(req, res, next) // Ejecuta la validación y maneja errores
];

const validatorCode = [
    check("code")
        .exists().withMessage("El código es obligatorio")
        .isLength({ min: 6, max: 6 }).withMessage("El código debe tener 6 dígitos")
        .isNumeric().withMessage("El código debe ser numérico"),
    (req, res, next) => validateResults(req, res, next)
];
const validatorLogin =[
    check("email").exists().notEmpty().isEmail().withMessage("Email inválido"),
    check("password").exists().notEmpty().withMessage("Contraseña requerida"),
    (req, res, next) => validateResults(req, res, next)
];
module.exports = { validatorRegister, validatorCode, validatorLogin };
