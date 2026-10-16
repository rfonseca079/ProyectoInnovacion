import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";
import { copyScenarioEvidence } from "../prisma/seedData";
import { NO_STORED_LOAD } from "../src/domain/evidenceCard";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const mathScenarioId = "mat-4-marzo-2026";

const mathRubric = [
  { name: "Prueba escrita", count: 1, percentage: 30 },
  { name: "Quices", count: 2, percentage: 20 },
  { name: "Trabajo extraclase", count: 2, percentage: 15 },
  { name: "Desempeño en clase y prácticas", count: 1, percentage: 20 },
  { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
];

describe("learning evidence", () => {
  afterAll(async () => {
    await restoreEvidence();
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("seeds formative and scheduled evidence and three loads, with the second mathematics load on 20 March", async () => {
    const loads = await prisma.suggestionVariant.findMany({
      where: { blockKey: "assessment-load" },
      orderBy: [{ scenarioId: "asc" }, { variant: "asc" }],
    });
    expect(loads).toHaveLength(9);
    const second = loads.find((row) => row.scenarioId === mathScenarioId && row.variant === 2);
    const body = JSON.parse(second?.body ?? "{}") as { scheduled: { title: string; occursOn: string | null }[] };
    expect(body.scheduled.find((card) => card.title === "Quiz 1")?.occursOn).toBe("2026-03-20");
    expect(body.scheduled.find((card) => card.title === "Prueba escrita")?.occursOn).toBe("2026-03-27");

    const cards = await prisma.evidence.findMany({ where: { planId: juanitaPlanId } });
    expect(cards.some((card) => card.kind === "FORMATIVE")).toBe(true);
    expect(cards.some((card) => card.kind === "SCHEDULED" && card.title === "Quiz 1" && card.occursOn?.toISOString().slice(0, 10) === "2026-03-13")).toBe(true);
    expect(cards.map((card) => card.title).sort()).toEqual(
      [
        "Conversación matemática en parejas",
        "Observación del material concreto",
        "Prueba escrita",
        "Práctica en clase",
        "Proyecto corto «Fracciones en mi comunidad»",
        "Quiz 1",
        "Salida rápida de 2 ítems",
        "Tres preguntas orales de chequeo",
      ].sort(),
    );
  });

  it("moves the quiz to 20 March and returns 409 when rubric names do not match", async () => {
    const cookie = await juanitaCookie();
    const balanced = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(balanced.status).toBe(200);
    const quiz = balanced.body.evidence.find((card: { title: string }) => card.title === "Quiz 1");
    const written = balanced.body.evidence.find((card: { title: string }) => card.title === "Prueba escrita");
    expect(quiz.occursOn).toBe("2026-03-20");
    expect(written.occursOn).toBe("2026-03-27");
    expect(balanced.body.rubric.map((item: { name: string }) => item.name)).toEqual(mathRubric.map((item) => item.name));

    await prisma.rubricItem.updateMany({ where: { planId: juanitaPlanId, name: "Quices" }, data: { name: "Quices renombrados" } });
    const missing = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(missing.status).toBe(409);
    expect(missing.body.message).toBe(NO_STORED_LOAD);
    const still = await prisma.evidence.findFirstOrThrow({ where: { planId: juanitaPlanId, title: "Quiz 1" } });
    expect(still.occursOn?.toISOString().slice(0, 10)).toBe("2026-03-20");
    await restoreEvidence();
  });

  it("allows step 6 when a complete scheduled card falls on a holiday", async () => {
    const cookie = await juanitaCookie();
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 5, highestVisitedStep: 5 },
    });
    await prisma.evidence.updateMany({
      where: { planId: juanitaPlanId, title: "Quiz 1" },
      data: { occursOn: new Date("2026-03-30T00:00:00.000Z") },
    });
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/5/continue`).set("Cookie", cookie);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(6);
    await restoreEvidence();
  });

  it("blocks continue when the formative column has no complete card", async () => {
    const cookie = await juanitaCookie();
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 5, highestVisitedStep: 5 },
    });
    await prisma.evidence.updateMany({
      where: { planId: juanitaPlanId, kind: "FORMATIVE" },
      data: { measures: " " },
    });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/5/continue`).set("Cookie", cookie);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Complete los campos de este paso antes de continuar.");
    expect((await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } })).currentStep).toBe(5);
    await restoreEvidence();
  });

  it("keeps an edited rubric percentage and the formative cards when the quiz moves to 20 March", async () => {
    const cookie = await juanitaCookie();
    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Quices" },
      data: { percentage: 25 },
    });
    await prisma.rubricItem.updateMany({
      where: { planId: juanitaPlanId, name: "Desempeño en clase y prácticas" },
      data: { percentage: 15 },
    });
    const balanced = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(balanced.status).toBe(200);
    const quiz = balanced.body.evidence.find((card: { title: string }) => card.title === "Quiz 1");
    const written = balanced.body.evidence.find((card: { title: string }) => card.title === "Prueba escrita");
    expect(quiz.occursOn).toBe("2026-03-20");
    expect(written.occursOn).toBe("2026-03-27");
    const quices = balanced.body.rubric.find((item: { name: string }) => item.name === "Quices");
    const practice = balanced.body.rubric.find((item: { name: string }) => item.name === "Desempeño en clase y prácticas");
    expect(quices).toMatchObject({ count: 2, percentage: 25 });
    expect(practice).toMatchObject({ count: 1, percentage: 15 });
    const formative = balanced.body.evidence.filter((card: { kind: string }) => card.kind === "FORMATIVE").map((card: { title: string }) => card.title);
    expect(formative).toEqual([
      "Tres preguntas orales de chequeo",
      "Salida rápida de 2 ítems",
      "Observación del material concreto",
      "Conversación matemática en parejas",
    ]);
    await restoreEvidence();
  });

  it("balances once when the seeded rubric names are in a different order", async () => {
    const cookie = await juanitaCookie();
    const items = await prisma.rubricItem.findMany({ where: { planId: juanitaPlanId }, orderBy: { position: "asc" } });
    await prisma.rubricItem.update({ where: { id: items[0].id }, data: { position: 100 } });
    await prisma.rubricItem.update({ where: { id: items[1].id }, data: { position: items[0].position } });
    await prisma.rubricItem.update({ where: { id: items[0].id }, data: { position: items[1].position } });
    const balanced = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(balanced.status).toBe(200);
    const quiz = balanced.body.evidence.find((card: { title: string }) => card.title === "Quiz 1");
    expect(quiz.occursOn).toBe("2026-03-20");
    await restoreEvidence();
  });

  it("applies the third mathematics load weights on a second balance", async () => {
    const cookie = await juanitaCookie();
    const first = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(first.status).toBe(200);
    const second = await request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    expect(second.status).toBe(200);
    const quices = second.body.rubric.find((item: { name: string }) => item.name === "Quices");
    const practice = second.body.rubric.find((item: { name: string }) => item.name === "Desempeño en clase y prácticas");
    expect(quices).toMatchObject({ count: 1, percentage: 10 });
    expect(practice).toMatchObject({ percentage: 30 });
    await restoreEvidence();
  });

  it("applies only the 20 March load when two balance requests overlap", async () => {
    const cookie = await juanitaCookie();
    let releaseLock = (): void => undefined;
    const released = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    const lock = prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw`
          SELECT id FROM "PlanBlock"
          WHERE "planId" = ${juanitaPlanId} AND "blockKey" = 'assessment-load'
          FOR UPDATE
        `;
        await released;
      },
      { timeout: 20000 },
    );
    const post = () => request(app).post(`/api/plans/${juanitaPlanId}/actions/balance-assessment-load`).set("Cookie", cookie);
    const first = post();
    const second = post();
    const both = Promise.all([first, second]);
    try {
      await waitForPlanBlockLockWaits(2);
    } finally {
      releaseLock();
      await Promise.all([both, lock]);
    }
    try {
      const quiz = await prisma.evidence.findFirstOrThrow({ where: { planId: juanitaPlanId, title: "Quiz 1" } });
      const quices = await prisma.rubricItem.findFirstOrThrow({ where: { planId: juanitaPlanId, name: "Quices" } });
      expect(quiz.occursOn?.toISOString().slice(0, 10)).toBe("2026-03-20");
      expect(quices.count).toBe(2);
      expect(quices.percentage).toBe(20);
    } finally {
      await restoreEvidence();
    }
  });
});

async function waitForPlanBlockLockWaits(expected: number): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < 3000) {
    const rows = await prisma.$queryRaw<{ waiting: number }[]>`
      SELECT COUNT(*)::int AS waiting
      FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock'
    `;
    if (rows[0]?.waiting >= expected) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`expected ${expected} sessions waiting on PlanBlock`);
}

async function juanitaCookie(): Promise<string[]> {
  const login = await request(app).post("/api/auth/login").send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}

async function restoreEvidence(): Promise<void> {
  await copyScenarioEvidence(prisma, juanitaPlanId, mathScenarioId);
  await prisma.rubricItem.deleteMany({ where: { planId: juanitaPlanId } });
  await prisma.rubricItem.createMany({
    data: mathRubric.map((item, index) => ({ planId: juanitaPlanId, position: index + 1, ...item })),
  });
  await prisma.plan.update({
    where: { id: juanitaPlanId },
    data: { currentStep: 4, highestVisitedStep: 4, updatedAt: new Date("2026-03-10T18:00:00.000Z") },
  });
}
