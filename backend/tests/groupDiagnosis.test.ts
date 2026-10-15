import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const numberLineSentence = "Iniciar la recta numérica solo después de la representación concreta.";
const shortProblemSentence = "Acortar el enunciado del problema a dos oraciones antes de pedir el cálculo.";
const scienceSupport = "Observar células en láminas o imágenes antes de copiar el esquema.";

const implicationKeys = ["implication-manipulatives", "implication-scaffolding", "implication-differentiation"];

describe("group diagnosis", () => {
  afterAll(async () => {
    await restoreJuanitaGroup();
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("stores the number-line sentence in the second mathematics implication set", async () => {
    const stored = await prisma.suggestionVariant.findFirst({
      where: {
        scenarioId: "mat-4-marzo-2026",
        variant: 2,
        body: { contains: numberLineSentence },
      },
    });
    expect(stored?.body).toContain(numberLineSentence);
    const profile = await prisma.suggestionVariant.findMany({
      where: { scenarioId: "mat-4-marzo-2026", step: 3, variant: 1 },
    });
    expect(profile.map((item) => item.blockKey).sort()).toEqual(
      [
        "difficulties",
        "implication-differentiation",
        "implication-manipulatives",
        "implication-scaffolding",
        "pace",
        "prior-knowledge",
        "resources",
        "supports",
        "teacher-notes",
      ].sort(),
    );
    const science = await prisma.suggestionVariant.findFirst({
      where: { scenarioId: "cie-7-febrero-2026", variant: 1, body: { contains: scienceSupport } },
    });
    expect(science?.body).toContain(scienceSupport);
  });

  it("names the empty field when step 3 cannot continue", async () => {
    await restoreJuanitaGroup();
    const cookie = await juanitaCookie();
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "teacher-notes" } },
      data: { body: "   " },
    });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/3/continue`).set("Cookie", cookie);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Complete el campo Observaciones de la docente.");
    expect((await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } })).currentStep).toBe(4);
  });

  it("replaces the three implication cards together and leaves the others on a single regenerate", async () => {
    await restoreJuanitaGroup();
    const cookie = await juanitaCookie();
    const generated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/generate-implications`)
      .set("Cookie", cookie);
    expect(generated.status).toBe(200);
    const afterGenerate = await implicationBodies();
    expect(afterGenerate.join(" ")).toContain(numberLineSentence);
    expect(afterGenerate.every((body) => body.length > 0)).toBe(true);

    const regenerated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/implication-scaffolding/regenerate`)
      .set("Cookie", cookie);
    expect(regenerated.status).toBe(200);
    const afterRegenerate = await implicationBodies();
    expect(afterRegenerate[0]).toBe(afterGenerate[0]);
    expect(afterRegenerate[2]).toBe(afterGenerate[2]);
    expect(afterRegenerate[1]).not.toBe(afterGenerate[1]);
    expect(afterRegenerate[1]).toContain(shortProblemSentence);
  });

  it("marks step 4 visited on the first successful continue", async () => {
    await restoreJuanitaGroup();
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 3, highestVisitedStep: 3, updatedAt: new Date("2026-03-10T18:00:00.000Z") },
    });
    const cookie = await juanitaCookie();
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/3/continue`).set("Cookie", cookie);
    expect(continued.status).toBe(200);
    expect(continued.body.highestVisitedStep).toBeGreaterThanOrEqual(4);
    expect(continued.body.currentStep).toBe(4);
  });

  it("returns 404 when another teacher generates implications", async () => {
    await restoreJuanitaGroup();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "carlos.mora@demo.mep.cr", password: "Demo2026" });
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/generate-implications`)
      .set("Cookie", login.headers["set-cookie"]);
    expect(response.status).toBe(404);
    const bodies = await implicationBodies();
    expect(bodies[0]).toContain("Usar círculos y fichas");
  });

  it("applies two overlapping generates as two different sets", async () => {
    await restoreJuanitaGroup();
    const cookie = await juanitaCookie();
    const path = `/api/plans/${juanitaPlanId}/actions/generate-implications`;
    const [first, second] = await Promise.all([
      request(app).post(path).set("Cookie", cookie),
      request(app).post(path).set("Cookie", cookie),
    ]);
    expect([first.status, second.status].sort()).toEqual([200, 200]);
    const blocks = await prisma.planBlock.findMany({
      where: { planId: juanitaPlanId, blockKey: { in: implicationKeys } },
    });
    expect(blocks.every((block) => block.variant === 3)).toBe(true);
    expect(blocks.map((block) => block.body).join(" ")).toContain("Volver a las fichas cuando la recta numérica se confunde.");
  });
});

async function implicationBodies(): Promise<string[]> {
  const blocks = await prisma.planBlock.findMany({
    where: { planId: juanitaPlanId, blockKey: { in: implicationKeys } },
  });
  return implicationKeys.map((key) => blocks.find((block) => block.blockKey === key)?.body ?? "");
}

async function juanitaCookie(): Promise<string[]> {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}

async function restoreJuanitaGroup(): Promise<void> {
  const variants = await prisma.suggestionVariant.findMany({
    where: { scenarioId: "mat-4-marzo-2026", step: 3, variant: 1 },
  });
  for (const variant of variants) {
    await prisma.planBlock.upsert({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: variant.blockKey } },
      update: { body: variant.body, variant: 1, status: "SUGGESTED" },
      create: {
        planId: juanitaPlanId,
        blockKey: variant.blockKey,
        status: "SUGGESTED",
        variant: 1,
        body: variant.body,
      },
    });
  }
  await prisma.plan.update({
    where: { id: juanitaPlanId },
    data: {
      currentStep: 4,
      highestVisitedStep: 4,
      section: "A",
      updatedAt: new Date("2026-03-10T18:00:00.000Z"),
    },
  });
}
