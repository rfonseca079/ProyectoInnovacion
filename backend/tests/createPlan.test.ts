import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);

const juanitaPlan = {
  cycle: "I_II",
  gradeLevel: 4,
  subject: "MATH",
  modality: "IN_PERSON",
  schoolYear: 2026,
  month: 3,
  schoolName: "Escuela República de Arabia Saudita",
  regionalDirectorate: "Dirección Regional San José",
  teacherName: "Juanita Pérez",
  section: "4.° A",
  studentCount: 28,
  weeklyLessons: 5,
};

describe("plan creation", () => {
  afterAll(async () => {
    await prisma.plan.deleteMany({
      where: {
        id: {
          notIn: [
            "11111111-1111-4111-8111-111111111111",
            "22222222-2222-4222-8222-222222222222",
            "33333333-3333-4333-8333-333333333333",
          ],
        },
      },
    });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  async function cookie() {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    return login.headers["set-cookie"];
  }

  it("maps mathematics March to mat-4-marzo-2026 and social studies to the fallback", async () => {
    const session = await cookie();
    const created = await request(app).post("/api/plans").set("Cookie", session).send(juanitaPlan);
    expect(created.status).toBe(201);
    expect(created.body.scenarioId).toBe("mat-4-marzo-2026");
    expect(created.body.currentStep).toBe(1);
    expect(created.body.blocks.map((block: { body: string }) => block.body).join(" ")).toContain("fracciones");

    const fallback = await request(app)
      .post("/api/plans")
      .set("Cookie", session)
      .send({ ...juanitaPlan, subject: "SOCIAL_STUDIES", section: "social" });
    expect(fallback.body.scenarioId).toBe("mat-4-marzo-2026");
    expect(fallback.body.usedFallback).toBe(true);
  });

  it("rejects grade 4 in diversified education", async () => {
    const session = await cookie();
    const response = await request(app)
      .post("/api/plans")
      .set("Cookie", session)
      .send({ ...juanitaPlan, cycle: "DIVERSIFIED", gradeLevel: 4, section: "diversificada" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Seleccione un nivel del ciclo elegido.");
  });

  it("reloads only suggested blocks when the match key changes", async () => {
    const session = await cookie();
    const created = await request(app)
      .post("/api/plans")
      .set("Cookie", session)
      .send({ ...juanitaPlan, section: "cambio" });
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: created.body.id, blockKey: "month-objectives" } },
      data: { status: "ACCEPTED", body: "Texto aceptado por la docente" },
    });
    await prisma.planBlock.create({
      data: {
        planId: created.body.id,
        blockKey: "teacher-note",
        status: "EDITED",
        variant: 1,
        body: "Texto editado por la docente",
      },
    });
    await prisma.suggestionVariant.create({
      data: {
        scenarioId: "esp-2-abril-2026",
        blockKey: "teacher-note",
        step: 1,
        variant: 1,
        body: "Variante que no debe reemplazar el texto editado",
      },
    });
    try {
      const updated = await request(app)
        .patch(`/api/plans/${created.body.id}`)
        .set("Cookie", session)
        .send({ subject: "SPANISH", gradeLevel: 2, month: 4 });
      const accepted = updated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "month-objectives");
      const edited = updated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "teacher-note");
      const suggested = updated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "program-extract");
      expect(accepted.body).toBe("Texto aceptado por la docente");
      expect(accepted.status).toBe("ACCEPTED");
      expect(edited.body).toBe("Texto editado por la docente");
      expect(edited.status).toBe("EDITED");
      expect(suggested.body).toContain("narrativos");
      expect(updated.body.scenarioId).toBe("esp-2-abril-2026");
    } finally {
      await prisma.suggestionVariant.deleteMany({
        where: { scenarioId: "esp-2-abril-2026", blockKey: "teacher-note" },
      });
    }
  });
});
