import DeliveryNote from "../models/deliveryNote.js";
import { handleHttpError } from "../utils/handleError.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

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
      if (!note) {
        return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
      }
  
      if (note.signed) {
        return handleHttpError(res, "NO_DELETE_SIGNED_NOTE", 403);
      }
  
      await DeliveryNote.findByIdAndDelete(req.params.id);
      res.json({ message: "Albarán eliminado correctamente" });
    } catch (err) {
      console.log(err);
      handleHttpError(res, "ERROR_DELETING_DELIVERY_NOTE");
    }
  };
  
// Generar PDF de un albarán
const getDeliveryNotePDFCtrl = async (req, res) => {
    try {
      const note = await DeliveryNote.findById(req.params.id)
        .populate({
          path: "project",
          populate: { path: "client" }
        })
        .populate("user");
  
      if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
  
      const doc = new PDFDocument();
  
      // Configuramos respuesta HTTP para enviar PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=albaran_${note._id}.pdf`);
  
      doc.pipe(res);
  
      // Contenido del PDF
      doc.fontSize(20).text("ALBARÁN DE ENTREGA", { align: "center" }).moveDown();
  
      doc.fontSize(12).text(`Proyecto: ${note.project.name}`);
      doc.text(`Cliente: ${note.project.client.name}`);
      doc.text(`Dirección: ${note.project.client.address}`);
      doc.text(`Fecha: ${note.date.toLocaleDateString()}`);
      doc.text(`Descripción: ${note.description}`);
      doc.text(`Creado por: ${note.user.fullName || note.user.email}`);
  
      // Si tiene firma
      if (note.signed && note.signatureUrl) {
        doc.moveDown().text("FIRMADO ✅");
        doc.image(note.signatureUrl, { width: 150 });
      } else {
        doc.moveDown().text("NO FIRMADO ❌");
      }
  
      doc.end();
    } catch (err) {
      console.log(err);
      handleHttpError(res, "ERROR_GENERATING_PDF");
    }
  };
  const signDeliveryNoteCtrl = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return handleHttpError(res, "FIRMA_NO_ENVIADA", 400);
      }
  
      const note = await DeliveryNote.findById(req.params.id).populate("project");
  
      if (!note) return handleHttpError(res, "NOT_FOUND", 404);
  
      // Simular subida de firma
      const fakeSignatureUrl = `https://fake-ipfs.io/${file.originalname}`;
      note.signed = true;
      note.signatureUrl = fakeSignatureUrl;
  
      // ➕ Generar PDF
      const pdfDir = path.join(process.cwd(), "pdfs");
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir); // crea la carpeta si no existe
  
      const pdfPath = path.join(pdfDir, `albaran_${note._id}.pdf`);
      const doc = new PDFDocument();
  
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text("ALBARÁN DE ENTREGA", { align: "center" }).moveDown();
      doc.fontSize(12).text(`Proyecto: ${note.project.name}`);
      doc.text(`Descripción: ${note.description}`);
      doc.text(`Fecha: ${note.date.toLocaleDateString()}`);
      doc.text(`Firmado ✅`);
      doc.end();
  
      // ➕ Guardar la URL del PDF
      note.pdfUrl = `http://localhost:3001/static/albaran_${note._id}.pdf`;
  
      await note.save();
  
      res.json({ message: "Albarán firmado y PDF generado", note });
    } catch (err) {
      console.log(err);
      handleHttpError(res, "ERROR_SIGNING_DELIVERY_NOTE");
    }
  };

  // Simula la generación del PDF y lo guarda localmente
const generateAndUploadPDF = async (note) => {
    const doc = new PDFDocument();
    const filePath = `./pdfs/albaran_${note._id}.pdf`;
  
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(16).text("ALBARÁN DE ENTREGA", { align: "center" }).moveDown();
    doc.text(`Proyecto: ${note.project.name}`);
    doc.text(`Descripción: ${note.description}`);
    doc.text(`Fecha: ${note.date.toLocaleDateString()}`);
    doc.text(`Firmado ✅`);
    doc.end();
  
    // Simulamos una "URL" pública
    return `http://localhost:3001/static/albaran_${note._id}.pdf`;
  };

export {
  createDeliveryNoteCtrl,
  getDeliveryNotesCtrl,
  getDeliveryNoteByIdCtrl,
  updateDeliveryNoteCtrl,
  deleteDeliveryNoteCtrl,
  getDeliveryNotePDFCtrl,
  signDeliveryNoteCtrl 
};
