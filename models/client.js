import mongoose from "mongoose";

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
    default: "active" // o "archived", "deleted"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
    name: { type: String },
    cif: { type: String },
    sector: { type: String }
  }
}, {
  timestamps: true
});

const Client = mongoose.model("Client", ClientSchema);
export default Client;
