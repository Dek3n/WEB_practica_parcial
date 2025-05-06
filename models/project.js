// Modelo de Proyecto
import mongoose from "mongoose";

// Esquema que representa los datos de un proyecto
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Relación con cliente
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
    name: String,
    cif: String,
    sector: String
  },
  status: {
    type: String,
    default: "active" // puede cambiar a "archived"
  }
}, {
  timestamps: true // Guarda fecha de creación y actualización
});

// Define el modelo de Mongoose
const Project = mongoose.model("Project", ProjectSchema);

export default Project;
