import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StepPage } from "./PlanListPage";
import { getPlan } from "../services/planService";

vi.mock("../services/planService", () => ({
  getPlan: vi.fn(),
  patchPlan: vi.fn(),
  continuePlan: vi.fn(),
}));

vi.mock("../services/suggestionService", () => ({
  reanalyzeProgram: vi.fn(),
  acceptSuggestion: vi.fn(),
  regenerateSuggestion: vi.fn(),
}));

const planId = "11111111-1111-4111-8111-111111111111";

function programPlan(objectives: string) {
  return {
    id: planId,
    subject: "MATH",
    gradeLevel: 4,
    month: 3,
    schoolYear: 2026,
    schoolName: "Escuela República de Arabia Saudita",
    status: "DRAFT" as const,
    currentStep: 1,
    updatedAt: "2026-03-10T18:00:00.000Z",
    teacherName: "Juanita Pérez",
    scenarioId: "mat-4-marzo-2026",
    usedFallback: false,
    highestVisitedStep: 4,
    section: "A",
    blocks: [
      { blockKey: "program-extract", status: "SUGGESTED", variant: 1, body: "Extracto del programa de Matemática 4.°" },
      {
        blockKey: "available-time",
        status: "SUGGESTED",
        variant: 1,
        body: JSON.stringify({ plannableLessons: "18", affectedLessons: "2" }),
      },
      { blockKey: "calendar-restrictions", status: "SUGGESTED", variant: 1, body: "Consejo de docentes el 6 de marzo." },
      { blockKey: "month-objectives", status: "SUGGESTED", variant: 1, body: objectives },
      { blockKey: "month-contents", status: "SUGGESTED", variant: 1, body: "El mes alcanza para parte-todo." },
      { blockKey: "calendar-risks", status: "SUGGESTED", variant: 1, body: "Se recomienda redistribuir la introducción." },
    ],
    calendarDays: [{ date: "2026-03-06", kind: "SUSPENDED", label: "Consejo de docentes" }],
  };
}

function renderStep() {
  render(
    <MemoryRouter initialEntries={[`/plans/${planId}/steps/1`]}>
      <Routes>
        <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProgramStepPage", () => {
  it("shows the calendar legend and blocks Continuar when a card is empty", async () => {
    vi.mocked(getPlan).mockResolvedValue(programPlan(""));
    renderStep();
    const legend = await screen.findByRole("list", { name: "Leyenda del calendario" });
    expect(legend).toHaveTextContent("Lectivo");
    expect(legend).toHaveTextContent("Feriado");
    expect(legend).toHaveTextContent("Suspendido");
    expect(legend).toHaveTextContent("Evaluación");
    expect(screen.getByRole("gridcell", { name: "6 de marzo, Suspendido" })).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "1 de marzo" })).toBeInTheDocument();
    expect(screen.queryByRole("gridcell", { name: "1 de marzo, Lectivo" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("enables Continuar when the extract, lessons, and three cards have text", async () => {
    vi.mocked(getPlan).mockResolvedValue(programPlan("Priorizar parte-todo."));
    renderStep();
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeEnabled();
    const objectives = screen.getByRole("textbox", { name: "Objetivos priorizados del mes" });
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    expect(objectives).toHaveFocus();
  });
});
