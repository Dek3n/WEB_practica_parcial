import express from "express";
import authMiddleware from "../middleware/session.js";
import {validatorCreateProject, validatorUpdateProject} from "../validators/project.js";
import {createProjectCtrl,updateProjectCtrl,getProjectsCtrl,getProjectByIdCtrl,archiveProjectCtrl,unarchiveProjectCtrl,deleteProjectCtrl} from "../controllers/project.js";


const router = express.Router();

// Crear proyecto
router.post("/", authMiddleware, validatorCreateProject, createProjectCtrl);

// Editar proyecto
router.put("/:id", authMiddleware, validatorUpdateProject, updateProjectCtrl);

// Obtener todos los proyectos
router.get("/", authMiddleware, getProjectsCtrl);

// Obtener un proyecto por ID
router.get("/:id", authMiddleware, getProjectByIdCtrl);

// Archivar (soft delete)
router.patch("/:id/archive", authMiddleware, archiveProjectCtrl);

// Recuperar (unarchive)
router.patch("/:id/unarchive", authMiddleware, unarchiveProjectCtrl);

// Eliminar proyecto (hard delete)
router.delete("/:id", authMiddleware, deleteProjectCtrl);

export default router;