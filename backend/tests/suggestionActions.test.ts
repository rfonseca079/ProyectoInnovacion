import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const scenarioId = "mat-4-marzo-2026";

describe("stored suggestion actions", () => {
  afterAll(async () => {
    await restore("program-extract");
    await restore("month-objectives");
    await prisma.$disconnect();
  });

  async function cookie() {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    return login.headers["set-cookie"];
  }

  async function restore(blockKey: string) {
    const stored = await prisma.suggestionVariant.findUniqueOrThrow({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant: 1 } },
    });
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey } },
      data: { body: stored.body, variant: 1, status: "SUGGESTED" },
    });
  }

  it("saves a manual edit on the block route", async () => {
    await restore("month-objectives");
    const session = await cookie();
    const response = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/blocks/month-objectives`)
      .set("Cookie", session)
      .send({ body: "Objetivo escrito por la docente." });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EDITED");
    expect(response.body.body).toBe("Objetivo escrito por la docente.");
  });

  it("keeps an edited body and returns the next stored sentence", async () => {
    await restore("program-extract");
    const next = await prisma.suggestionVariant.findUniqueOrThrow({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "program-extract", variant: 2 } },
    });
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "program-extract" } },
      data: { body: "Extracto editado por la docente.", status: "EDITED", variant: 1 },
    });
    const session = await cookie();
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/program-extract/regenerate`)
      .set("Cookie", session);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EDITED");
    expect(response.body.variant).toBe(2);
    expect(response.body.body).toBe("Extracto editado por la docente.");
    expect(response.body.preview).toBe(next.body);
  });

  it("replaces an accepted body when a named action runs", async () => {
    await restore("program-extract");
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "program-extract" } },
      data: { body: "Extracto aceptado por la docente.", status: "ACCEPTED", variant: 1 },
    });
    const session = await cookie();
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/actions/reanalyze-program`)
      .set("Cookie", session);
    const block = response.body.blocks.find((item: { blockKey: string }) => item.blockKey === "program-extract");
    expect(response.status).toBe(200);
    expect(block.status).toBe("SUGGESTED");
    expect(block.body).not.toBe("Extracto aceptado por la docente.");
    expect(block.variant).toBe(2);
  });

  it("accepts the shown variant without changing its text", async () => {
    await restore("month-objectives");
    const before = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "month-objectives" } },
    });
    const session = await cookie();
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/month-objectives/accept`)
      .set("Cookie", session);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ACCEPTED");
    expect(response.body.body).toBe(before.body);
  });

  it("cycles variants 1, 2, 3, and back to 1", async () => {
    await restore("calendar-risks");
    const session = await cookie();
    const variants: number[] = [];
    for (let call = 0; call < 4; call += 1) {
      const response = await request(app)
        .post(`/api/plans/${juanitaPlanId}/blocks/calendar-risks/regenerate`)
        .set("Cookie", session);
      expect(response.status).toBe(200);
      variants.push(response.body.variant);
    }
    expect(variants).toEqual([2, 3, 1, 2]);
    await restore("calendar-risks");
  });

  it("returns the missing-variant message", async () => {
    const session = await cookie();
    const response = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/not-a-block/regenerate`)
      .set("Cookie", session);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No hay otra sugerencia guardada para este bloque.");
  });

  it("keeps an edited body when accept happens without regenerate", async () => {
    await restore("month-objectives");
    const session = await cookie();
    const edited = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/blocks/month-objectives`)
      .set("Cookie", session)
      .send({ body: "Objetivo escrito por la docente." });
    const accepted = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/month-objectives/accept`)
      .set("Cookie", session);
    expect(edited.status).toBe(200);
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe("ACCEPTED");
    expect(accepted.body.body).toBe("Objetivo escrito por la docente.");
  });

  it("stores the current variant when the teacher accepts after regenerate and reload", async () => {
    await restore("program-extract");
    const next = await prisma.suggestionVariant.findUniqueOrThrow({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "program-extract", variant: 2 } },
    });
    const session = await cookie();
    await request(app)
      .patch(`/api/plans/${juanitaPlanId}/blocks/program-extract`)
      .set("Cookie", session)
      .send({ body: "Extracto editado por la docente." });
    await request(app).post(`/api/plans/${juanitaPlanId}/blocks/program-extract/regenerate`).set("Cookie", session);
    const reloaded = await request(app).get(`/api/plans/${juanitaPlanId}`).set("Cookie", session);
    const pending = reloaded.body.blocks.find((block: { blockKey: string }) => block.blockKey === "program-extract");
    const accepted = await request(app)
      .post(`/api/plans/${juanitaPlanId}/blocks/program-extract/accept`)
      .set("Cookie", session);
    expect(pending.body).toBe("Extracto editado por la docente.");
    expect(pending.preview).toBe(next.body);
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe("ACCEPTED");
    expect(accepted.body.body).toBe(next.body);
  });

  it("uses the missing-suggestion sentence when a named action has no stored variant", async () => {
    await restore("program-extract");
    const removed = await prisma.suggestionVariant.findUniqueOrThrow({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "program-extract", variant: 2 } },
    });
    await prisma.suggestionVariant.delete({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "program-extract", variant: 2 } },
    });
    try {
      const session = await cookie();
      const response = await request(app)
        .post(`/api/plans/${juanitaPlanId}/actions/reanalyze-program`)
        .set("Cookie", session);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No hay otra sugerencia guardada para este bloque.");
    } finally {
      await prisma.suggestionVariant.create({
        data: {
          scenarioId,
          blockKey: "program-extract",
          step: removed.step,
          variant: 2,
          body: removed.body,
        },
      });
    }
  });
});
