import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";

const actionBlockKey: Record<string, string> = {
  "reanalyze-program": "program-extract",
};

const DISTRIBUTION_MISSING = "No hay una distribución guardada para esta cantidad de rubros.";

export async function runStoredAction(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  actionKey: string,
) {
  const owned = await getPlan(prisma, sessionId, planId);
  if (actionKey === "redistribute-evaluation") {
    return redistributeEvaluation(prisma, sessionId, planId, owned.scenarioId);
  }
  const blockKey = actionBlockKey[actionKey];
  if (!blockKey || !owned.scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  const block = await prisma.planBlock.findUnique({
    where: { planId_blockKey: { planId, blockKey } },
  });
  if (!block) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  const nextVariant = block.variant >= 3 ? 1 : block.variant + 1;
  const stored = await prisma.suggestionVariant.findUnique({
    where: {
      scenarioId_blockKey_variant: {
        scenarioId: owned.scenarioId,
        blockKey,
        variant: nextVariant,
      },
    },
  });
  if (!stored) {
    throw new AppError(404, "NOT_FOUND", "No hay otra variante guardada para este bloque.");
  }
  await prisma.planBlock.update({
    where: { id: block.id },
    data: { body: stored.body, variant: nextVariant, status: "SUGGESTED" },
  });
  return getPlan(prisma, sessionId, planId);
}

async function redistributeEvaluation(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string | null,
) {
  if (!scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const block = await prisma.planBlock.findUnique({
      where: { planId_blockKey: { planId, blockKey: "evaluation-distribution" } },
    });
    if (!block) {
      throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
    }
    const items = await prisma.rubricItem.findMany({
      where: { planId },
      orderBy: { position: "asc" },
    });
    const nextVariant = block.variant >= 3 ? 1 : block.variant + 1;
    const stored = await prisma.suggestionVariant.findUnique({
      where: {
        scenarioId_blockKey_variant: {
          scenarioId,
          blockKey: "evaluation-distribution",
          variant: nextVariant,
        },
      },
    });
    if (!stored) {
      throw new AppError(404, "NOT_FOUND", "No hay otra variante guardada para este bloque.");
    }
    const percentages = JSON.parse(stored.body) as number[];
    if (!Array.isArray(percentages) || percentages.length !== items.length) {
      throw new AppError(409, "CONFLICT", DISTRIBUTION_MISSING);
    }
    const claimed = await prisma.$transaction(async (tx) => {
      const updated = await tx.planBlock.updateMany({
        where: { id: block.id, variant: block.variant },
        data: { variant: nextVariant, body: stored.body, status: "SUGGESTED" },
      });
      if (updated.count === 0) {
        return false;
      }
      for (let index = 0; index < items.length; index += 1) {
        await tx.rubricItem.update({
          where: { id: items[index].id },
          data: { percentage: percentages[index] },
        });
      }
      return true;
    });
    if (!claimed) {
      continue;
    }
    return getPlan(prisma, sessionId, planId);
  }
  throw new AppError(409, "CONFLICT", DISTRIBUTION_MISSING);
}
