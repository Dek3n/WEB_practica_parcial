import Project from "../models/project.js";
import { handleHttpError } from "../utils/handleError.js";

const createProjectCtrl = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, client } = req.body;

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

const updateProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Proyecto actualizado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UPDATING_PROJECT");
  }
};

const getProjectsCtrl = async (req, res) => {
  try {
    const user = req.user;
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

const archiveProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
    res.json({ message: "Proyecto archivado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_ARCHIVING_PROJECT");
  }
};

const unarchiveProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    res.json({ message: "Proyecto recuperado", project });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_UNARCHIVING_PROJECT");
  }
};

const deleteProjectCtrl = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Proyecto eliminado permanentemente" });
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_DELETING_PROJECT");
  }
};

export {
  createProjectCtrl,
  updateProjectCtrl,
  getProjectsCtrl,
  getProjectByIdCtrl,
  archiveProjectCtrl,
  unarchiveProjectCtrl,
  deleteProjectCtrl
};
