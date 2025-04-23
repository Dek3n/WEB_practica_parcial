import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
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
    default: "active"
  }
}, {
  timestamps: true
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
