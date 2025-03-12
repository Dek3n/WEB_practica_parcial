const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

//defino el schema de users
const UserSchema = new mongoose.Schema(
    {
        //email
        email:{
            type:String,
            unique: true,
            required: true 
        },
        //contraseña
        password: { 
            type: String, 
            required: true 
        },
        //estado de verificacion
        status: { 
            type: String, 
            enum: ["pending", "verified"], 
            default: "pending" 
        },
        //Código de verificacion
        verificationCode: {
            type: String 
        },
         // Intentos disponibles para verificar email
        attempts:{
            type:Number,
            default: 3
        }
        
    }
);

// Exportamos el modelo de usuario
module.exports = mongoose.model("User", UserSchema);