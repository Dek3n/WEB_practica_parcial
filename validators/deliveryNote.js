import { check } from "express-validator";
import validateResults from "../utils/handleValidator.js";

// Validación al crear un albarán
const validatorCreateDeliveryNote = [
  check("project")
    .exists().withMessage("El ID del proyecto es obligatorio")
    .isMongoId().withMessage("Debe ser un ID válido de MongoDB"),

  check("description")
    .exists().withMessage("La descripción es obligatoria")
    .notEmpty().withMessage("La descripción no puede estar vacía"),

  check("date")
    .exists().withMessage("La fecha es obligatoria")
    .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)"),

  (req, res, next) => validateResults(req, res, next)
];

export { validatorCreateDeliveryNote };
