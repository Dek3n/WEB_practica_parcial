// Importa el modelo de Cliente desde Mongoose
import Client from "../models/client.js";

// Importa función utilitaria para manejar errores HTTP
import { handleHttpError } from "../utils/handleError.js";

// Controlador para crear un nuevo cliente
const createClientCtrl = async (req, res) => {
  try {
    const user = req.user; // Usuario autenticado
    const { name, nif, address, phone, email } = req.body; // Datos del nuevo cliente

    // Verifica si ya existe un cliente con el mismo NIF y usuario
    const existing = await Client.findOne({ nif, user: user._id });
    if (existing) {
      return handleHttpError(res, "CLIENT_ALREADY_EXISTS", 409);
    }

    // Crea el cliente y lo asocia al usuario actual
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

// Controlador para actualizar los datos de un cliente
const updateClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Cliente actualizado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPDATING_CLIENT");
  }
};

// Controlador para obtener todos los clientes del usuario o su empresa
const getClientsCtrl = async (req, res) => {
  try {
    const user = req.user;

    // Filtra los clientes activos que pertenecen al usuario o a su empresa
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

// Controlador para obtener un cliente específico por su ID
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

// Archiva un cliente sin borrarlo de la base de datos (estado: "archived")
const archiveClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );
    res.json({ message: "Cliente archivado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_ARCHIVING_CLIENT");
  }
};

// Reactiva un cliente archivado (estado: "active")
const unarchiveClientCtrl = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    res.json({ message: "Cliente desarchivado", client });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UNARCHIVING_CLIENT");
  }
};

// Elimina completamente un cliente de la base de datos
const deleteClientCtrl = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_DELETING_CLIENT");
  }
};

// Exporta todos los controladores del cliente
export {
  createClientCtrl,
  updateClientCtrl,
  getClientsCtrl,
  getClientByIdCtrl,
  archiveClientCtrl,
  unarchiveClientCtrl,
  deleteClientCtrl
};
