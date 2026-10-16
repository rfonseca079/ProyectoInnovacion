import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { activeWeekPosition } from "../prisma/sessionSeed";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const mathScenarioId = "mat-4-marzo-2026";

const mathWeekTitles = [
  "Fracción como parte-todo",
  "Fracciones equivalentes",
  "Comparación y orden",
  "Resolución de problemas y consolidación",
];

const mathRubric = [
  { name: "Prueba escrita", count: 1, percentage: 30 },
  { name: "Quices", count: 2, percentage: 20 },
  { name: "Trabajo extraclase", count: 2, percentage: 15 },
  { name: "Desempeño en clase y prácticas", count: 1, percentage: 20 },
  { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
];

describe("units and evaluation", () => {
  afterAll(async () => {
    await restoreJuanitaUnits();
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: {
        currentStep: 4,
        highestVisitedStep: 4,
        updatedAt: new Date("2026-03-10T18:00:00.000Z"),
      },
    });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("stores four week titles and a five-row distribution that sums to 100", async () => {
    const weeks = await prisma.week.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(weeks.map((week) => week.title)).toEqual(mathWeekTitles);

    const items = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(items.map((item) => ({ name: item.name, count: item.count, percentage: item.percentage }))).toEqual(mathRubric);
    expect(items.reduce((sum, item) => sum + item.percentage, 0)).toBe(100);

    const stored = await prisma.suggestionVariant.findMany({
      where: { scenarioId: mathScenarioId, blockKey: "evaluation-distribution" },
      orderBy: { variant: "asc" },
    });
    expect(stored.map((variant) => JSON.parse(variant.body) as number[])).toEqual([
      [30, 20, 15, 20, 15],
      [25, 15, 20, 25, 15],
      [20, 20, 10, 30, 20],
    ]);
  });

  it("rejects continue unless the total is 100 and every name exists", async () => {
    const cookie = await juanitaCookie();
    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Prueba escrita" },
      data: { percentage: 10 },
    });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/2/continue`).set("Cookie", cookie);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("La distribución debe sumar 100 %.");
    expect((await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } })).currentStep).toBe(4);

    await restoreJuanitaUnits();
    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Quices" },
      data: { name: " " },
    });
    const unnamed = await request(app).post(`/api/plans/${juanitaPlanId}/steps/2/continue`).set("Cookie", cookie);
    expect(unnamed.status).toBe(422);
    expect(unnamed.body.message).toBe("La distribución debe sumar 100 %.");

    await restoreJuanitaUnits();
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/2/continue`).set("Cookie", cookie);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(3);
    expect((await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } })).highestVisitedStep).toBe(4);
  });

  it("adds a zero-percent row and refuses to remove the last row", async () => {
    const cookie = await juanitaCookie();
    const current = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    const added = await request(app)
      .patch(`/api/plans/${juanitaPlanId}`)
      .set("Cookie", cookie)
      .send({
        rubric: [
          ...current.map((item) => ({ name: item.name, count: item.count, percentage: item.percentage })),
          { name: "", count: 1, percentage: 0 },
        ],
      });
    expect(added.status).toBe(200);
    const stored = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(stored).toHaveLength(6);
    expect(stored[5]).toEqual(expect.objectContaining({ name: "", count: 1, percentage: 0 }));

    await prisma.rubricItem.deleteMany({ where: { planId: juanitaPlanId } });
    await prisma.rubricItem.create({
      data: { planId: juanitaPlanId, position: 1, name: "Único", count: 1, percentage: 100 },
    });
    const refused = await request(app).patch(`/api/plans/${juanitaPlanId}`).set("Cookie", cookie).send({ rubric: [] });
    expect(refused.status).toBe(422);
    const left = await prisma.rubricItem.findMany({ where: { planId: juanitaPlanId } });
    expect(left.map((item) => item.name)).toEqual(["Único"]);
  });

  it("replaces only the percentages of a five-row rubric", async () => {
    await restoreJuanitaUnits();
    const cookie = await juanitaCookie();
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/redistribute-evaluation`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    const items = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(items.map((item) => item.percentage)).toEqual([25, 15, 20, 25, 15]);
    expect(items.map((item) => item.name)).toEqual(mathRubric.map((item) => item.name));
  });

  it("returns 409 when no stored distribution matches the row count", async () => {
    await restoreJuanitaUnits();
    const cookie = await juanitaCookie();
    const current = await prisma.rubricItem.findMany({ where: { planId: juanitaPlanId } });
    await prisma.rubricItem.create({
      data: { planId: juanitaPlanId, position: current.length + 1, name: "Extra", count: 1, percentage: 0 },
    });
    const namesBefore = (
      await prisma.rubricItem.findMany({ where: { planId: juanitaPlanId }, orderBy: { position: "asc" } })
    ).map((item) => item.name);
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/redistribute-evaluation`)
      .set("Cookie", cookie);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("No hay una distribución guardada para esta cantidad de rubros.");
    const items = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(items.map((item) => item.name)).toEqual(namesBefore);
    expect(items.map((item) => item.percentage)).toEqual([30, 20, 15, 20, 15, 0]);
  });

  it("rejects a negative percentage that would still sum to 100", async () => {
    await restoreJuanitaUnits();
    const cookie = await juanitaCookie();
    const refused = await request(app)
      .patch(`/api/plans/${juanitaPlanId}`)
      .set("Cookie", cookie)
      .send({
        rubric: [
          { name: "Prueba escrita", count: 1, percentage: -50 },
          { name: "Quices", count: 2, percentage: 150 },
          { name: "Trabajo extraclase", count: 2, percentage: 0 },
          { name: "Desempeño en clase y prácticas", count: 1, percentage: 0 },
          { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 0 },
        ],
      });
    expect(refused.status).toBe(422);
    expect(refused.body.message).toBe("Cada porcentaje debe ser un entero entre 0 y 100.");
    const stored = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(stored.map((item) => item.percentage)).toEqual([30, 20, 15, 20, 15]);

    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Prueba escrita" },
      data: { percentage: -50 },
    });
    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Quices" },
      data: { percentage: 150 },
    });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/2/continue`).set("Cookie", cookie);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("La distribución debe sumar 100 %.");
    expect((await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } })).currentStep).toBe(4);
  });

  it("returns 404 when another teacher redistributes the plan", async () => {
    await restoreJuanitaUnits();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "carlos.mora@demo.mep.cr", password: "Demo2026" });
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/redistribute-evaluation`)
      .set("Cookie", login.headers["set-cookie"]);
    expect(response.status).toBe(404);
    const items = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(items.map((item) => item.percentage)).toEqual([30, 20, 15, 20, 15]);
  });

  it("applies two overlapping redistributions as two different variants", async () => {
    await restoreJuanitaUnits();
    const cookie = await juanitaCookie();
    const path = `/api/plans/${juanitaPlanId}/actions/redistribute-evaluation`;
    const [first, second] = await Promise.all([
      request(app).post(path).set("Cookie", cookie),
      request(app).post(path).set("Cookie", cookie),
    ]);
    expect([first.status, second.status].sort()).toEqual([200, 200]);
    const items = await prisma.rubricItem.findMany({
      where: { planId: juanitaPlanId },
      orderBy: { position: "asc" },
    });
    expect(items.map((item) => item.percentage)).toEqual([20, 20, 10, 30, 20]);
    const block = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "evaluation-distribution" } },
    });
    expect(block.variant).toBe(3);
  });
});

async function juanitaCookie(): Promise<string[]> {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}

async function restoreJuanitaUnits(): Promise<void> {
  await prisma.week.deleteMany({ where: { planId: juanitaPlanId } });
  await prisma.week.createMany({
    data: mathWeekTitles.map((title, index) => ({
      planId: juanitaPlanId,
      position: index + 1,
      title,
      active: index + 1 === activeWeekPosition(mathScenarioId),
    })),
  });
  await prisma.rubricItem.deleteMany({ where: { planId: juanitaPlanId } });
  await prisma.rubricItem.createMany({
    data: mathRubric.map((item, index) => ({ planId: juanitaPlanId, position: index + 1, ...item })),
  });
  await prisma.planBlock.update({
    where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "evaluation-distribution" } },
    data: { variant: 1, body: JSON.stringify([30, 20, 15, 20, 15]), status: "SUGGESTED" },
  });
  await prisma.plan.update({
    where: { id: juanitaPlanId },
    data: {
      currentStep: 4,
      highestVisitedStep: 4,
      updatedAt: new Date("2026-03-10T18:00:00.000Z"),
    },
  });
}
