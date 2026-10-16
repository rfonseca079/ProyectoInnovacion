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
  section: "estudios-sociales",
  studentCount: 28,
  weeklyLessons: 5,
};

describe("social studies scenario resolution", () => {
  afterAll(async () => {
    await prisma.plan.deleteMany({ where: { section: "estudios-sociales" } });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("keeps the social studies header, sets the fallback flag, and reloads only suggested blocks", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const session = login.headers["set-cookie"];
    const created = await request(app).post("/api/plans").set("Cookie", session).send(juanitaPlan);
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: created.body.id, blockKey: "month-objectives" } },
      data: { status: "ACCEPTED", body: "Objetivo aceptado por la docente." },
    });
    const updated = await request(app)
      .patch(`/api/plans/${created.body.id}`)
      .set("Cookie", session)
      .send({ subject: "SOCIAL_STUDIES" });
    const accepted = updated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "month-objectives");
    const suggested = updated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "program-extract");
    expect(updated.status).toBe(200);
    expect(updated.body.subject).toBe("SOCIAL_STUDIES");
    expect(updated.body.schoolYear).toBe(2026);
    expect(updated.body.gradeLevel).toBe(4);
    expect(updated.body.month).toBe(3);
    expect(updated.body.schoolName).toBe("Escuela República de Arabia Saudita");
    expect(updated.body.scenarioId).toBe("mat-4-marzo-2026");
    expect(updated.body.usedFallback).toBe(true);
    expect(accepted.body).toBe("Objetivo aceptado por la docente.");
    expect(accepted.status).toBe("ACCEPTED");
    expect(suggested.status).toBe("SUGGESTED");
    expect(suggested.body).toContain("fracciones");
  });
});
