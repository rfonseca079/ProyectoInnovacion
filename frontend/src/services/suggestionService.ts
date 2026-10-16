import { PlanDetail } from "./planService";

const apiUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

type PlanBlock = PlanDetail["blocks"][number];

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = (await response.json()) as { message?: string };
    throw new Error(payload.message ?? "No se pudo actualizar la sugerencia.");
  }
  return response.json() as Promise<T>;
}

export function reanalyzeProgram(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/reanalyze-program`);
}

export function redistributeEvaluation(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/redistribute-evaluation`);
}

export function generateImplications(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/generate-implications`);
}

export function regenerateMediation(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/regenerate-mediation`);
}

export function fitFortyMinutes(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/fit-40-minutes`);
}

export function simplifyMaterials(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/simplify-materials`);
}

export function balanceAssessmentLoad(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/balance-assessment-load`);
}

export function generateWeekSessions(planId: string, weekNumber: number): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/generate-week-sessions`, { weekNumber });
}

export function duplicateStructure(planId: string, weekNumber: number): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/duplicate-structure`, { weekNumber });
}

export function acceptSuggestion(planId: string, blockKey: string): Promise<PlanBlock> {
  return postJson<PlanBlock>(`/api/plans/${planId}/blocks/${blockKey}/accept`);
}

export function regenerateSuggestion(planId: string, blockKey: string): Promise<PlanBlock> {
  return postJson<PlanBlock>(`/api/plans/${planId}/blocks/${blockKey}/regenerate`);
}
