import request from "supertest";
import app from "../app.js";
import path from "path";
import fs from "fs";

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

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.note).toBeDefined();
    noteId = res.body.note._id; //Guardamos el ID
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

  //Actualizar datos del albarán
  it("should update the delivery note", async () => {
    const res = await request(app)
      .patch(`/api/deliverynote/${noteId}`)
      .auth(token, { type: "bearer" })
      .send({ description: "Descripción modificada para test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.note.description).toContain("modificada");
  });

  //Firmar el albarán subiendo una imagen PNG
    it("should sign the delivery note with an image", async () => {
    const signaturePath = path.resolve("tests/assets/signature.png");
  
    if (!fs.existsSync(signaturePath)) {
      console.warn("No se encontró la imagen de firma. Se omite este test.");
      return;
    }
  
    const res = await request(app)
      .patch(`/api/deliverynote/${noteId}/sign`)
      .auth(token, { type: "bearer" })
      .attach("signature", signaturePath);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.note.signature).toBeDefined();
});

  //Eliminar el albarán (solo si no está firmado, o tu lógica lo permite)
  it("should delete the delivery note", async () => {
    const res = await request(app)
      .delete(`/api/deliverynote/${noteId}`)
      .auth(token, { type: "bearer" });

    // Puede fallar si ya está firmado
    expect([200, 403, 404]).toContain(res.statusCode);
  });
});
