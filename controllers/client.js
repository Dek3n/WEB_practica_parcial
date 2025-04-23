import Client from "../models/client.js";
import { handleHttpError } from "../utils/handleError.js";

const createClientCtrl = async (req, res) => {
  try {
    const user = req.user;
    const { name, nif, address, phone, email } = req.body;

    const existing = await Client.findOne({ nif, user: user._id });
    if (existing) {
      return handleHttpError(res, "CLIENT_ALREADY_EXISTS", 409);
    }

    const client = await Client.create({
      name,
      nif,
      address,
      phone,
      email,
      user: user._id,
      company: user.company
    });

    res.status(201).json({ message: "Cliente creado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_CREATING_CLIENT");
  }
};

const updateClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Cliente actualizado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPDATING_CLIENT");
  }
};

const getClientsCtrl = async (req, res) => {
  try {
    const user = req.user;
    const clients = await Client.find({
      $or: [
        { user: user._id },
        { "company.name": user.company.name }
      ],
      status: { $ne: "archived" }
    });
    res.json({ clients });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_CLIENTS");
  }
};

const getClientByIdCtrl = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
    res.json({ client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_CLIENT");
  }
};

const archiveClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
    res.json({ message: "Cliente archivado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_ARCHIVING_CLIENT");
  }
};

const unarchiveClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    res.json({ message: "Cliente recuperado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UNARCHIVING_CLIENT");
  }
};

const deleteClientCtrl = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado permanentemente" });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_DELETING_CLIENT");
  }
};

export {
  createClientCtrl,
  updateClientCtrl,
  getClientsCtrl,
  getClientByIdCtrl,
  archiveClientCtrl,
  unarchiveClientCtrl,
  deleteClientCtrl
};
