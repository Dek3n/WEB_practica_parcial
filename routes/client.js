import express from "express";
import authMiddleware from "../middleware/session.js";
import {
  validatorCreateClient,
  validatorUpdateClient
} from "../validators/client.js";

import {
  createClientCtrl,
  updateClientCtrl,
  getClientsCtrl,
  getClientByIdCtrl,
  archiveClientCtrl,
  unarchiveClientCtrl,
  deleteClientCtrl
} from "../controllers/client.js";

const router = express.Router();

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Empresa ABC"
 *             email: "empresa@abc.com"
 *             phone: "+34 123456789"
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", authMiddleware, validatorCreateClient, createClientCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: "Nuevo nombre"
 *             email: "nuevo@email.com"
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 */
router.put("/:id", authMiddleware, validatorUpdateClient, updateClientCtrl);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", authMiddleware, getClientsCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Detalles del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", authMiddleware, getClientByIdCtrl);

/**
 * @swagger
 * /api/client/{id}/archive:
 *   patch:
 *     summary: Archivar cliente (soft delete)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente archivado correctamente
 */
router.patch("/:id/archive", authMiddleware, archiveClientCtrl);

/**
 * @swagger
 * /api/client/{id}/unarchive:
 *   patch:
 *     summary: Recuperar cliente archivado
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente recuperado correctamente
 */
router.patch("/:id/unarchive", authMiddleware, unarchiveClientCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar cliente permanentemente (hard delete)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 */
router.delete("/:id", authMiddleware, deleteClientCtrl);

export default router;
