import { MepDocument, MepRow } from "@prisma/client";
import { renderTextPdf } from "./renderWeekPdf";

export const INSTITUTIONAL_HEADER = "Dirección Regional de Educación";

export type SavedMepDocument = MepDocument & { rows: MepRow[] };

export function renderPlanPdf(document: SavedMepDocument): Buffer {
  const rows = [...document.rows].sort((left, right) => left.position - right.position);
  const lines = [
    `${INSTITUTIONAL_HEADER}: ${document.regionalDirectorate}`,
    `Centro educativo: ${document.schoolName}`,
    `Nombre de la persona docente: ${document.teacherName}`,
    `Asignatura: ${document.subjectLabel}`,
    `Nivel: ${document.gradeLabel}`,
    `Curso lectivo: ${document.schoolYear}`,
    `Periodicidad: ${document.periodicity}`,
    `Competencias generales: ${document.competencies}`,
    ...rows.flatMap((row) => [
      `Aprendizajes esperados: ${row.expectedLearning}`,
      `Estrategias de mediación: ${row.mediationStrategy}`,
      `Indicadores: ${row.indicator}`,
    ]),
    ...document.instruments.map((instrument) => `Instrumentos de evaluación: ${instrument}`),
    `Observaciones: ${document.observations}`,
  ];
  return renderTextPdf(lines);
}
