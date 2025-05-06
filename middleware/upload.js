// Middleware para manejar subida de archivos
import multer from "multer";

// Almacenamiento en memoria (no en disco)
const storage = multer.memoryStorage();

// Configuración de Multer con ese almacenamiento
const upload = multer({ storage });

export default upload;
