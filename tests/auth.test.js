import request from "supertest";
import app from "../app.js"; // 👈 Asegúrate de exportar `app` desde app.js

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: `test${Date.now()}@mail.com`,
      password: "miPassword123"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email");
  });
});
