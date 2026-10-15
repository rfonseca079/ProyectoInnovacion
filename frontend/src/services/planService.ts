import { PlanDraft } from "../pages/PlanConfigPage";
import { PlanSummary } from "./planLabels";

export type PlanDetail = PlanSummary & {
  teacherName: string;
  scenarioId: string | null;
  usedFallback: boolean;
  highestVisitedStep: number;
  blocks: { blockKey: string; status: string; variant: number; body: string }[];
};

const apiUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

export async function listPlans(): Promise<PlanSummary[]> {
  const response = await fetch(`${apiUrl}/api/plans`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("No se pudieron cargar los planeamientos.");
  }
  return response.json() as Promise<PlanSummary[]>;
}

export async function patchPlan(planId: string, body: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("No se pudo guardar el borrador. Intente de nuevo.");
  }
}

export async function continuePlan(planId: string, step: number): Promise<PlanDetail> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/steps/${step}/continue`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const body = (await response.json()) as { message?: string };
    throw new Error(body.message ?? "No se pudo continuar.");
  }
  return response.json() as Promise<PlanDetail>;
}

export async function getPlan(planId: string): Promise<PlanDetail> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}`, { credentials: "include" });
  if (!response.ok) {
    const body = (await response.json()) as { message?: string };
    throw new Error(
      response.status === 404 ? (body.message ?? "No tiene acceso a este planeamiento.") : "No se pudo abrir el planeamiento.",
    );
  }
  return response.json() as Promise<PlanDetail>;
}

export async function createPlan(draft: PlanDraft): Promise<PlanDetail> {
  const response = await fetch(`${apiUrl}/api/plans`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...draft,
      gradeLevel: Number(draft.gradeLevel),
      schoolYear: Number(draft.schoolYear),
      month: Number(draft.month),
      studentCount: Number(draft.studentCount),
      weeklyLessons: Number(draft.weeklyLessons),
    }),
  });
  if (!response.ok) {
    const body = (await response.json()) as { message?: string };
    throw new Error(body.message ?? "No se pudo crear el planeamiento.");
  }
  return response.json() as Promise<PlanDetail>;
}
