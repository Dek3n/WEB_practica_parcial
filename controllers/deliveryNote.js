import DeliveryNote from "../models/deliveryNote.js";
import { handleHttpError } from "../utils/handleError.js";

// Crear un nuevo albarán
const createDeliveryNoteCtrl = async (req, res) => {
  try {
    const user = req.user; // Obtenido desde el middleware del token
    const { project, description, date } = req.body;

    const note = await DeliveryNote.create({
      project,
      description,
      date,
      user: user._id,
    });

    res.status(201).json({ message: "Albarán creado", note });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_CREATING_DELIVERY_NOTE");
  }
};

// Obtener todos los albaranes visibles (activos y archivados, no los eliminados)
const getDeliveryNotesCtrl = async (req, res) => {
  try {
    const user = req.user;
    const notes = await DeliveryNote.find({
      $or: [
        { user: user._id },
        { "company.name": user.company?.name },
      ],
      status: { $ne: "deleted" },
    }).populate("project");

    res.json({ notes });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTES");
  }
};

// Obtener un albarán por ID
const getDeliveryNoteByIdCtrl = async (req, res) => {
  try {
    const note = await DeliveryNote.findById(req.params.id).populate("project");
    if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
    res.json({ note });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTE");
  }
};

// Actualizar un albarán
const updateDeliveryNoteCtrl = async (req, res) => {
  try {
    const note = await DeliveryNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Albarán actualizado", note });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPDATING_DELIVERY_NOTE");
  }
};

// Eliminar un albarán (solo si no está firmado)
const deleteDeliveryNoteCtrl = async (req, res) => {
  try {
    const note = await DeliveryNote.findById(req.params.id);
    if (note.signed) {
      return handleHttpError(res, "NO_DELETE_SIGNED_NOTE", 403);
    }
    await DeliveryNote.findByIdAndDelete(req.params.id);
    res.json({ message: "Albarán eliminado" });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_DELETING_DELIVERY_NOTE");
  }
};

export {
  createDeliveryNoteCtrl,
  getDeliveryNotesCtrl,
  getDeliveryNoteByIdCtrl,
  updateDeliveryNoteCtrl,
  deleteDeliveryNoteCtrl
};
