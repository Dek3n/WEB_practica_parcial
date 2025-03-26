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
        console.log("Código de verificación generado:", verificationCode);


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
const validateEmailCodeCtrl = async (req, res) => {
    try {
        const { code } = req.body;       // Recogemos el código enviado en la petición
        const user = req.user;           // El middleware authMiddleware ya habrá cargado el usuario

        if (user.status === "verified") {
            return res.status(400).json({ message: "Usuario ya validado" });
        }

        if (user.maxAttempts <= 0) {
            return handleHttpError(res, "MAX_ATTEMPTS_REACHED", 403);
        }

        if (user.code === code) {
            user.status = "verified";
            await user.save();
            return res.json({ message: "Email verificado correctamente" });
        } else {
            user.maxAttempts -= 1;
            await user.save();
            return handleHttpError(res, "INVALID_CODE", 401);
        }

    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_VALIDATING_CODE");
    }
};
const loginCtrl = async (req, res) =>{
    try{
        const{email, password} =req.body;
    
        const user = await User.findOne({email});
        if(!user){
            return handleHttpError(res,"EMAIL_NO_ENCONTRADO", 404);
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if(!isCorrect){
            return handleHttpError(res, "USUARIO_INVALIDO", 401);

        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: "2h"});

        res.json({
            message:"Login exitoso",
            user:{
                email: user.email,
                status: user.status,
                role: user.role
            }, 
            token
        });
    }catch (err){
        console.log(err);
        handleHttpError(res,"ERROR_LOGIN");
    }
};

module.exports = { registerCtrl, validateEmailCodeCtrl, loginCtrl};