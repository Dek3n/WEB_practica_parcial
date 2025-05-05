/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Endpoints para gestión de proyectos
 */

import express from "express";
import authMiddleware from "../middleware/session.js";
import {
  validatorCreateProject,
  validatorUpdateProject
} from "../validators/project.js";
import {
  createProjectCtrl,
  updateProjectCtrl,
  getProjectsCtrl,
  getProjectByIdCtrl,
  archiveProjectCtrl,
  unarchiveProjectCtrl,
  deleteProjectCtrl
} from "../controllers/project.js";

const router = express.Router();

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear nuevo proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Proyecto Web"
 *             description: "App móvil para empresa"
 *             client: "664b1d087f9f2a001f1bd356"
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 */
router.post("/", authMiddleware, validatorCreateProject, createProjectCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: "Proyecto actualizado"
 *             description: "Nueva descripción"
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 */
router.put("/:id", authMiddleware, validatorUpdateProject, updateProjectCtrl);

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Obtener todos los proyectos del usuario
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get("/", authMiddleware, getProjectsCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get("/:id", authMiddleware, getProjectByIdCtrl);

/**
 * @swagger
 * /api/project/{id}/archive:
 *   patch:
 *     summary: Archivar proyecto (soft delete)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a archivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto archivado correctamente
 */
router.patch("/:id/archive", authMiddleware, archiveProjectCtrl);

/**
 * @swagger
 * /api/project/{id}/unarchive:
 *   patch:
 *     summary: Recuperar proyecto archivado
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto recuperado correctamente
 */
router.patch("/:id/unarchive", authMiddleware, unarchiveProjectCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Eliminar proyecto permanentemente
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 */
router.delete("/:id", authMiddleware, deleteProjectCtrl);

export default router;
