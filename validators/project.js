import {check} from "express-validator";
import validateResults from "../utils/handleValidator.js";

// Validación para crear un proyecto
const validatorCreateProject = [
    check("name").exists().notEmpty().withMessage("El nombre es obligatorio"),
    check("client").exists().notEmpty().isMongoId().withMessage("ID de cliente inválido"),
    check("description").optional(),
    (req, res,next)=>validateResults(req, res, next)
];

// Validación para actualizar un proyecto
const validatorUpdateProject = [
    check("name").optional().notEmpty(),
    check("client").optional().isMongoId(),
    check("description").optional(),
    (req, res, next) => validateResults(req, res, next)
];

export{
    validatorCreateProject,
    validatorUpdateProject
}