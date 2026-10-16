import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StepPage } from "../PlanListPage";
import { getPlan } from "../../services/planService";
import { UnitsStepPage } from "./UnitsStepPage";

vi.mock("../../services/planService", () => ({
  getPlan: vi.fn(),
  patchPlan: vi.fn(),
  continuePlan: vi.fn(),
}));

vi.mock("../../services/suggestionService", () => ({
  reanalyzeProgram: vi.fn(),
  acceptSuggestion: vi.fn(),
  regenerateSuggestion: vi.fn(),
  redistributeEvaluation: vi.fn(),
  generateImplications: vi.fn(),
  regenerateMediation: vi.fn(),
  fitFortyMinutes: vi.fn(),
  simplifyMaterials: vi.fn(),
  balanceAssessmentLoad: vi.fn(),
}));

const weeks = [
  { position: 1, title: "Fracción como parte-todo" },
  { position: 2, title: "Fracciones equivalentes" },
  { position: 3, title: "Comparación y orden" },
  { position: 4, title: "Resolución de problemas y consolidación" },
];

const rubric = [
  { name: "Prueba escrita", count: 1, percentage: 30 },
  { name: "Quices", count: 2, percentage: 20 },
  { name: "Trabajo extraclase", count: 2, percentage: 15 },
  { name: "Desempeño en clase y prácticas", count: 1, percentage: 20 },
  { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
];

describe("UnitsStepPage", () => {
  it("shows Distribución completa when the seeded mathematics rows sum to 100", () => {
    render(
      <UnitsStepPage
        weeks={weeks}
        rubric={rubric}
        justification="Las equivalencias van después de parte-todo."
        onSaveWeeks={async () => undefined}
        onSaveRubric={async () => undefined}
        onRedistribute={() => undefined}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText("Distribución completa")).toBeInTheDocument();
    expect(screen.queryByText("La distribución debe sumar 100 %.")).not.toBeInTheDocument();
  });

  it("disables Continuar when the visible percentage no longer sums to 100", async () => {
    vi.mocked(getPlan).mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      subject: "MATH",
      gradeLevel: 4,
      month: 3,
      schoolYear: 2026,
      schoolName: "Escuela República de Arabia Saudita",
      status: "DRAFT",
      currentStep: 2,
      updatedAt: "2026-03-10T18:00:00.000Z",
      teacherName: "Juanita Pérez",
      scenarioId: "mat-4-marzo-2026",
      usedFallback: false,
      highestVisitedStep: 4,
      section: "A",
      blocks: [{ blockKey: "evaluation-justification", status: "SUGGESTED", variant: 1, body: "Justificación." }],
      weeks,
      rubric,
    });
    render(
      <MemoryRouter initialEntries={["/plans/11111111-1111-4111-8111-111111111111/steps/2"]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Porcentaje 1"), { target: { value: "10" } });
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(screen.getByText("La distribución debe sumar 100 %.")).toBeInTheDocument();
  });
});
