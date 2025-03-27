import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { handleHttpError } from "../utils/handleError.js";
import ipfsClient from "../config/ipfs.js";

// Función para generar un código aleatorio de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return handleHttpError(res, "EMAIL_ALREADY_EXISTS", 409);
    }

    const verificationCode = generateCode();
    console.log("Código de verificación generado:", verificationCode);

    const newUser = new User({
      email,
      password,
      code: verificationCode,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: newUser.email,
        status: newUser.status,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_REGISTER_USER");
  }
};

const validateEmailCodeCtrl = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user;

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

const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return handleHttpError(res, "EMAIL_NO_ENCONTRADO", 404);
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return handleHttpError(res, "USUARIO_INVALIDO", 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Login exitoso",
      user: {
        email: user.email,
        status: user.status,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_LOGIN");
  }
};

const updateProfileCtrl = async (req, res) => {
  try {
    const user = req.user;
    const { fullName, phone, company } = req.body;

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    if (company) {
      user.company = {
        ...user.company,
        ...company,
      };
    }

    await user.save();

    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_ACTUALIZAR_PERFIL");
  }
};

const uploadLogoCtrl = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;

    if (!file) {
      return handleHttpError(res, "NO_FILE_UPLOADED", 400);
    }

    const result = await ipfsClient.add(file.buffer);
    const ipfsHash = result.path;

    user.company = {
      ...user.company,
      logo: ipfsHash,
    };

    await user.save();

    res.json({
      message: "Logo subido correctamente",
      ipfsHash,
    });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPLOADING_LOGO");
  }
};

const getProfileCtrl = async (req, res) =>{
  try{
    const user = req.user;

    res.json({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      role: user.role,
      company: user.company
    });
  }catch(err){
    console.log(err);
    handleHttpError(err, "ERROR_GETTING PROFILE");
  }
};

export { registerCtrl, validateEmailCodeCtrl, loginCtrl, updateProfileCtrl, uploadLogoCtrl, getProfileCtrl};
