import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { StepPage } from "../PlanListPage";
import { downloadWeekPdf, getPlan, saveClassSession } from "../../services/planService";

vi.mock("../../services/planService", () => ({
  getPlan: vi.fn(),
  patchPlan: vi.fn(),
  continuePlan: vi.fn(),
  saveClassSession: vi.fn(),
  downloadWeekPdf: vi.fn(),
}));

vi.mock("../../services/suggestionService", () => ({
  acceptSuggestion: vi.fn(),
  balanceAssessmentLoad: vi.fn(),
  duplicateStructure: vi.fn(),
  fitFortyMinutes: vi.fn(),
  generateImplications: vi.fn(),
  generateWeekSessions: vi.fn(),
  reanalyzeProgram: vi.fn(),
  redistributeEvaluation: vi.fn(),
  regenerateMediation: vi.fn(),
  regenerateSuggestion: vi.fn(),
  simplifyMaterials: vi.fn(),
}));

const planId = "11111111-1111-4111-8111-111111111111";

const plan = {
  id: planId,
  subject: "MATH",
  gradeLevel: 4,
  month: 3,
  schoolYear: 2026,
  schoolName: "Escuela República de Arabia Saudita",
  status: "DRAFT" as const,
  currentStep: 6,
  updatedAt: "2026-03-10T18:00:00.000Z",
  teacherName: "Juanita Pérez",
  scenarioId: "mat-4-marzo-2026",
  usedFallback: false,
  highestVisitedStep: 6,
  section: "A",
  blocks: [],
  weeks: [
    {
      position: 2,
      title: "Fracciones equivalentes",
      active: true,
      sessions: [
        {
          id: "mon",
          position: 1,
          day: "Lunes",
          occursOn: "2026-03-09",
          expectedLearning: "reconocer fracciones equivalentes",
          durationMinutes: 40,
          start: "10 min",
          development: "práctica",
          close: "5 min",
          materials: "círculos",
          formativeEvidence: "observación",
          homework: null,
          expanded: true,
          status: "SUGGESTED",
          planBNote: null,
          planBMinutes: null,
        },
      ],
    },
  ],
};

describe("week export", () => {
  it("waits for the session save already in flight before downloading the PDF", async () => {
    let resolveSave: (value: typeof plan) => void = () => undefined;
    vi.mocked(saveClassSession).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );
    vi.mocked(downloadWeekPdf).mockResolvedValue(undefined);
    vi.mocked(getPlan).mockResolvedValue(plan);
    render(
      <MemoryRouter initialEntries={[`/plans/${planId}/steps/6`]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    const learning = await screen.findByLabelText("Aprendizaje esperado de Lunes");
    fireEvent.change(learning, { target: { value: "texto nuevo" } });
    fireEvent.blur(learning);
    fireEvent.click(screen.getByRole("button", { name: "Exportar semana" }));
    expect(downloadWeekPdf).not.toHaveBeenCalled();
    await act(async () => {
      resolveSave(plan);
    });
    expect(downloadWeekPdf).toHaveBeenCalledWith(planId, 2);
  });
});
