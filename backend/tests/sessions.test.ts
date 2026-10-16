import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";
import { copyPlanSessions } from "../prisma/sessionSeed";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const mathScenarioId = "mat-4-marzo-2026";

type SeededSession = {
  weekPosition: number;
  day: string;
  expanded: boolean;
  planBNote: string | null;
  planBMinutes: number | null;
};

describe("week sessions seed", () => {
  it("seeds five sessions for weeks 1 through 4 and expands Monday and Wednesday of mathematics week 2", async () => {
    const sessions = await prisma.$queryRaw<SeededSession[]>`
      SELECT "weekPosition", day, expanded, "planBNote", "planBMinutes"
      FROM "ClassSession"
      WHERE "planId" = ${juanitaPlanId}
      ORDER BY "weekPosition" ASC, position ASC
    `;
    for (const week of [1, 2, 3, 4]) {
      expect(sessions.filter((session) => session.weekPosition === week)).toHaveLength(5);
    }
    const week2 = sessions.filter((session) => session.weekPosition === 2);
    expect(week2.find((session) => session.day === "Lunes")?.expanded).toBe(true);
    expect(week2.find((session) => session.day === "Miércoles")?.expanded).toBe(true);
    expect(week2.filter((session) => session.expanded)).toHaveLength(2);
    expect(week2.find((session) => session.day === "Jueves")?.planBNote).toContain(
      "Jueves con posible afectación por actividad institucional",
    );
    expect(week2.find((session) => session.day === "Jueves")?.planBMinutes).toBe(25);
  });
});

describe("generate week sessions", () => {
  afterAll(async () => {
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
  });

  it("replaces the five sessions of the selected week with the next stored set and marks them suggested", async () => {
    const cookie = await juanitaCookie();
    const generated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/generate-week-sessions`)
      .set("Cookie", cookie)
      .send({ weekNumber: 2 });
    expect(generated.status).toBe(200);
    const sessions = await prisma.classSession.findMany({
      where: { planId: juanitaPlanId, weekPosition: 2 },
      orderBy: { position: "asc" },
    });
    expect(sessions).toHaveLength(5);
    expect(sessions.every((session) => session.status === "SUGGESTED")).toBe(true);
    expect(sessions[0]?.development).toBe("Representación solo con papel.");
    expect(sessions[3]?.planBMinutes).toBe(20);
  });
});

describe("duplicate structure", () => {
  afterAll(async () => {
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
  });

  it("returns 409 when no session is expanded", async () => {
    const cookie = await juanitaCookie();
    await prisma.classSession.updateMany({
      where: { planId: juanitaPlanId, weekPosition: 2 },
      data: { expanded: false },
    });
    const duplicated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/duplicate-structure`)
      .set("Cookie", cookie)
      .send({ weekNumber: 2 });
    expect(duplicated.status).toBe(409);
    expect(duplicated.body.message).toBe("Abra una sesión para duplicar su estructura.");
  });

  it("copies Monday's structure and keeps the other sessions' dates", async () => {
    const cookie = await juanitaCookie();
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
    const before = await prisma.classSession.findMany({
      where: { planId: juanitaPlanId, weekPosition: 2 },
      orderBy: { position: "asc" },
    });
    const duplicated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/duplicate-structure`)
      .set("Cookie", cookie)
      .send({ weekNumber: 2 });
    expect(duplicated.status).toBe(200);
    const after = await prisma.classSession.findMany({
      where: { planId: juanitaPlanId, weekPosition: 2 },
      orderBy: { position: "asc" },
    });
    const monday = before[0];
    for (const session of after.slice(1)) {
      expect(session.occursOn.toISOString().slice(0, 10)).toBe(
        before.find((row) => row.position === session.position)?.occursOn.toISOString().slice(0, 10),
      );
      expect(session.expectedLearning).toBe(before.find((row) => row.position === session.position)?.expectedLearning);
      expect(session.start).toBe(monday?.start);
      expect(session.development).toBe(monday?.development);
      expect(session.close).toBe(monday?.close);
      expect(session.materials).toBe(monday?.materials);
      expect(session.formativeEvidence).toBe(monday?.formativeEvidence);
    }
  });
});

describe("continue from sessions", () => {
  afterAll(async () => {
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 4, highestVisitedStep: 4, status: "DRAFT" },
    });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("requires learning, start, development, and close, and a complete continue sets ready for delivery", async () => {
    const cookie = await juanitaCookie();
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 6, highestVisitedStep: 6, status: "DRAFT" },
    });
    await prisma.classSession.updateMany({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 5 },
      data: { close: " " },
    });
    const blocked = await request(app).post(`/api/plans/${juanitaPlanId}/steps/6/continue`).set("Cookie", cookie);
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toBe("Complete los campos de este paso antes de continuar.");

    await prisma.classSession.updateMany({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 5 },
      data: { close: "5 min de revisión" },
    });
    const continued = await request(app).post(`/api/plans/${juanitaPlanId}/steps/6/continue`).set("Cookie", cookie);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(7);
    expect(continued.body.status).toBe("READY_FOR_DELIVERY");
  });

  it("names the week PDF semana-2-matematica-marzo-2026.pdf", async () => {
    const cookie = await juanitaCookie();
    const file = await request(app).get(`/api/plans/${juanitaPlanId}/weeks/2/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    expect(file.headers["content-type"]).toMatch(/application\/pdf/);
    expect(file.headers["content-disposition"]).toBe('attachment; filename="semana-2-matematica-marzo-2026.pdf"');
    expect(file.body.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("loads the stored set for mathematics week 1", async () => {
    const cookie = await juanitaCookie();
    const generated = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/generate-week-sessions`)
      .set("Cookie", cookie)
      .send({ weekNumber: 1 });
    expect(generated.status).toBe(200);
    const block = generated.body.blocks.find((item: { blockKey: string }) => item.blockKey === "week-sessions-1");
    expect(block.variant).toBe(2);
    expect(block.status).toBe("SUGGESTED");
    const after = await prisma.classSession.findMany({
      where: { planId: juanitaPlanId, weekPosition: 1 },
      orderBy: { position: "asc" },
    });
    expect(after.some((session) => session.development.includes("Variante 2."))).toBe(true);
    await copyPlanSessions(prisma, juanitaPlanId, mathScenarioId);
  });

  it("rejects a date outside the week and keeps the stored date", async () => {
    const cookie = await juanitaCookie();
    const tuesday = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, day: "Martes" },
    });
    const moved = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/sessions/${tuesday.id}`)
      .set("Cookie", cookie)
      .send({ occursOn: "2026-04-01" });
    expect(moved.status).toBe(422);
    expect(moved.body.message).toBe("La fecha debe quedar dentro de esta semana.");
    const still = await prisma.classSession.findFirstOrThrow({ where: { id: tuesday.id } });
    expect(still.occursOn.toISOString().slice(0, 10)).toBe("2026-03-10");
  });
});

async function juanitaCookie(): Promise<string[]> {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}
