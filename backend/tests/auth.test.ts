import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";
import { passwordMatchesAccount, UNKNOWN_EMAIL_PASSWORD_HASH } from "../src/application/loginTeacher";
import { assertSeedAllowed } from "../prisma/seedData";

const prisma = new PrismaClient();
const app = createApp(prisma);

describe("login", () => {
  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("rejects an empty password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "VALIDATION",
      message: "Ingrese su correo y su contraseña.",
    });
  });

  it("uses the same body for an unknown email and a wrong password and omits passwordHash", async () => {
    const unknown = await request(app)
      .post("/api/auth/login")
      .send({ email: "nadie@demo.mep.cr", password: "Demo2026" });
    const wrong = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "incorrecta" });

    expect(unknown.status).toBe(401);
    expect(wrong.status).toBe(401);
    expect(unknown.body).toEqual(wrong.body);
    expect(unknown.body).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "Correo o contraseña incorrectos.",
    });
    expect(JSON.stringify(unknown.body)).not.toContain("passwordHash");
    expect(JSON.stringify(wrong.body)).not.toContain("passwordHash");
  });

  it("compares a stand-in hash when the email is unknown and still rejects the login", async () => {
    const compare = jest.fn(async () => true);
    const matched = await passwordMatchesAccount("Demo2026", undefined, compare);
    expect(compare).toHaveBeenCalledWith("Demo2026", UNKNOWN_EMAIL_PASSWORD_HASH);
    expect(matched).toBe(false);
  });

  it("starts a session for Juanita and keeps it on /me", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });

    expect(login.status).toBe(200);
    expect(login.body.fullName).toBe("Juanita Pérez");
    expect(login.body.email).toBe("juanita.perez@demo.mep.cr");
    expect(login.body.passwordHash).toBeUndefined();
    expect(login.headers["set-cookie"]?.[0]).toMatch(/HttpOnly/i);
    expect(login.headers["set-cookie"]?.[0]).not.toMatch(/Max-Age/i);

    const me = await request(app).get("/api/auth/me").set("Cookie", login.headers["set-cookie"]);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe("juanita.perez@demo.mep.cr");
    expect(me.body.passwordHash).toBeUndefined();
  });

  it("rejects /me without a session", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: "UNAUTHENTICATED",
      message: "Inicie sesión para continuar.",
    });
  });

  it("hides a plan that does not belong to the signed-in teacher", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "carlos.mora@demo.mep.cr", password: "Demo2026" });
    const response = await request(app)
      .get("/api/plans/otro-planeamiento")
      .set("Cookie", login.headers["set-cookie"]);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No tiene acceso a este planeamiento.");
  });

  it("refuses the development seed in production", () => {
    expect(() => assertSeedAllowed("production")).toThrow(/production/);
  });
});
