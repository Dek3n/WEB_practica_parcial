// Importa la librería Mongoose para trabajar con MongoDB
import mongoose from "mongoose";

// Define el esquema de un albarán (DeliveryNote)
const DeliveryNoteSchema = new mongoose.Schema(
  {
    // Referencia al proyecto relacionado con el albarán
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // Descripción del trabajo realizado o entregado
    description: {
      type: String,
      required: true,
    },
    // Fecha del albarán
    date: {
      type: Date,
      required: true,
    },
    // Indica si el albarán está firmado o no
    signed: {
      type: Boolean,
      default: false,
    },
    // URL o nombre de archivo de la firma del cliente
    signatureUrl: {
      type: String // Guarda el nombre del archivo o ruta
    },
    // Ruta o nombre del PDF generado del albarán
    pdfUrl: {
      type: String // Simula la ruta del PDF generado
    },
    // Estado del albarán (activo, archivado, eliminado)
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    // Usuario que generó el albarán
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true, // Guarda automáticamente fecha de creación y modificación
  }
);

// Exporta el modelo de Mongoose
export default mongoose.model("DeliveryNote", DeliveryNoteSchema);
