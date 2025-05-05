import express from "express";
import authMiddleware from "../middleware/session.js";
import { validatorCreateDeliveryNote } from "../validators/deliveryNote.js";
import {
  createDeliveryNoteCtrl,
  getDeliveryNotesCtrl,
  getDeliveryNoteByIdCtrl,
  updateDeliveryNoteCtrl,
  deleteDeliveryNoteCtrl,
  getDeliveryNotePDFCtrl,
  signDeliveryNoteCtrl
} from "../controllers/deliveryNote.js";
import upload from "../middleware/upload.js";

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

router.get("/pdf/:id", authMiddleware, getDeliveryNotePDFCtrl);

router.patch("/:id/sign", authMiddleware, upload.single("signature"), signDeliveryNoteCtrl)

export default router;
