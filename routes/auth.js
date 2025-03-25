const express = require("express");
const router = express.Router();

const { registerCtrl, validateEmailCodeCtrl } = require("../controllers/auth");
const { validatorRegister, validatorCode } = require("../validators/auth");
const authMiddleware = require("../middleware/session");

// Registro de usuario
router.post("/register", validatorRegister, registerCtrl);

// Validación del email
router.post("/validate", authMiddleware, validatorCode, validateEmailCodeCtrl);

module.exports = router;
