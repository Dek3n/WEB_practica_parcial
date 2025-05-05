import express from "express";
import authMiddleware from "../middleware/session.js";
import { validatorCreateDeliveryNote } from "../validators/deliveryNote.js";
import {
  createDeliveryNoteCtrl,
  getDeliveryNotesCtrl,
  getDeliveryNoteByIdCtrl,
  updateDeliveryNoteCtrl,
  deleteDeliveryNoteCtrl
} from "../controllers/deliveryNote.js";

const router = express.Router();

// Crear albarán
router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNoteCtrl);

// Obtener todos los albaranes
router.get("/", authMiddleware, getDeliveryNotesCtrl);

// Obtener albarán por ID
router.get("/:id", authMiddleware, getDeliveryNoteByIdCtrl);

// Actualizar albarán
router.patch("/:id", authMiddleware, updateDeliveryNoteCtrl);

// Eliminar albarán (si no está firmado)
router.delete("/:id", authMiddleware, deleteDeliveryNoteCtrl);

export default router;
