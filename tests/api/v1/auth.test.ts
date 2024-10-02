import { describe, expect, it } from "vitest";
import app from "@/app";
import request from "supertest";

describe("Auth", () => {
  it("register endpoint", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Tamir",
      email: "shklazt@gmail.com",
      password: "1234",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["name", "email"]);
  });
  it("login endpoint", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "shklazt@gmail.com",
      password: "123456",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
