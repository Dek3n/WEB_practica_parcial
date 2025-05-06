// Importa el modelo de Proyecto
import Project from "../models/project.js";

// Función para manejar errores HTTP
import { handleHttpError } from "../utils/handleError.js";

// Crea un nuevo proyecto
const createProjectCtrl = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, client } = req.body;

    // Crea el proyecto asociándolo al usuario y cliente indicados
    const project = await Project.create({
      name,
      description,
      client,
      user: user._id,
      company: user.company
    });

    res.status(201).json({ message: "Proyecto creado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_CREATING_PROJECT");
  }
};

// Actualiza los datos de un proyecto existente
const updateProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Proyecto actualizado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPDATING_PROJECT");
  }
};

// Devuelve todos los proyectos activos del usuario o empresa
const getProjectsCtrl = async (req, res) => {
  try {
    const user = req.user;

    // Busca proyectos activos por usuario o empresa
    const projects = await Project.find({
      $or: [
        { user: user._id },
        { "company.name": user.company.name }
      ],
      status: { $ne: "archived" }
    }).populate("client");

    res.json({ projects });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_PROJECTS");
  }
};

// Obtiene un proyecto por ID
const getProjectByIdCtrl = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("client");
    if (!project) return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
    res.json({ project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_GETTING_PROJECT");
  }
};

// Archiva un proyecto cambiando su estado a "archived"
const archiveProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );
    res.json({ message: "Proyecto archivado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_ARCHIVING_PROJECT");
  }
};

// Reactiva un proyecto archivado
const unarchiveProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    res.json({ message: "Proyecto desarchivado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UNARCHIVING_PROJECT");
  }
};

// Elimina un proyecto de la base de datos
const deleteProjectCtrl = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Proyecto eliminado" });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_DELETING_PROJECT");
  }
};

// Exporta todos los controladores
export {
  createProjectCtrl,
  updateProjectCtrl,
  getProjectsCtrl,
  getProjectByIdCtrl,
  archiveProjectCtrl,
  unarchiveProjectCtrl,
  deleteProjectCtrl
};
