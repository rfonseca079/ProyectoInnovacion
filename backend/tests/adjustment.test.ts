import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const mariaPlanId = "33333333-3333-4333-8333-333333333333";
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const scenarios = ["mat-4-marzo-2026", "esp-2-abril-2026", "cie-7-febrero-2026"];
const tuesdayStart = "Inicia con el cierre de equivalentes que faltó el lunes.";
const tuesdayPractice = "12 minutos";
const retakeStrategy = "Retomar el martes la construcción de 1/2 = 2/4 = 3/6 que quedó pendiente el lunes.";
const retakeIndicator = "Completa la equivalencia en la lección del martes.";
const cardOneBase = "Reprogramar el cierre de equivalentes al inicio del martes.";

describe("post-class adjustment seed", () => {
  it("seeds adjustment-week for the three scenarios and opens María on step 8 unapplied", async () => {
    for (const scenarioId of scenarios) {
      const stored = await prisma.suggestionVariant.findUnique({
        where: {
          scenarioId_blockKey_variant: { scenarioId, blockKey: "adjustment-week", variant: 1 },
        },
      });
      expect(stored?.body.length).toBeGreaterThan(0);
    }

    const cookie = await loginCookie("maria.solis@demo.mep.cr");
    const opened = await request(app).get(`/api/plans/${mariaPlanId}`).set("Cookie", cookie);
    expect(opened.status).toBe(200);
    expect(opened.body.currentStep).toBe(8);
    expect(opened.body.adjustmentApplied).toBe(false);
  });
});

describe("apply stored adjustment", () => {
  afterAll(async () => {
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { status: "DRAFT", adjustmentApplied: false, currentStep: 4, highestVisitedStep: 4 },
    });
    await prisma.classSession.updateMany({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
      data: {
        start: "5 min de repaso",
        development: "práctica breve de equivalencias",
        homework: null,
        status: "SUGGESTED",
      },
    });
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "adjustment-1" } },
      data: { body: cardOneBase, status: "SUGGESTED" },
    });
  });

  it("rewrites Tuesday and the MEP strategy and sets ADJUSTED in one apply", async () => {
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const before = await mepRowCount(juanitaPlanId);
    const response = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ADJUSTED");
    expect(response.body.adjustmentApplied).toBe(true);

    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
    });
    expect(tuesday.occursOn.toISOString().slice(0, 10)).toBe("2026-03-10");
    expect(tuesday.start).toBe(tuesdayStart);
    expect(tuesday.development).toContain(tuesdayPractice);
    expect(tuesday.development).toContain("Dos ítems del extraclase de empaques pasan a la práctica");
    expect(tuesday.homework).toBe("Un ejemplo.");

    const document = await prisma.mepDocument.findUniqueOrThrow({
      where: { planId: juanitaPlanId },
      include: { rows: true },
    });
    const row = document.rows.find((item) => item.position === 1);
    expect(row?.mediationStrategy).toBe(retakeStrategy);
    expect(row?.indicator).toBe(retakeIndicator);
    expect(document.rows.length).toBeGreaterThanOrEqual(before === 0 ? 1 : before);
  });

  it("does not add MEP rows when apply runs again", async () => {
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    const before = await mepRowCount(juanitaPlanId);
    const again = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(again.status).toBe(200);
    expect(await mepRowCount(juanitaPlanId)).toBe(before);
    const document = await prisma.mepDocument.findUniqueOrThrow({
      where: { planId: juanitaPlanId },
      include: { rows: true },
    });
    expect(document.rows.find((item) => item.position === 1)?.mediationStrategy).toBe(retakeStrategy);
  });

  it("uses an edited card body instead of the base string", async () => {
    const edited = "Texto editado para el inicio del martes.";
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "adjustment-1" } },
      data: { body: edited, status: "EDITED" },
    });
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const response = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(response.status).toBe(200);
    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
    });
    expect(tuesday.start).toBe(edited);
  });

  it("keeps the stored Tuesday result when the card text did not change", async () => {
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "adjustment-1" } },
      data: { body: cardOneBase, status: "EDITED" },
    });
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const response = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(response.status).toBe(200);
    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
    });
    expect(tuesday.start).toBe(tuesdayStart);
    const document = await prisma.mepDocument.findUniqueOrThrow({
      where: { planId: juanitaPlanId },
      include: { rows: true },
    });
    expect(document.rows.find((item) => item.position === 1)?.mediationStrategy).toBe(retakeStrategy);
  });

  it("writes a changed first card into the MEP strategy and the PDF", async () => {
    const edited = "Estrategia editada para el martes.";
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "adjustment-1" } },
      data: { body: edited, status: "EDITED" },
    });
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const response = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(response.status).toBe(200);
    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
    });
    expect(tuesday.start).toBe(edited);
    const document = await prisma.mepDocument.findUniqueOrThrow({
      where: { planId: juanitaPlanId },
      include: { rows: true },
    });
    expect(document.rows.find((item) => item.position === 1)?.mediationStrategy).toBe(edited);
    const file = await request(app).get(`/api/plans/${juanitaPlanId}/document/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    const text = Buffer.from(file.body).toString("latin1");
    expect(text).toContain(edited);
    expect(text).not.toContain(retakeStrategy);
  });

  it("keeps a changed card after the teacher accepts it", async () => {
    const edited = "Cierre aceptado para el martes.";
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "adjustment-1" } },
      data: { body: edited, status: "ACCEPTED" },
    });
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const response = await request(app).post(`/api/plans/${juanitaPlanId}/adjustments/apply`).set("Cookie", cookie);
    expect(response.status).toBe(200);
    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 2 },
    });
    expect(tuesday.start).toBe(edited);
    const document = await prisma.mepDocument.findUniqueOrThrow({
      where: { planId: juanitaPlanId },
      include: { rows: true },
    });
    expect(document.rows.find((item) => item.position === 1)?.mediationStrategy).toBe(edited);
  });
});

describe("notification toggle", () => {
  const fetchSpy = jest.spyOn(global, "fetch");

  afterAll(async () => {
    fetchSpy.mockRestore();
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { notifyEvaluationChanges: false },
    });
    await prisma.$disconnect();
  });

  it("stores the toggle and does not send a message", async () => {
    fetchSpy.mockClear();
    const cookie = await loginCookie("juanita.perez@demo.mep.cr");
    const response = await request(app)
      .patch(`/api/plans/${juanitaPlanId}`)
      .set("Cookie", cookie)
      .send({ notifyEvaluationChanges: true });
    expect(response.status).toBe(200);
    expect(response.body.notifyEvaluationChanges).toBe(true);
    expect(response.body.message ?? "").not.toMatch(/enviad/i);
    const stored = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    expect(stored.notifyEvaluationChanges).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

async function mepRowCount(planId: string): Promise<number> {
  return prisma.mepRow.count({ where: { document: { planId } } });
}

async function loginCookie(email: string): Promise<string[]> {
  const login = await request(app).post("/api/auth/login").send({ email, password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}
