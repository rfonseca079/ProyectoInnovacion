import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);

async function login(email: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password: "Demo2026" });
  return response.headers["set-cookie"];
}

describe("plan list", () => {
  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("seeds one plan per teacher", async () => {
    const plans = await prisma.plan.findMany();
    const teachers = await prisma.teacher.findMany();
    expect(plans).toHaveLength(3);
    expect(new Set(plans.map((plan) => plan.teacherId)).size).toBe(teachers.length);
  });

  it("returns only the signed-in teacher's plan and hides another id", async () => {
    const juanita = await login("juanita.perez@demo.mep.cr");
    const carlos = await login("carlos.mora@demo.mep.cr");
    const list = await request(app).get("/api/plans").set("Cookie", juanita);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({
      subject: "MATH",
      gradeLevel: 4,
      month: 3,
      schoolYear: 2026,
      schoolName: "Escuela República de Arabia Saudita",
      status: "DRAFT",
      currentStep: 4,
    });

    const hidden = await request(app).get(`/api/plans/${list.body[0].id}`).set("Cookie", carlos);
    expect(hidden.status).toBe(404);
    expect(hidden.body.message).toBe("No tiene acceso a este planeamiento.");

    const carlosList = await request(app).get("/api/plans").set("Cookie", carlos);
    expect(carlosList.body[0].status).toBe("READY_FOR_DELIVERY");
    expect(carlosList.body[0].currentStep).toBe(7);

    const maria = await login("maria.solis@demo.mep.cr");
    const mariaList = await request(app).get("/api/plans").set("Cookie", maria);
    expect(mariaList.body[0].currentStep).toBe(8);
    expect(mariaList.body[0].status).toBe("READY_FOR_DELIVERY");
  });
});
