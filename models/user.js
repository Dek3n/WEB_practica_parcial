import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Definimos el schema de usuarios
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "unverified"
    },
    role: {
        type: String,
        default: "user"
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    fullName: {
        type: String
    },
    phone: {
        type: String
    },
    company: {
        name: {
            type: String
        },
        sector: {
            type: String
        },
        country: {
            type: String
        },
        size: {
            type: String
        },
        logo: {
            type: String
        }
    }
}, { timestamps: true });

// Middleware: encriptar contraseña antes de guardar
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Exportamos el modelo de usuario
const User = mongoose.model("User", UserSchema);
export default User;
