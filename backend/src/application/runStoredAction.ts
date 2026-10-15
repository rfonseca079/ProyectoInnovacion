import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";

const actionBlockKey: Record<string, string> = {
  "reanalyze-program": "program-extract",
};

const DISTRIBUTION_MISSING = "No hay una distribución guardada para esta cantidad de rubros.";

const implicationKeys = ["implication-manipulatives", "implication-scaffolding", "implication-differentiation"];

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
  if (actionKey === "generate-implications") {
    return generateImplications(prisma, sessionId, planId, owned.scenarioId);
  }
  if (actionKey === "regenerate-mediation" || actionKey === "fit-40-minutes" || actionKey === "simplify-materials") {
    return applyMediationAction(prisma, sessionId, planId, owned.scenarioId, actionKey);
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

async function applyMediationAction(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string | null,
  actionKey: "regenerate-mediation" | "fit-40-minutes" | "simplify-materials",
) {
  if (!scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  if (actionKey === "regenerate-mediation") {
    return replaceStoredSet(prisma, sessionId, planId, scenarioId, ["mediation-in-class", "mediation-outside"]);
  }
  return replaceFromActionList(prisma, sessionId, planId, scenarioId, actionKey);
}

async function replaceStoredSet(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string,
  blockKeys: string[],
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const blocks = await prisma.planBlock.findMany({
      where: { planId, blockKey: { in: blockKeys } },
    });
    if (blocks.length !== blockKeys.length) {
      throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
    }
    const setIndex = Math.min(...blocks.map((block) => block.variant));
    const nextVariant = setIndex >= 3 ? 1 : setIndex + 1;
    const storedByKey = new Map<string, string>();
    for (const blockKey of blockKeys) {
      const stored = await prisma.suggestionVariant.findUnique({
        where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant: nextVariant } },
      });
      if (!stored) {
        throw new AppError(404, "NOT_FOUND", "No hay otra variante guardada para este bloque.");
      }
      storedByKey.set(blockKey, stored.body);
    }
    try {
      await prisma.$transaction(async (tx) => {
        for (const block of blocks) {
          const updated = await tx.planBlock.updateMany({
            where: { id: block.id, variant: block.variant },
            data: {
              variant: nextVariant,
              body: storedByKey.get(block.blockKey) ?? "",
              status: "SUGGESTED",
            },
          });
          if (updated.count === 0) {
            throw new Error("claim-lost");
          }
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === "claim-lost") {
        continue;
      }
      throw error;
    }
    return getPlan(prisma, sessionId, planId);
  }
  throw new AppError(409, "CONFLICT", "No hay otra variante guardada para este bloque.");
}

async function replaceFromActionList(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string,
  actionKey: string,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const visible = await prisma.planBlock.findUnique({
      where: { planId_blockKey: { planId, blockKey: "mediation-in-class" } },
    });
    if (!visible) {
      throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
    }
    const cursor = await prisma.planBlock.findUnique({
      where: { planId_blockKey: { planId, blockKey: actionKey } },
    });
    const current = cursor?.variant ?? 0;
    const nextVariant = current >= 3 ? 1 : current + 1;
    const stored = await prisma.suggestionVariant.findUnique({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: actionKey, variant: nextVariant } },
    });
    if (!stored) {
      throw new AppError(404, "NOT_FOUND", "No hay otra variante guardada para este bloque.");
    }
    try {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.planBlock.updateMany({
          where: { id: visible.id, variant: visible.variant },
          data: { body: stored.body, status: "SUGGESTED" },
        });
        if (updated.count === 0) {
          throw new Error("claim-lost");
        }
        if (cursor) {
          const claimed = await tx.planBlock.updateMany({
            where: { id: cursor.id, variant: cursor.variant },
            data: { variant: nextVariant, body: stored.body, status: "SUGGESTED" },
          });
          if (claimed.count === 0) {
            throw new Error("claim-lost");
          }
        } else {
          await tx.planBlock.create({
            data: {
              planId,
              blockKey: actionKey,
              status: "SUGGESTED",
              variant: nextVariant,
              body: stored.body,
            },
          });
        }
      });
    } catch (error) {
      if (isClaimRetry(error)) {
        continue;
      }
      throw error;
    }
    return getPlan(prisma, sessionId, planId);
  }
  throw new AppError(409, "CONFLICT", "No hay otra variante guardada para este bloque.");
}

function isClaimRetry(error: unknown): boolean {
  if (error instanceof Error && error.message === "claim-lost") {
    return true;
  }
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function generateImplications(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string | null,
) {
  if (!scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const blocks = await prisma.planBlock.findMany({
      where: { planId, blockKey: { in: implicationKeys } },
    });
    if (blocks.length !== implicationKeys.length) {
      throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
    }
    const setIndex = Math.min(...blocks.map((block) => block.variant));
    const nextVariant = setIndex >= 3 ? 1 : setIndex + 1;
    const storedByKey = new Map<string, string>();
    for (const blockKey of implicationKeys) {
      const stored = await prisma.suggestionVariant.findUnique({
        where: {
          scenarioId_blockKey_variant: { scenarioId, blockKey, variant: nextVariant },
        },
      });
      if (!stored) {
        throw new AppError(404, "NOT_FOUND", "No hay otra variante guardada para este bloque.");
      }
      storedByKey.set(blockKey, stored.body);
    }
    try {
      await prisma.$transaction(async (tx) => {
        for (const block of blocks) {
          const updated = await tx.planBlock.updateMany({
            where: { id: block.id, variant: block.variant },
            data: {
              variant: nextVariant,
              body: storedByKey.get(block.blockKey) ?? "",
              status: "SUGGESTED",
            },
          });
          if (updated.count === 0) {
            throw new Error("claim-lost");
          }
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === "claim-lost") {
        continue;
      }
      throw error;
    }
    return getPlan(prisma, sessionId, planId);
  }
  throw new AppError(409, "CONFLICT", "No hay otra variante guardada para este bloque.");
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
