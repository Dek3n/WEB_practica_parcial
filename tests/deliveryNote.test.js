import request from "supertest";
import app from "../app.js";

let token = "";
let noteId = "";
let projectId = "6818d7f6342616a071c0849e"; //Asegúrate de que existe

// Login para obtener token antes de probar los endpoints
beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test8@correo.com", password: "miPassword123" });

  token = res.body.token;
});

describe("Delivery Note Routes", () => {
  //Crear un albarán
  it("should create a delivery note", async () => {
    const res = await request(app)
      .post("/api/deliverynote")
      .auth(token, { type: "bearer" })
      .send({
        project: projectId,
        description: "Montaje de estructura metálica",
        date: "2025-05-12"
      });

    expect(res.statusCode).toBe(201);
    noteId = res.body.note._id; //Guardamos el ID del albarán
  });

  //Listar todos los albaranes
  it("should get all delivery notes", async () => {
    const res = await request(app)
      .get("/api/deliverynote")
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.notes)).toBe(true);
  });

  // Obtener uno por ID
  it("should get one delivery note", async () => {
    const res = await request(app)
      .get(`/api/deliverynote/${noteId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.note._id).toBe(noteId);
  });

  //Descargar el PDF
  it("should return the delivery note PDF", async () => {
    const res = await request(app)
      .get(`/api/deliverynote/pdf/${noteId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
  });
});
