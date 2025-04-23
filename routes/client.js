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

// Crear cliente
router.post("/", authMiddleware, validatorCreateClient, createClientCtrl);

// Editar cliente
router.put("/:id", authMiddleware, validatorUpdateClient, updateClientCtrl);

// Obtener todos
router.get("/", authMiddleware, getClientsCtrl);

// Obtener uno
router.get("/:id", authMiddleware, getClientByIdCtrl);

// Archivar (soft delete)
router.patch("/:id/archive", authMiddleware, archiveClientCtrl);

// Recuperar (unarchive)
router.patch("/:id/unarchive", authMiddleware, unarchiveClientCtrl);

// Eliminar cliente (hard delete)
router.delete("/:id", authMiddleware, deleteClientCtrl);

export default router;
