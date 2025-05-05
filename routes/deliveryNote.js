/**
 * @swagger
 * tags:
 *   name: Albaranes
 *   description: Endpoints para gestionar albaranes (delivery notes)
 */

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

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un nuevo albarán
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             project: "ID_DEL_PROYECTO"
 *             description: "Entrega de material"
 *             date: "2024-06-01"
 *     responses:
 *       201:
 *         description: Albarán creado correctamente
 */
const router = express.Router();
router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNoteCtrl);

/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Obtener todos los albaranes visibles
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 */
router.get("/", authMiddleware, getDeliveryNotesCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán por su ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del albarán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       404:
 *         description: No se encontró el albarán
 */
router.get("/:id", authMiddleware, getDeliveryNoteByIdCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   patch:
 *     summary: Actualizar un albarán
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del albarán a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             description: "Entrega corregida"
 *             date: "2024-06-02"
 *     responses:
 *       200:
 *         description: Albarán actualizado correctamente
 */
router.patch("/:id", authMiddleware, updateDeliveryNoteCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Eliminar un albarán si no está firmado
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del albarán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán eliminado
 *       403:
 *         description: No se puede eliminar un albarán firmado
 */
router.delete("/:id", authMiddleware, deleteDeliveryNoteCtrl);

/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     summary: Descargar PDF del albarán
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del albarán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/pdf/:id", authMiddleware, getDeliveryNotePDFCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}/sign:
 *   patch:
 *     summary: Firmar un albarán con una imagen
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Albarán firmado correctamente
 */
router.patch("/:id/sign", authMiddleware, upload.single("signature"), signDeliveryNoteCtrl);

export default router;
