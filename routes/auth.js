/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro, login, perfil, recuperación y más
 */

import express from "express";
import {
  registerCtrl,
  validateEmailCodeCtrl,
  loginCtrl,
  updateProfileCtrl,
  uploadLogoCtrl,
  getProfileCtrl,
  deleteUserCtrl,
  recoverPasswordCtrl,
  inviteUserCtrl
} from "../controllers/auth.js";

import {
  validatorRegister,
  validatorCode,
  validatorLogin
} from "../validators/auth.js";

import authMiddleware from "../middleware/session.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "usuario@correo.com"
 *             password: "miPassword123"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post("/register", validatorRegister, registerCtrl);

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validar código de verificación enviado por email
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             code: "123456"
 *     responses:
 *       200:
 *         description: Código validado correctamente
 */
router.post("/validate", authMiddleware, validatorCode, validateEmailCodeCtrl);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "usuario@correo.com"
 *             password: "miPassword123"
 *     responses:
 *       200:
 *         description: Login exitoso y token devuelto
 */
router.post("/login", validatorLogin, loginCtrl);

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Actualizar datos del perfil (onboarding)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             fullName: "Juan Pérez"
 *             phone: "+34 123 456 789"
 *             company:
 *               name: "Mi Empresa"
 *               sector: "Software"
 *               country: "España"
 *               size: "10-50"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 */
router.patch("/profile", authMiddleware, updateProfileCtrl);

/**
 * @swagger
 * /api/auth/logo:
 *   patch:
 *     summary: Subir logo de la empresa (archivo)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo subido correctamente
 */
router.patch("/logo", authMiddleware, upload.single("logo"), uploadLogoCtrl);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario desde el token
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 */
router.get("/me", authMiddleware, getProfileCtrl);

/**
 * @swagger
 * /api/auth/me:
 *   delete:
 *     summary: Eliminar cuenta de usuario (hard o soft según query ?soft=true)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Eliminar de forma lógica si es true
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete("/me", authMiddleware, deleteUserCtrl);

/**
 * @swagger
 * /api/auth/recover-password:
 *   post:
 *     summary: Enviar email para recuperación de contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             email: "usuario@correo.com"
 *     responses:
 *       200:
 *         description: Instrucciones de recuperación enviadas
 */
router.post("/recover-password", recoverPasswordCtrl);

/**
 * @swagger
 * /api/auth/invite:
 *   post:
 *     summary: Invitar a otro usuario (rol guest)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             email: "nuevo@empresa.com"
 *     responses:
 *       200:
 *         description: Invitación enviada
 */
router.post("/invite", authMiddleware, inviteUserCtrl);

export default router;
