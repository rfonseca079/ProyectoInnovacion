import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";

describe("continue step", () => {
  afterAll(async () => {
    await prisma.rubricItem.deleteMany({ where: { planId: juanitaPlanId } });
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 4, highestVisitedStep: 4, section: "A", teacherName: "Juanita Pérez", schoolName: "Escuela República de Arabia Saudita" },
    });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  async function cookie(email: string) {
    const login = await request(app).post("/api/auth/login").send({ email, password: "Demo2026" });
    return login.headers["set-cookie"];
  }

  it("returns 422 for an invalid step and does not raise highestVisitedStep", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/4/continue`).set("Cookie", juanita);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Complete los campos de este paso antes de continuar.");

    const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    expect(stored.highestVisitedStep).toBe(4);
    expect(stored.currentStep).toBe(4);
  });

  it("returns 422 when the evaluation percentages do not sum to 100", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    await prisma.rubricItem.create({ data: { planId: juanitaPlanId, name: "Tareas", percentage: 40 } });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/2/continue`).set("Cookie", juanita);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Los porcentajes de la evaluación deben sumar 100.");
    const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    expect(stored.highestVisitedStep).toBe(4);
  });

  it("names the empty section and does not advance", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    await prisma.plan.update({ where: { id: juanitaPlanId }, data: { section: "  " } });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/0/continue`).set("Cookie", juanita);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Complete el campo Sección o grupo.");
    const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    expect(stored.highestVisitedStep).toBe(4);
    expect(stored.currentStep).toBe(4);
    await prisma.plan.update({ where: { id: juanitaPlanId }, data: { section: "A" } });
  });

  it("names Nombre docente when the school is filled and the teacher name is empty", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    await prisma.plan.update({ where: { id: juanitaPlanId }, data: { teacherName: " " } });
    try {
      const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/0/continue`).set("Cookie", juanita);
      expect(blocked.status).toBe(422);
      expect(blocked.body.message).toBe("Complete el campo Nombre docente.");
      const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
      expect(stored.highestVisitedStep).toBe(4);
    } finally {
      await prisma.plan.update({ where: { id: juanitaPlanId }, data: { teacherName: "Juanita Pérez" } });
    }
  });

  it("returns 404 when another teacher continues the plan", async () => {
    const carlos = await cookie("carlos.mora@demo.mep.cr");
    const hidden = await request(app).post(`/api/plans/${juanitaPlanId}/steps/0/continue`).set("Cookie", carlos);
    expect(hidden.status).toBe(404);
    const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    expect(stored.highestVisitedStep).toBe(4);
  });

  it("opens the next step when configuration is valid", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/0/continue`).set("Cookie", juanita);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(1);
    expect(continued.body.highestVisitedStep).toBe(4);
  });
});
