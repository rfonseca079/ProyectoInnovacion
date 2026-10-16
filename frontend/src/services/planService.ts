import { PlanDraft } from "../pages/PlanConfigPage";
import { MepDocumentView } from "../pages/steps/MepStepPage";
import { PlanSummary } from "./planLabels";

export type PlanDetail = PlanSummary & {
  teacherName: string;
  scenarioId: string | null;
  usedFallback: boolean;
  highestVisitedStep: number;
  adjustmentApplied?: boolean;
  notifyEvaluationChanges?: boolean;
  blocks: { blockKey: string; status: string; variant: number; body: string; preview?: string }[];
  calendarDays?: { date: string; kind: string; label: string }[];
  weeks?: {
    position: number;
    title: string;
    active?: boolean;
    sessions?: {
      id: string;
      position: number;
      day: string;
      occursOn: string;
      expectedLearning: string;
      durationMinutes: number;
      start: string;
      development: string;
      close: string;
      materials: string;
      formativeEvidence: string;
      homework: string | null;
      expanded: boolean;
      status: string;
      planBNote: string | null;
      planBMinutes: number | null;
    }[];
  }[];
  rubric?: { name: string; count: number; percentage: number }[];
  evidence?: {
    blockKey: string;
    kind: "FORMATIVE" | "SCHEDULED";
    position: number;
    title: string;
    measures: string;
    when: string;
    instrument: string;
    expectedLearning: string;
    occursOn: string | null;
  }[];
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

export async function saveClassSession(
  planId: string,
  sessionId: string,
  patch: Record<string, unknown>,
): Promise<PlanDetail> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/sessions/${sessionId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    throw new Error("No se pudo guardar el borrador. Intente de nuevo.");
  }
  return response.json() as Promise<PlanDetail>;
}

export async function getMepDocument(planId: string): Promise<MepDocumentView> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/document`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("No se pudo abrir el documento.");
  }
  return response.json() as Promise<MepDocumentView>;
}

export async function patchMepDocument(planId: string, patch: Partial<MepDocumentView>): Promise<MepDocumentView> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/document`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    throw new Error("No se pudo guardar el documento.");
  }
  return response.json() as Promise<MepDocumentView>;
}

export async function fetchPlanPdf(planId: string): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/document/pdf`, { credentials: "include" });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo descargar el PDF.");
  }
  const header = response.headers.get("Content-Disposition") ?? "";
  const match = /filename="([^"]+)"/.exec(header);
  return {
    blob: await response.blob(),
    filename: match?.[1] ?? "planeamiento.pdf",
  };
}

export async function applyAdjustments(planId: string): Promise<PlanDetail> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/adjustments/apply`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudieron aplicar los ajustes.");
  }
  return response.json() as Promise<PlanDetail>;
}

export async function downloadWeekPdf(planId: string, weekNumber: number): Promise<void> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}/weeks/${weekNumber}/pdf`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("No se pudo exportar la semana.");
  }
  const header = response.headers.get("Content-Disposition") ?? "";
  const match = /filename="([^"]+)"/.exec(header);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = match?.[1] ?? `semana-${weekNumber}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
