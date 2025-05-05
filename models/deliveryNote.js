import mongoose from "mongoose";

const DeliveryNoteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    signed: {
      type: Boolean,
      default: false,
    },
    signatureUrl: {
      type: String // Aquí guardamos el hash/IPFS o URL de la firma
    },
    pdfUrl: {
      type: String // Aquí se guarda la URL del PDF generado (simulado)
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DeliveryNote", DeliveryNoteSchema);
