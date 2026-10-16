import { PrismaClient } from "@prisma/client";
import { AppError } from "../domain/errors";
import { getPlan } from "./listPlans";
import { renderPlanPdf, SavedMepDocument } from "./renderPlanPdf";
import { planPdfFilename } from "./renderWeekPdf";

const requiredText: { key: keyof SavedMepDocument; label: string }[] = [
  { key: "regionalDirectorate", label: "Dirección Regional de Educación" },
  { key: "schoolName", label: "Centro educativo" },
  { key: "teacherName", label: "Nombre de la persona docente" },
  { key: "subjectLabel", label: "Asignatura" },
  { key: "gradeLabel", label: "Nivel" },
  { key: "periodicity", label: "Periodicidad" },
  { key: "competencies", label: "Competencias generales" },
  { key: "observations", label: "Observaciones" },
];

export function missingDocumentField(document: SavedMepDocument): string | null {
  for (const field of requiredText) {
    const value = document[field.key];
    if (typeof value === "string" && value.trim().length === 0) {
      return field.label;
    }
  }
  if (!Number.isInteger(document.schoolYear) || document.schoolYear <= 0) {
    return "Curso lectivo";
  }
  const rows = [...document.rows].sort((left, right) => left.position - right.position);
  if (rows.length < 2) {
    return "Aprendizajes esperados";
  }
  for (const row of rows) {
    if (row.expectedLearning.trim().length === 0) {
      return "Aprendizajes esperados";
    }
    if (row.mediationStrategy.trim().length === 0) {
      return "Estrategias de mediación";
    }
    if (row.indicator.trim().length === 0) {
      return "Indicadores";
    }
  }
  return null;
}

export async function downloadPlanPdf(prisma: PrismaClient, sessionId: string | undefined, planId: string) {
  const plan = await getPlan(prisma, sessionId, planId);
  const document = await prisma.mepDocument.findUnique({ where: { planId }, include: { rows: true } });
  if (!document) {
    throw new AppError(404, "NOT_FOUND", "No hay un documento guardado para este planeamiento.");
  }
  const missing = missingDocumentField(document);
  if (missing) {
    throw new AppError(422, "VALIDATION", `Complete el campo ${missing}.`);
  }
  return {
    filename: planPdfFilename(plan.subject, plan.gradeLevel, plan.month, plan.schoolYear),
    bytes: renderPlanPdf(document),
  };
}
