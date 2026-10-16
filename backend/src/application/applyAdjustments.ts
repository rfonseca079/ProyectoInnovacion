import { PrismaClient } from "@prisma/client";
import { StoredAdjustment } from "../../prisma/adjustmentSeed";
import { AppError } from "../domain/errors";
import { readMepDocument } from "./buildMepDocument";
import { getPlan } from "./listPlans";

export async function applyAdjustments(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
) {
  const plan = await getPlan(prisma, sessionId, planId);
  if (!plan.scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay un ajuste guardado para este escenario.");
  }
  const stored = await prisma.suggestionVariant.findUnique({
    where: {
      scenarioId_blockKey_variant: {
        scenarioId: plan.scenarioId,
        blockKey: "adjustment-week",
        variant: 1,
      },
    },
  });
  if (!stored) {
    throw new AppError(404, "NOT_FOUND", "No hay un ajuste guardado para este escenario.");
  }
  const set = JSON.parse(stored.body) as StoredAdjustment;
  await readMepDocument(prisma, sessionId, planId);
  const document = await prisma.mepDocument.findUnique({ where: { planId } });
  if (!document) {
    throw new AppError(404, "NOT_FOUND", "No hay un documento guardado para este planeamiento.");
  }
  const cards = await prisma.planBlock.findMany({
    where: { planId, blockKey: { in: ["adjustment-1", "adjustment-2", "adjustment-3"] } },
  });
  const written = (blockKey: string, index: number, base: string): string => {
    const card = cards.find((block) => block.blockKey === blockKey);
    const kept = card?.status === "EDITED" || card?.status === "ACCEPTED";
    if (!card || !kept || card.body === set.cards[index]) {
      return base;
    }
    return card.body;
  };
  await prisma.$transaction([
    prisma.classSession.updateMany({
      where: {
        planId,
        weekPosition: set.apply.weekPosition,
        position: set.apply.sessionPosition,
      },
      data: {
        start: written("adjustment-1", 0, set.apply.start),
        development: written("adjustment-2", 1, set.apply.development),
        homework: written("adjustment-3", 2, set.apply.homework),
        status: "EDITED",
      },
    }),
    prisma.mepRow.updateMany({
      where: { documentId: document.id, position: set.apply.mepRowPosition },
      data: {
        mediationStrategy: written("adjustment-1", 0, set.apply.mediationStrategy),
        indicator: set.apply.indicator,
      },
    }),
    prisma.plan.update({
      where: { id: planId },
      data: { status: "ADJUSTED", adjustmentApplied: true, updatedAt: new Date() },
    }),
  ]);
  return getPlan(prisma, sessionId, planId);
}
