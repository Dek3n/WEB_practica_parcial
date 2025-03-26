import express from "express";
import {
  registerCtrl,
  validateEmailCodeCtrl,
  loginCtrl,
  updateProfileCtrl,
  uploadLogoCtrl
} from "../controllers/auth.js";

import {
  validatorRegister,
  validatorCode,
  validatorLogin
} from "../validators/auth.js";

import authMiddleware from "../middleware/session.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Registro de usuario
router.post("/register", validatorRegister, registerCtrl);

// Validación del email
router.post("/validate", authMiddleware, validatorCode, validateEmailCodeCtrl);

// Login
router.post("/login", validatorLogin, loginCtrl);

// Actualizar perfil
router.patch("/profile", authMiddleware, updateProfileCtrl);

// Subida de logo
router.patch("/logo", authMiddleware, upload.single("logo"), uploadLogoCtrl);

export default router;
