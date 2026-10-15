import request from "supertest";
import { readFileSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";
import { stepOneBlockKeys } from "../prisma/seedData";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";

describe("program and calendar seed", () => {
  afterAll(async () => {
    const variants = await prisma.suggestionVariant.findMany({
      where: { scenarioId: "mat-4-marzo-2026", variant: 1, step: 1 },
    });
    for (const variant of variants) {
      await prisma.planBlock.update({
        where: { planId_blockKey: { planId: juanitaPlanId, blockKey: variant.blockKey } },
        data: { body: variant.body, variant: 1, status: "SUGGESTED" },
      });
    }
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

  it("stores 6 March as suspended and the community-problem extract", async () => {
    const day = await prisma.calendarDay.findFirst({
      where: {
        scenarioId: "mat-4-marzo-2026",
        date: new Date("2026-03-06T00:00:00.000Z"),
      },
    });
    expect(day?.kind).toBe("SUSPENDED");
    const marked = await prisma.calendarDay.findMany({
      where: { scenarioId: "mat-4-marzo-2026" },
      orderBy: { date: "asc" },
    });
    expect(marked.map((item) => [item.date.toISOString().slice(0, 10), item.kind])).toEqual([
      ["2026-03-06", "SUSPENDED"],
      ["2026-03-13", "ASSESSMENT"],
      ["2026-03-27", "ASSESSMENT"],
      ["2026-03-30", "HOLIDAY"],
      ["2026-03-31", "HOLIDAY"],
    ]);

    const variant = await prisma.suggestionVariant.findUnique({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "mat-4-marzo-2026",
          blockKey: "program-extract",
          variant: 3,
        },
      },
    });
    expect(variant?.body).toContain("Plantear problemas de la comunidad con fracciones.");
  });

  it("returns to extract variant 1 after three reanalyze calls", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const cookie = login.headers["set-cookie"];
    const path = `/api/plans/${juanitaPlanId}/actions/reanalyze-program`;

    const first = await request(app).post(path).set("Cookie", cookie);
    const second = await request(app).post(path).set("Cookie", cookie);
    const third = await request(app).post(path).set("Cookie", cookie);

    const extract = (body: { blocks: { blockKey: string; variant: number; body: string; status: string }[] }) =>
      body.blocks.find((block) => block.blockKey === "program-extract");

    expect(first.status).toBe(200);
    expect(extract(first.body)?.body).toContain("Ubicar fracciones en la recta numérica.");
    expect(second.status).toBe(200);
    expect(extract(second.body)?.body).toContain("Plantear problemas de la comunidad con fracciones.");
    expect(third.status).toBe(200);
    expect(extract(third.body)?.variant).toBe(1);
    expect(extract(third.body)?.status).toBe("SUGGESTED");
    expect(extract(third.body)?.body).toContain("representar fracciones propias como parte de un todo");
  });

  it("returns the edited restriction text from the plan patch", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const response = await request(app)
      .patch(`/api/plans/${juanitaPlanId}`)
      .set("Cookie", login.headers["set-cookie"])
      .send({ blocks: [{ blockKey: "calendar-restrictions", body: "Asueto revisado por la docente." }] });
    const restrictions = response.body.blocks.find(
      (block: { blockKey: string }) => block.blockKey === "calendar-restrictions",
    );
    expect(response.status).toBe(200);
    expect(restrictions.body).toBe("Asueto revisado por la docente.");
    expect(restrictions.status).toBe("EDITED");
  });

  it("keeps the edited objectives text when that card regenerates", async () => {
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "month-objectives" } },
      data: { body: "Texto editado por la docente", status: "EDITED", variant: 1 },
    });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/month-objectives/regenerate`)
      .set("Cookie", login.headers["set-cookie"]);
    expect(response.status).toBe(200);
    expect(response.body.variant).toBe(2);
    expect(response.body.status).toBe("EDITED");
    expect(response.body.body).toBe("Texto editado por la docente");
  });

  it("keeps the Spanish and science signature extracts", async () => {
    const spanish = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "esp-2-abril-2026",
          blockKey: "program-extract",
          variant: 1,
        },
      },
    });
    const science = await prisma.suggestionVariant.findUniqueOrThrow({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId: "cie-7-febrero-2026",
          blockKey: "program-extract",
          variant: 1,
        },
      },
    });
    expect(spanish.body).toContain("Extracto del programa de Español 2.° — Comprensión lectora: texto narrativo");
    expect(science.body).toContain("Extracto del programa de Ciencias 7.° — La célula como unidad de la vida");
  });

  it("records the step 1 block keys in the data model", () => {
    const document = readFileSync(path.resolve(__dirname, "../../docs/data-model.md"), "utf8");
    for (const blockKey of stepOneBlockKeys) {
      expect(document).toContain(`\`${blockKey}\``);
    }
  });
});
