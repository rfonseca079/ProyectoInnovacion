import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";

const actionBlockKey: Record<string, string> = {
  "reanalyze-program": "program-extract",
};

export async function runStoredAction(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  actionKey: string,
) {
  const owned = await getPlan(prisma, sessionId, planId);
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
