import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mathRegenerableBlocks = [
  "program-extract",
  "available-time",
  "month-objectives",
  "month-contents",
  "calendar-risks",
  "evaluation-justification",
  "implication-manipulatives",
  "implication-scaffolding",
  "implication-differentiation",
  "mediation-in-class",
  "mediation-outside",
  "simplify-materials",
  "assessment-load",
  "week-sessions-1",
  "week-sessions-2",
  "week-sessions-3",
  "week-sessions-4",
  "adjustment-1",
  "adjustment-2",
  "adjustment-3",
];

describe("mathematics suggestion variants", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("stores three variants for every regenerable block in the mathematics extract", async () => {
    const counts: Record<string, number> = {};
    for (const blockKey of mathRegenerableBlocks) {
      counts[blockKey] = await prisma.suggestionVariant.count({
        where: { scenarioId: "mat-4-marzo-2026", blockKey },
      });
    }
    expect(counts).toEqual(Object.fromEntries(mathRegenerableBlocks.map((blockKey) => [blockKey, 3])));
  });
});
