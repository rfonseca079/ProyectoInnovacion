import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { occursOnDate, parseEvidenceCard } from "../domain/evidenceCard";
import { getPlan } from "./listPlans";
import { isPendingSuggestion, shownVariant, storedPendingVariant } from "../domain/suggestionCursor";

const blockSelect = { blockKey: true, status: true, variant: true, body: true } as const;

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
  const { owned, block } = await ownedBlock(prisma, sessionId, planId, blockKey);
  const shown = shownVariant(block.variant);
  const pendingBody =
    isPendingSuggestion(block.variant) && owned.scenarioId
      ? (
          await prisma.suggestionVariant.findUnique({
            where: {
              scenarioId_blockKey_variant: {
                scenarioId: owned.scenarioId,
                blockKey,
                variant: shown,
              },
            },
          })
        )?.body
      : undefined;
  const saved = await prisma.planBlock.update({
    where: { id: block.id },
    data: {
      status: "ACCEPTED",
      variant: shown,
      body: pendingBody ?? block.body,
    },
    select: blockSelect,
  });
  return { ...saved, variant: shown };
}

export async function editBlock(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  blockKey: string,
  body: unknown,
) {
  const { block } = await ownedBlock(prisma, sessionId, planId, blockKey);
  if (typeof body !== "string") {
    throw new AppError(400, "VALIDATION", "Escriba el texto del bloque.");
  }
  const saved = await prisma.planBlock.update({
    where: { id: block.id },
    data: { body, status: "EDITED", variant: shownVariant(block.variant) },
    select: blockSelect,
  });
  await syncEvidenceCard(prisma, planId, blockKey, saved.body);
  return saved;
}

export async function regenerateBlock(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  blockKey: string,
) {
  const { owned, block } = await ownedBlock(prisma, sessionId, planId, blockKey);
  const shown = shownVariant(block.variant);
  const nextVariant = shown >= 3 ? 1 : shown + 1;
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
  const nextBody = replaceBody ? stored.body : block.body;
  const saved = await prisma.planBlock.update({
    where: { id: block.id },
    data: {
      variant: replaceBody ? nextVariant : storedPendingVariant(nextVariant),
      body: nextBody,
      status: replaceBody ? "SUGGESTED" : block.status,
    },
    select: blockSelect,
  });
  await syncEvidenceCard(prisma, planId, blockKey, saved.body);
  return { ...saved, variant: nextVariant, preview: stored.body };
}

async function syncEvidenceCard(prisma: PrismaClient, planId: string, blockKey: string, body: string) {
  const card = parseEvidenceCard(body);
  if (!blockKey.startsWith("evidence-") || !card) {
    return;
  }
  await prisma.evidence.updateMany({
    where: { planId, blockKey },
    data: {
      kind: card.kind,
      position: card.position,
      title: card.title,
      measures: card.measures,
      when: card.when,
      instrument: card.instrument,
      expectedLearning: card.expectedLearning,
      occursOn: occursOnDate(card.occursOn),
    },
  });
}
