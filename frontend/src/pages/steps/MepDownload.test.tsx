import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { StepPage } from "../PlanListPage";
import { MepDocumentView } from "./MepStepPage";
import { fetchPlanPdf, getMepDocument, getPlan, patchMepDocument } from "../../services/planService";

vi.mock("../../services/planService", () => ({
  getPlan: vi.fn(),
  patchPlan: vi.fn(),
  continuePlan: vi.fn(),
  saveClassSession: vi.fn(),
  downloadWeekPdf: vi.fn(),
  getMepDocument: vi.fn(),
  patchMepDocument: vi.fn(),
  fetchPlanPdf: vi.fn(),
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

const document: MepDocumentView = {
  regionalDirectorate: "Dirección Regional San José",
  schoolName: "Escuela República de Arabia Saudita",
  teacherName: "Juanita Pérez",
  subjectLabel: "Matemática",
  gradeLabel: "4.° año",
  schoolYear: 2026,
  periodicity: "Mensual — Marzo",
  competencies: "Ciudadanía responsable y solidaria",
  observations: "Frase anterior del documento.",
  instruments: ["Lista de cotejo"],
  rows: [
    { position: 1, expectedLearning: "reconocer fracciones", mediationStrategy: "material concreto", indicator: "representa dos fracciones" },
    { position: 2, expectedLearning: "resolver un problema", mediationStrategy: "práctica en parejas", indicator: "explica la equivalencia" },
  ],
};

describe("MEP download", () => {
  it("waits for the observation save already in flight before requesting the PDF", async () => {
    let resolveSave: (value: MepDocumentView) => void = () => undefined;
    vi.mocked(getPlan).mockResolvedValue({
      id: planId,
      subject: "MATH",
      gradeLevel: 4,
      month: 3,
      schoolYear: 2026,
      schoolName: "Escuela República de Arabia Saudita",
      status: "READY_FOR_DELIVERY",
      currentStep: 7,
      updatedAt: "2026-03-10T18:00:00.000Z",
      teacherName: "Juanita Pérez",
      scenarioId: "mat-4-marzo-2026",
      usedFallback: false,
      highestVisitedStep: 7,
      section: "A",
      adjustmentApplied: false,
      blocks: [],
      weeks: [],
    });
    vi.mocked(getMepDocument).mockResolvedValue(document);
    vi.mocked(patchMepDocument).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:preview") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    vi.mocked(fetchPlanPdf).mockResolvedValue({
      blob: new Blob(["%PDF"]),
      filename: "planeamiento-matematica-4-marzo-2026.pdf",
    });
    render(
      <MemoryRouter initialEntries={[`/plans/${planId}/steps/7`]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Editar campos" }));
    const notes = screen.getByRole("textbox", { name: "Observaciones" });
    fireEvent.change(notes, { target: { value: "Observación nueva para la entrega." } });
    fireEvent.blur(notes);
    fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
    expect(fetchPlanPdf).not.toHaveBeenCalled();
    await act(async () => {
      resolveSave({ ...document, observations: "Observación nueva para la entrega." });
    });
    expect(fetchPlanPdf).toHaveBeenCalledWith(planId);
  });
});
