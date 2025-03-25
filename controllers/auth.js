const User = require ("../models/user") // Importamos el modelo de usuario
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcryptjs"); 
const { handleHttpError } = require("../utils/handleError");

// Función para generar un código aleatorio de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Comprobar si el usuario ya existe en la base de datos
        const userExists = await User.findOne({ email });
        if (userExists) {
            return handleHttpError(res, "EMAIL_ALREADY_EXISTS", 409);
        }

        // Generar código de verificación
        const verificationCode = generateCode();

        // Crear usuario en la base de datos
        const newUser = new User({
            email,
            password,
            code: verificationCode // Guardamos el código de verificación
        });

        await newUser.save(); // Guardamos el usuario en la base de datos

        // Generar token JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                email: newUser.email,
                status: newUser.status,
                role: newUser.role
            },
            token // Enviamos el token al usuario
        });

    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR_REGISTER_USER"); // Manejo de errores
    }
};

module.exports = { registerCtrl };