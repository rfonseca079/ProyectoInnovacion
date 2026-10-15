import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";

async function ownedBlock(prisma: PrismaClient, sessionId: string | undefined, planId: string, blockKey: string) {
  const owned = await getPlan(prisma, sessionId, planId);
  const block = await prisma.planBlock.findUnique({
    where: { planId_blockKey: { planId, blockKey } },
  });
  if (!block || !owned.scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
  }
  return { owned, block };
}

export async function acceptBlock(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  blockKey: string,
) {
  const { block } = await ownedBlock(prisma, sessionId, planId, blockKey);
  return prisma.planBlock.update({
    where: { id: block.id },
    data: { status: "ACCEPTED" },
    select: { blockKey: true, status: true, variant: true, body: true },
  });
}

export async function regenerateBlock(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  blockKey: string,
) {
  const { owned, block } = await ownedBlock(prisma, sessionId, planId, blockKey);
  const nextVariant = block.variant >= 3 ? 1 : block.variant + 1;
  const stored = await prisma.suggestionVariant.findUnique({
    where: {
      scenarioId_blockKey_variant: {
        scenarioId: owned.scenarioId ?? "",
        blockKey,
        variant: nextVariant,
      },
    },
  });
  if (!stored) {
    throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
  }
  const replaceBody = block.status === "SUGGESTED";
  return prisma.planBlock.update({
    where: { id: block.id },
    data: {
      variant: nextVariant,
      body: replaceBody ? stored.body : block.body,
      status: replaceBody ? "SUGGESTED" : block.status,
    },
    select: { blockKey: true, status: true, variant: true, body: true },
  });
}
