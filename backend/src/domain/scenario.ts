import { Cycle, PrismaClient, Subject } from "@prisma/client";

export const FALLBACK_SCENARIO_ID = "mat-4-marzo-2026";
export const GRADE_OUTSIDE_CYCLE = "Seleccione un nivel del ciclo elegido.";

const gradesByCycle: Record<Cycle, number[]> = {
  I_II: [1, 2, 3, 4, 5, 6],
  III: [7, 8, 9],
  DIVERSIFIED: [10, 11],
};

export function gradeBelongsToCycle(cycle: Cycle, gradeLevel: number): boolean {
  return gradesByCycle[cycle].includes(gradeLevel);
}

export async function resolveScenario(
  prisma: PrismaClient,
  schoolYear: number,
  subject: Subject,
  gradeLevel: number,
  month: number,
): Promise<{ scenarioId: string; usedFallback: boolean }> {
  const match = await prisma.scenario.findUnique({
    where: {
      schoolYear_subject_gradeLevel_month: { schoolYear, subject, gradeLevel, month },
    },
  });
  if (!match) {
    return { scenarioId: FALLBACK_SCENARIO_ID, usedFallback: true };
  }
  return { scenarioId: match.id, usedFallback: false };
}
