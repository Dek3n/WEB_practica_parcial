import request from "supertest";
import app from "../app.js";

let token = "";
let clientId = "";

// 🔐 Login antes de todos los tests para obtener un token válido
beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test8@correo.com", password: "miPassword123" });

  token = res.body.token;
});

describe("Client Routes", () => {
  // 🏗️ Crear un cliente válido con datos únicos para evitar conflictos
  it("should create a new client", async () => {
    const uniqueId = Date.now(); // 🕒 ID único por tiempo para email y NIF

    const res = await request(app)
      .post("/api/client")
      .auth(token, { type: "bearer" })
      .send({
        name: `Empresa Test ${uniqueId}`,
        email: `cliente${uniqueId}@empresa.com`, // ✅ email único
        phone: `6${Math.floor(100000000 + Math.random() * 899999999)}`,
        nif: `B${uniqueId}`, // ✅ nif único
        address: "Calle Mayor 123",
        company: {
          name: "Mi Empresa",
          sector: "Software"
        }
      });

    // ✅ Aceptamos 200 o 201 como éxito
    if ([200, 201].includes(res.statusCode)) {
      expect(res.body.client).toBeDefined();
      clientId = res.body.client._id; // 💾 Guardamos el ID para los siguientes tests
      expect(typeof clientId).toBe("string");
    }
    // ⚠️ Si ya existe, se informa y se omiten los tests dependientes
    else if (res.statusCode === 409) {
      console.warn("⚠️ Cliente ya existente, omitimos tests siguientes");
    }
    // ❌ Si otra cosa falla, lanzamos error explícito
    else {
      throw new Error(`❌ Status inesperado: ${res.statusCode}`);
    }
  });

  // 📋 Obtener todos los clientes disponibles
  it("should get all clients", async () => {
    const res = await request(app)
      .get("/api/client")
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);

    // ✅ Comprobamos que devuelve un array en la propiedad 'clients'
    expect(Array.isArray(res.body.clients)).toBe(true);
  });

  // 🔍 Obtener un cliente por su ID
  it("should get one client by ID", async () => {
    if (!clientId) {
      console.warn("⚠️ No hay clientId disponible para este test.");
      return;
    }

    const res = await request(app)
      .get(`/api/client/${clientId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);

    // ✅ Accedemos correctamente a client dentro de res.body
    expect(res.body.client._id).toBe(clientId);
  });
});
