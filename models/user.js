const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

//defino el schema de users
const UserSchema = new mongoose.Schema({
    //email
    email:{ 
        type: String, 
        unique: true, 
        required: true 
    }, 
    //contraseña
    password:{ 
        type: String, 
        required: true 
    }, 
    // Código de verificación de 6 dígitos
    code:{
        type: String, required: true
    }, 
    //estado de verificacion
    status:{ 
        type: String, 
        default: "unverified" 
    },
    // Rol por defecto "user"
    role:{ 
        type: String, 
        default: "user" 
    }, 
    // Número de intentos para validar email
    maxAttempts:{ 
        type: Number, 
        default: 3 
    },
    //Nombre completo
    fullName:{
        type: String
    },
    //Telefono
    phone:{
        type: String
    },
    //Empresa
    company:{
        name:{
            type: String
        },
        sector:{
            type: String
        },
        country:{
            type: String
        },
        size:{
            type: String   
        } 
    }
}, { timestamps: true });

// Middleware: antes de guardar el usuario, encriptamos la contraseña
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Si la contraseña no se ha modificado, seguimos
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); // Encriptamos la contraseña
    next();
});

// Exportamos el modelo de usuario
module.exports = mongoose.model("User", UserSchema);