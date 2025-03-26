const express = require("express");
const router = express.Router();

const { registerCtrl, validateEmailCodeCtrl, loginCtrl, updateProfileCtrl } = require("../controllers/auth");
const { validatorRegister, validatorCode,validatorLogin } = require("../validators/auth");
const authMiddleware = require("../middleware/session");

// Registro de usuario
router.post("/register", validatorRegister, registerCtrl);

// Validación del email
router.post("/validate", authMiddleware, validatorCode, validateEmailCodeCtrl);

router.post("/login", validatorLogin, loginCtrl);

//Actualizar el perfil
router.patch("/profile", authMiddleware, updateProfileCtrl);

module.exports = router;
