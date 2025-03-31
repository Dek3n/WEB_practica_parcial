import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
