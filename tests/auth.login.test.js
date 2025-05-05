import request from "supertest";
import app from "../app.js";

describe("Auth Routes - Login", () => {
  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test8@correo.com", // Usa uno válido que ya tengas en tu BD
      password: "miPassword123"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test8@correo.com");
  });
});
