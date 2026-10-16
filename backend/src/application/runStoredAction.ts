import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { AssessmentLoadBody, NO_STORED_LOAD, occursOnDate, parseAssessmentLoad, parseEvidenceCard, sameRubricNames } from "../domain/evidenceCard";
import { StoredClassSession, weekSessionBlockKey } from "../../prisma/sessionSeed";
import { getPlan } from "./listPlans";
import { shownVariant } from "../domain/suggestionCursor";

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
  body: { weekNumber?: unknown } = {},
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
  if (actionKey === "balance-assessment-load") {
    return balanceAssessmentLoad(prisma, sessionId, planId, owned.scenarioId);
  }
  if (actionKey === "generate-week-sessions") {
    return generateWeekSessions(prisma, sessionId, planId, owned.scenarioId, body.weekNumber);
  }
  if (actionKey === "duplicate-structure") {
    return duplicateStructure(prisma, sessionId, planId, body.weekNumber);
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
  const nextVariant = shownVariant(block.variant) >= 3 ? 1 : shownVariant(block.variant) + 1;
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
    throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
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
    const setIndex = Math.min(...blocks.map((block) => shownVariant(block.variant)));
    const nextVariant = setIndex >= 3 ? 1 : setIndex + 1;
    const storedByKey = new Map<string, string>();
    for (const blockKey of blockKeys) {
      const stored = await prisma.suggestionVariant.findUnique({
        where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant: nextVariant } },
      });
      if (!stored) {
        throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
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
  throw new AppError(409, "CONFLICT", "No hay otra sugerencia guardada para este bloque.");
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
    const current = shownVariant(cursor?.variant ?? 0);
    const nextVariant = current >= 3 ? 1 : current + 1;
    const stored = await prisma.suggestionVariant.findUnique({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey: actionKey, variant: nextVariant } },
    });
    if (!stored) {
      throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
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
  throw new AppError(409, "CONFLICT", "No hay otra sugerencia guardada para este bloque.");
}

function evidenceWrite(planId: string, blockKey: string, card: AssessmentLoadBody["scheduled"][number]) {
  return {
    planId,
    blockKey,
    kind: card.kind,
    position: card.position,
    title: card.title,
    measures: card.measures,
    when: card.when,
    instrument: card.instrument,
    expectedLearning: card.expectedLearning,
    occursOn: occursOnDate(card.occursOn),
  };
}

async function balanceAssessmentLoad(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string | null,
) {
  if (!scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const items = await prisma.rubricItem.findMany({ where: { planId }, orderBy: { position: "asc" } });
    const names = items.map((item) => item.name);
    const cursor = await prisma.planBlock.findUnique({
      where: { planId_blockKey: { planId, blockKey: "assessment-load" } },
    });
    if (!cursor) {
      throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
    }
    const stored = await prisma.suggestionVariant.findMany({
      where: { scenarioId, blockKey: "assessment-load" },
      orderBy: { variant: "asc" },
    });
    const shown = shownVariant(cursor.variant);
    const match = stored
      .filter((row) => row.variant !== shown)
      .sort((left, right) => {
        const leftDistance = (left.variant - shown + stored.length) % stored.length;
        const rightDistance = (right.variant - shown + stored.length) % stored.length;
        return leftDistance - rightDistance;
      })
      .map((row) => ({ row, load: parseAssessmentLoad(row.body) }))
      .find((candidate) => candidate.load && sameRubricNames(candidate.load.rubricNames, names));
    if (!match?.load) {
      throw new AppError(409, "CONFLICT", NO_STORED_LOAD);
    }
    const load = match.load;
    const claimed = await prisma.$transaction(async (tx) => {
      const updated = await tx.planBlock.updateMany({
        where: { id: cursor.id, variant: cursor.variant },
        data: { variant: match.row.variant, body: match.row.body, status: "SUGGESTED" },
      });
      if (updated.count === 0) {
        return false;
      }
      await tx.evidence.deleteMany({ where: { planId, kind: "SCHEDULED" } });
      await tx.evidence.createMany({
        data: load.scheduled.map((card) => evidenceWrite(planId, card.blockKey, card)),
      });
      for (const card of load.scheduled) {
        await tx.planBlock.updateMany({
          where: { planId, blockKey: card.blockKey },
          data: {
            body: JSON.stringify(parseEvidenceCard(JSON.stringify(card)) ?? card),
            variant: match.row.variant,
            status: "SUGGESTED",
          },
        });
      }
      if (load.updatesRubric) {
        for (const row of load.rubric) {
          await tx.rubricItem.updateMany({
            where: { planId, name: row.name },
            data: { count: row.count, percentage: row.percentage },
          });
        }
      }
      return true;
    });
    if (!claimed) {
      return getPlan(prisma, sessionId, planId);
    }
    return getPlan(prisma, sessionId, planId);
  }
  throw new AppError(409, "CONFLICT", NO_STORED_LOAD);
}

function parseStoredSessions(body: string): StoredClassSession[] | null {
  try {
    const parsed = JSON.parse(body) as StoredClassSession[];
    if (!Array.isArray(parsed) || parsed.length !== 5) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function generateWeekSessions(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  scenarioId: string | null,
  requestedWeek: unknown,
) {
  if (!scenarioId) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  const weekNumber = await selectedWeekNumber(prisma, planId, requestedWeek);
  const week = await prisma.week.findFirst({ where: { planId, position: weekNumber } });
  if (!week) {
    throw new AppError(404, "NOT_FOUND", "No hay una semana guardada con ese número.");
  }
  const blockKey = weekSessionBlockKey(weekNumber);
  const cursor = await prisma.planBlock.findUnique({
    where: { planId_blockKey: { planId, blockKey } },
  });
  if (!cursor) {
    throw new AppError(409, "CONFLICT", NO_STORED_WEEK_SET);
  }
  const nextVariant = shownVariant(cursor.variant) >= 3 ? 1 : shownVariant(cursor.variant) + 1;
  const stored = await prisma.suggestionVariant.findUnique({
    where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant: nextVariant } },
  });
  const sessions = stored ? parseStoredSessions(stored.body) : null;
  if (!stored || !sessions) {
    throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
  }
  const claimed = await prisma.$transaction(async (tx) => {
    const updated = await tx.planBlock.updateMany({
      where: { id: cursor.id, variant: cursor.variant },
      data: { variant: nextVariant, body: stored.body, status: "SUGGESTED" },
    });
    if (updated.count === 0) {
      return false;
    }
    for (const session of sessions) {
      await tx.classSession.updateMany({
        where: { planId, weekPosition: weekNumber, position: session.position },
        data: {
          day: session.day,
          occursOn: new Date(`${session.occursOn}T00:00:00.000Z`),
          expectedLearning: session.expectedLearning,
          durationMinutes: session.durationMinutes,
          start: session.start,
          development: session.development,
          close: session.close,
          materials: session.materials,
          formativeEvidence: session.formativeEvidence,
          homework: session.homework,
          expanded: session.expanded,
          status: "SUGGESTED",
          planBNote: session.planBNote,
          planBMinutes: session.planBMinutes,
        },
      });
    }
    return true;
  });
  if (!claimed) {
    return getPlan(prisma, sessionId, planId);
  }
  return getPlan(prisma, sessionId, planId);
}

const DUPLICATE_NEEDS_EXPANDED = "Abra una sesión para duplicar su estructura.";
const NO_STORED_WEEK_SET = "Esta semana no tiene otro conjunto guardado.";

async function selectedWeekNumber(prisma: PrismaClient, planId: string, requestedWeek: unknown): Promise<number> {
  const active = await prisma.week.findFirst({ where: { planId, active: true } });
  const weekNumber = requestedWeek === undefined || requestedWeek === null ? active?.position : Number(requestedWeek);
  if (!weekNumber || !Number.isInteger(weekNumber)) {
    throw new AppError(404, "NOT_FOUND", "No hay una acción guardada con ese nombre.");
  }
  return weekNumber;
}

async function duplicateStructure(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  requestedWeek: unknown,
) {
  const weekNumber = await selectedWeekNumber(prisma, planId, requestedWeek);
  const sessions = await prisma.classSession.findMany({
    where: { planId, weekPosition: weekNumber },
    orderBy: { position: "asc" },
  });
  const source = sessions.find((session) => session.expanded);
  if (!source) {
    throw new AppError(409, "CONFLICT", DUPLICATE_NEEDS_EXPANDED);
  }
  await prisma.$transaction(
    sessions
      .filter((session) => session.id !== source.id)
      .map((session) =>
        prisma.classSession.update({
          where: { id: session.id },
          data: {
            start: source.start,
            development: source.development,
            close: source.close,
            materials: source.materials,
            formativeEvidence: source.formativeEvidence,
          },
        }),
      ),
  );
  return getPlan(prisma, sessionId, planId);
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
    const setIndex = Math.min(...blocks.map((block) => shownVariant(block.variant)));
    const nextVariant = setIndex >= 3 ? 1 : setIndex + 1;
    const storedByKey = new Map<string, string>();
    for (const blockKey of implicationKeys) {
      const stored = await prisma.suggestionVariant.findUnique({
        where: {
          scenarioId_blockKey_variant: { scenarioId, blockKey, variant: nextVariant },
        },
      });
      if (!stored) {
        throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
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
  throw new AppError(409, "CONFLICT", "No hay otra sugerencia guardada para este bloque.");
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
    const nextVariant = shownVariant(block.variant) >= 3 ? 1 : shownVariant(block.variant) + 1;
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
      throw new AppError(404, "NOT_FOUND", "No hay otra sugerencia guardada para este bloque.");
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
