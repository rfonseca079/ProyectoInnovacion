import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";
import { renderWeekPdf, weekPdfFilename } from "./renderWeekPdf";

export async function downloadWeekPdf(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  weekText: string,
) {
  const plan = await getPlan(prisma, sessionId, planId);
  const weekNumber = Number(weekText);
  const week = plan.weeks.find((item) => item.position === weekNumber);
  if (!week || !Number.isInteger(weekNumber)) {
    throw new AppError(404, "NOT_FOUND", "No hay una semana guardada con ese número.");
  }
  return {
    filename: weekPdfFilename(weekNumber, plan.subject, plan.month, plan.schoolYear),
    bytes: renderWeekPdf(week.sessions),
  };
}
