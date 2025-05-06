import request from "supertest";
import app from "../app.js";

let token = "";
let projectId = "";
let clientId = "6818d7d1342616a071c0849b"; // Usa un ID real de tu BD

// Hacemos login antes de los tests
beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test8@correo.com", password: "miPassword123" });

  token = res.body.token;
});

describe("Project Routes", () => {
  //Crear proyecto
  it("should create a project", async () => {
    const res = await request(app)
      .post("/api/project")
      .auth(token, { type: "bearer" })
      .send({
        name: "Proyecto Test",
        description: "Diseño web",
        client: clientId
      });

    expect(res.statusCode).toBe(201);
    projectId = res.body.project._id; // Guardamos el ID
  });

  //Obtener todos los proyectos
  it("should get all projects", async () => {
    const res = await request(app)
      .get("/api/project")
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  // Obtener uno por ID
  it("should get one project", async () => {
    const res = await request(app)
      .get(`/api/project/${projectId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.project._id).toBe(projectId);
  });

  // Actualizar el proyecto
  it("should update the project", async () => {
    const res = await request(app)
      .put(`/api/project/${projectId}`)
      .auth(token, { type: "bearer" })
      .send({ description: "Proyecto actualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.project.description).toContain("actualizado");
  });
});
