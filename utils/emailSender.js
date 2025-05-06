import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Carga variables de entorno (.env)
dotenv.config();

// Configura el transporte de correo con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Envía el correo con el código de recuperación
const sendRecoveryEmail = async (to, code) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperación de contraseña",
    html: `<p>Tu código de recuperación es: <strong>${code}</strong></p>`
  };

  await transporter.sendMail(mailOptions);
};

export default sendRecoveryEmail;
