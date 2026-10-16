import { PrismaClient } from "@prisma/client";
import { AppError, PLAN_FORBIDDEN } from "../domain/errors";
import { getPlan } from "./listPlans";

const contentFields = [
  "expectedLearning",
  "start",
  "development",
  "close",
  "materials",
  "formativeEvidence",
  "homework",
] as const;

type SessionPatch = {
  expectedLearning?: unknown;
  start?: unknown;
  development?: unknown;
  close?: unknown;
  materials?: unknown;
  formativeEvidence?: unknown;
  homework?: unknown;
  expanded?: unknown;
  occursOn?: unknown;
};

export async function updateClassSession(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  classSessionId: string,
  patch: SessionPatch,
) {
  await getPlan(prisma, sessionId, planId);
  const current = await prisma.classSession.findFirst({ where: { id: classSessionId, planId } });
  if (!current) {
    throw new AppError(404, "NOT_FOUND", PLAN_FORBIDDEN);
  }
  const data: {
    expectedLearning?: string;
    start?: string;
    development?: string;
    close?: string;
    materials?: string;
    formativeEvidence?: string;
    homework?: string | null;
    expanded?: boolean;
    occursOn?: Date;
    status?: "EDITED";
  } = {};
  for (const field of contentFields) {
    if (typeof patch[field] === "string") {
      const value = patch[field];
      if (field === "homework") {
        data.homework = value.trim().length === 0 ? null : value;
      } else {
        data[field] = value;
      }
      data.status = "EDITED";
    }
  }
  if (typeof patch.expanded === "boolean") {
    data.expanded = patch.expanded;
  }
  if (typeof patch.occursOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(patch.occursOn)) {
    const weekSessions = await prisma.classSession.findMany({
      where: { planId, weekPosition: current.weekPosition },
    });
    const dates = weekSessions.map((session) => session.occursOn.toISOString().slice(0, 10)).sort();
    const first = dates[0];
    const last = dates[dates.length - 1];
    if (!first || !last || patch.occursOn < first || patch.occursOn > last) {
      throw new AppError(422, "VALIDATION", "La fecha debe quedar dentro de esta semana.");
    }
    data.occursOn = new Date(`${patch.occursOn}T00:00:00.000Z`);
    data.status = "EDITED";
  }
  await prisma.classSession.update({ where: { id: current.id }, data });
  return getPlan(prisma, sessionId, planId);
}
