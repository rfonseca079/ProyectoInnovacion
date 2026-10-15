import { PlanDetail } from "./planService";

const apiUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

type PlanBlock = PlanDetail["blocks"][number];

async function postJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { method: "POST", credentials: "include" });
  if (!response.ok) {
    const body = (await response.json()) as { message?: string };
    throw new Error(body.message ?? "No se pudo actualizar la sugerencia.");
  }
  return response.json() as Promise<T>;
}

export function reanalyzeProgram(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/reanalyze-program`);
}

export function redistributeEvaluation(planId: string): Promise<PlanDetail> {
  return postJson<PlanDetail>(`/api/plans/${planId}/actions/redistribute-evaluation`);
}

export function acceptSuggestion(planId: string, blockKey: string): Promise<PlanBlock> {
  return postJson<PlanBlock>(`/api/plans/${planId}/blocks/${blockKey}/accept`);
}

export function regenerateSuggestion(planId: string, blockKey: string): Promise<PlanBlock> {
  return postJson<PlanBlock>(`/api/plans/${planId}/blocks/${blockKey}/regenerate`);
}
