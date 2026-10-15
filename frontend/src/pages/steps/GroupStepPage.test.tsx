import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StepPage } from "../PlanListPage";
import { getPlan } from "../../services/planService";
import { GroupStepPage } from "./GroupStepPage";

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
}));

const blocks = [
  { blockKey: "prior-knowledge", status: "SUGGESTED", variant: 1, body: "Números naturales." },
  { blockKey: "difficulties", status: "SUGGESTED", variant: 1, body: "Equivalencias." },
  { blockKey: "resources", status: "SUGGESTED", variant: 1, body: "Fichas." },
  { blockKey: "pace", status: "SUGGESTED", variant: 1, body: "Heterogéneo." },
  { blockKey: "supports", status: "SUGGESTED", variant: 1, body: "Parejas tutoradas." },
  { blockKey: "teacher-notes", status: "SUGGESTED", variant: 1, body: "Material concreto." },
  { blockKey: "implication-manipulatives", status: "SUGGESTED", variant: 1, body: "Usar fichas." },
  { blockKey: "implication-scaffolding", status: "SUGGESTED", variant: 1, body: "Modelar la frase." },
  { blockKey: "implication-differentiation", status: "SUGGESTED", variant: 1, body: "Mitades y cuartos." },
];

describe("GroupStepPage", () => {
  it("shows the six general fields and no formal accommodation section", () => {
    render(
      <GroupStepPage
        blocks={blocks}
        onSaveField={async () => undefined}
        onGenerate={() => undefined}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByLabelText("Conocimientos previos")).toBeInTheDocument();
    expect(screen.getByLabelText("Áreas de dificultad")).toBeInTheDocument();
    expect(screen.getByLabelText("Recursos del aula")).toBeInTheDocument();
    expect(screen.getByLabelText("Ritmo del grupo")).toBeInTheDocument();
    expect(screen.getByLabelText("Apoyos requeridos")).toBeInTheDocument();
    expect(screen.getByLabelText("Observaciones de la docente")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /adecuacion/i })).not.toBeInTheDocument();
  });

  it("keeps unsaved observations when another field is saved", () => {
    const { rerender } = render(
      <GroupStepPage
        blocks={blocks}
        onSaveField={async () => undefined}
        onGenerate={async () => undefined}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    fireEvent.change(screen.getByLabelText("Observaciones de la docente"), { target: { value: "Texto nuevo sin guardar" } });
    const savedBlocks = blocks.map((block) =>
      block.blockKey === "prior-knowledge" ? { ...block, body: "Guardado desde el servidor" } : block,
    );
    rerender(
      <GroupStepPage
        blocks={savedBlocks}
        onSaveField={async () => undefined}
        onGenerate={async () => undefined}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByLabelText("Observaciones de la docente")).toHaveValue("Texto nuevo sin guardar");
    expect(screen.getByLabelText("Conocimientos previos")).toHaveValue("Guardado desde el servidor");
  });

  it("shows a failed generate message", () => {
    render(
      <GroupStepPage
        blocks={blocks}
        actionMessage="No se pudieron generar las implicaciones."
        onSaveField={async () => undefined}
        onGenerate={async () => undefined}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText("No se pudieron generar las implicaciones.")).toBeInTheDocument();
  });

  it("disables Continuar and names the field when observations are cleared", async () => {
    vi.mocked(getPlan).mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      subject: "MATH",
      gradeLevel: 4,
      month: 3,
      schoolYear: 2026,
      schoolName: "Escuela República de Arabia Saudita",
      status: "DRAFT",
      currentStep: 3,
      updatedAt: "2026-03-10T18:00:00.000Z",
      teacherName: "Juanita Pérez",
      scenarioId: "mat-4-marzo-2026",
      usedFallback: false,
      highestVisitedStep: 4,
      section: "A",
      blocks,
    });
    render(
      <MemoryRouter initialEntries={["/plans/11111111-1111-4111-8111-111111111111/steps/3"]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("button", { name: "Continuar" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Observaciones de la docente"), { target: { value: " " } });
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Complete el campo Observaciones de la docente.");
  });
});
