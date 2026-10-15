import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";

type MediationRow = { activity: string; minutes: number; materials: string };

function rowsOf(body: string): MediationRow[] {
  return JSON.parse(body) as MediationRow[];
}

async function restoreJuanitaMediation(): Promise<void> {
  const variants = await prisma.suggestionVariant.findMany({
    where: {
      scenarioId: "mat-4-marzo-2026",
      step: 4,
      variant: 1,
      blockKey: { in: ["mediation-in-class", "mediation-outside"] },
    },
  });
  for (const variant of variants) {
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: variant.blockKey } },
      data: { body: variant.body, variant: 1, status: "SUGGESTED" },
    });
  }
  await prisma.planBlock.deleteMany({
    where: { planId: juanitaPlanId, blockKey: { in: ["fit-40-minutes", "simplify-materials"] } },
  });
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

describe("mediation", () => {
  beforeEach(async () => {
    await restoreJuanitaMediation();
  });

  afterAll(async () => {
    await restoreJuanitaMediation();
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  async function cookie(email: string) {
    const login = await request(app).post("/api/auth/login").send({ email, password: "Demo2026" });
    return login.headers["set-cookie"];
  }

  it("stores a mathematics 40-minute set of 8, 14, 12, and 6", async () => {
    const stored = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "mat-4-marzo-2026",
          blockKey: "fit-40-minutes",
          variant: 1,
        },
      },
    });
    const rows = rowsOf(stored.body);
    expect(rows.map((row) => row.minutes)).toEqual([8, 14, 12, 6]);
    expect(rows.reduce((sum, row) => sum + row.minutes, 0)).toBe(40);
    const visible = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
    });
    const initial = rowsOf(visible.body);
    expect(initial.map((row) => row.activity)).toEqual([
      "Activación con fichas",
      "Construcción de equivalentes",
      "Práctica guiada",
      "Cierre",
    ]);
    expect(initial.reduce((sum, row) => sum + row.minutes, 0)).toBe(60);
    const week = await prisma.week.findFirstOrThrow({ where: { planId: juanitaPlanId, position: 2 } });
    expect(week.title).toBe("Fracciones equivalentes");
  });

  it("replaces the mediation with the next stored set and marks it suggested", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
      data: { status: "ACCEPTED" },
    });
    const regenerated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/regenerate-mediation`)
      .set("Cookie", juanita);
    expect(regenerated.status).toBe(200);
    const inClass = regenerated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-in-class");
    expect(inClass.status).toBe("SUGGESTED");
    expect(inClass.body).toContain("Relato corto de una pizza repartida");
    const outside = regenerated.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-outside");
    expect(outside.status).toBe("SUGGESTED");
    expect(outside.body).toContain("Variante 2.");
  });

  it("loads the stored 40-minute times without changing the week", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
      data: { status: "EDITED" },
    });
    const fitted = await request(app).post(`/api/plans/${juanitaPlanId}/actions/fit-40-minutes`).set("Cookie", juanita);
    expect(fitted.status).toBe(200);
    const inClass = fitted.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-in-class");
    const rows = rowsOf(inClass.body);
    expect(inClass.status).toBe("SUGGESTED");
    expect(rows.map((row) => row.minutes)).toEqual([8, 14, 12, 6]);
    const week = await prisma.week.findFirstOrThrow({ where: { planId: juanitaPlanId, position: 2 } });
    expect(week.title).toBe("Fracciones equivalentes");
  });

  it("loads the simplified materials and marks the table suggested", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const simplified = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/simplify-materials`)
      .set("Cookie", juanita);
    expect(simplified.status).toBe(200);
    const inClass = simplified.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-in-class");
    expect(inClass.status).toBe("SUGGESTED");
    expect(rowsOf(inClass.body).map((row) => row.materials)).toEqual(["Papel y lápiz", "Cuaderno", "Pizarra", "Pizarra"]);
  });

  it("stores the Spanish read-aloud activity and the science image observation", async () => {
    const spanish = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "esp-2-abril-2026",
          blockKey: "mediation-in-class",
          variant: 1,
        },
      },
    });
    const spanishOutside = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "esp-2-abril-2026",
          blockKey: "mediation-outside",
          variant: 1,
        },
      },
    });
    expect(spanish.body).toContain("Lectura en voz alta");
    expect(spanishOutside.body).toContain("Llevar un cuento de la casa.");
    const science = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "cie-7-febrero-2026",
          blockKey: "mediation-in-class",
          variant: 1,
        },
      },
    });
    const scienceOutside = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "cie-7-febrero-2026",
          blockKey: "mediation-outside",
          variant: 1,
        },
      },
    });
    expect(science.body).toContain("Observación de imágenes");
    expect(scienceOutside.body).toContain("Rotular un esquema");
    for (const scenarioId of ["esp-2-abril-2026", "cie-7-febrero-2026"]) {
      const fitted = await prisma.suggestionVariant.findUniqueOrThrow({
        where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "fit-40-minutes", variant: 1 } },
      });
      expect(rowsOf(fitted.body).reduce((sum, row) => sum + row.minutes, 0)).toBe(40);
    }
  });

  it("returns to the first 40-minute set on the fourth call", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    let minutes: number[] = [];
    for (let call = 0; call < 4; call += 1) {
      const fitted = await request(app).post(`/api/plans/${juanitaPlanId}/actions/fit-40-minutes`).set("Cookie", juanita);
      expect(fitted.status).toBe(200);
      const inClass = fitted.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-in-class");
      minutes = rowsOf(inClass.body).map((row) => row.minutes);
    }
    expect(minutes).toEqual([8, 14, 12, 6]);
    const cursor = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "fit-40-minutes" } },
    });
    expect(cursor.variant).toBe(1);
  });

  it("claims two overlapping fit-40 calls as two variants", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const [first, second] = await Promise.all([
      request(app).post(`/api/plans/${juanitaPlanId}/actions/fit-40-minutes`).set("Cookie", juanita),
      request(app).post(`/api/plans/${juanitaPlanId}/actions/fit-40-minutes`).set("Cookie", juanita),
    ]);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const cursor = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "fit-40-minutes" } },
    });
    expect(cursor.variant).toBe(2);
    expect(rowsOf(cursor.body).map((row) => row.minutes)).toEqual([10, 10, 10, 10]);
  });

  it("continues when the visible times sum to 60", async () => {
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/4/continue`).set("Cookie", juanita);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(5);
    const visible = continued.body.blocks.find((block: { blockKey: string }) => block.blockKey === "mediation-in-class");
    expect(rowsOf(visible.body).reduce((sum, row) => sum + row.minutes, 0)).toBe(60);
  });
});
