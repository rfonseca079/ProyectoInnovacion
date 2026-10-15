import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StepPage } from "./PlanListPage";
import { getPlan } from "../services/planService";

vi.mock("../services/planService", () => ({
  getPlan: vi.fn(),
  patchPlan: vi.fn(),
  continuePlan: vi.fn(),
}));

const planId = "11111111-1111-4111-8111-111111111111";

function juanitaPlan() {
  return {
    id: planId,
    subject: "MATH",
    gradeLevel: 4,
    month: 3,
    schoolYear: 2026,
    schoolName: "Escuela República de Arabia Saudita",
    status: "DRAFT" as const,
    currentStep: 4,
    updatedAt: "2026-03-10T18:00:00.000Z",
    teacherName: "Juanita Pérez",
    scenarioId: "mat-4-marzo-2026",
    usedFallback: false,
    highestVisitedStep: 4,
    section: "A",
    blocks: [],
  };
}

function renderStep(step: string) {
  render(
    <MemoryRouter initialEntries={[`/plans/${planId}/steps/${step}`]}>
      <Routes>
        <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("StepPage address", () => {
  it("returns a negative step address to the highest visited step", async () => {
    vi.mocked(getPlan).mockResolvedValue(juanitaPlan());
    renderStep("-1");
    expect(await screen.findByText("Paso 4 de 8")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });

  it("returns a step above 8 to the highest visited step", async () => {
    vi.mocked(getPlan).mockResolvedValue({ ...juanitaPlan(), highestVisitedStep: 8, currentStep: 8 });
    renderStep("9");
    expect(await screen.findByText("Paso 8 de 8")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continuar" })).not.toBeInTheDocument();
  });
});
