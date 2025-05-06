// Modelo de Cliente con Mongoose
import mongoose from "mongoose";

// Esquema de cliente que define sus campos
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nif: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  status: {
    type: String,
    default: "active" // puede ser "active", "archived", "deleted"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Referencia al usuario que lo creó
  },
  company: {
    name: { type: String },
    cif: { type: String },
    sector: { type: String }
  }
}, {
  timestamps: true // Guarda fechas de creación y modificación
});

// Modelo de Mongoose basado en el esquema
const Client = mongoose.model("Client", ClientSchema);

export default Client;
