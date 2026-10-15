import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StepPage } from "../PlanListPage";
import { getPlan, patchPlan } from "../../services/planService";
import { fitFortyMinutes } from "../../services/suggestionService";
import { MediationStepPage } from "./MediationStepPage";

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
}));

const inClass = JSON.stringify([
  {
    activity: "Activación con fichas",
    teacherRole: "Modela",
    studentRole: "Manipulan y verbalizan",
    minutes: 10,
    materials: "Círculos fraccionarios",
  },
  {
    activity: "Construcción de equivalentes",
    teacherRole: "Guía preguntas",
    studentRole: "Representan 1/2 = 2/4 = 3/6",
    minutes: 25,
    materials: "Fichas y mini pizarras",
  },
  {
    activity: "Práctica guiada",
    teacherRole: "Monitorea",
    studentRole: "Resuelven en parejas",
    minutes: 20,
    materials: "Hoja de práctica",
  },
  {
    activity: "Cierre",
    teacherRole: "Sintetiza",
    studentRole: "Comparten una regla en una frase",
    minutes: 5,
    materials: "Pizarra",
  },
]);

const outside = JSON.stringify([
  {
    task: "Buscar 3 ejemplos de fracciones equivalentes en empaques de la casa.",
    purpose: "Reconocer equivalencias en situaciones cotidianas.",
    estimatedDuration: "15 a 20 minutos",
  },
]);

const planId = "11111111-1111-4111-8111-111111111111";

describe("MediationStepPage", () => {
  it("shows both tables for the active mathematics week", async () => {
    const onFit40 = vi.fn();
    render(
      <MediationStepPage
        blocks={[
          { blockKey: "mediation-in-class", body: inClass },
          { blockKey: "mediation-outside", body: outside },
        ]}
        weeks={[{ position: 2, title: "Fracciones equivalentes" }]}
        onSaveInClass={async () => undefined}
        onSaveOutside={async () => undefined}
        onRegenerate={() => undefined}
        onFit40={onFit40}
        onSimplify={() => undefined}
      />,
    );
    expect(screen.getByRole("heading", { name: "Qué haremos para aprender" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Semana 2 — Fracciones equivalentes" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Actividad" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Hace la docente" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Hacen los estudiantes" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Tiempo" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Materiales" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Activación con fichas")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Buscar 3 ejemplos de fracciones equivalentes en empaques de la casa.")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Ajustar a 40 minutos" }));
    });
    expect(onFit40).toHaveBeenCalledOnce();
  });

  it("opens Juanita's plan on the mediation step", async () => {
    vi.mocked(getPlan).mockResolvedValue({
      id: planId,
      subject: "MATH",
      gradeLevel: 4,
      month: 3,
      schoolYear: 2026,
      schoolName: "Escuela República de Arabia Saudita",
      status: "DRAFT",
      currentStep: 4,
      updatedAt: "2026-03-10T18:00:00.000Z",
      teacherName: "Juanita Pérez",
      scenarioId: "mat-4-marzo-2026",
      usedFallback: false,
      highestVisitedStep: 4,
      section: "4.° C",
      weeks: [{ position: 2, title: "Fracciones equivalentes" }],
      blocks: [
        { blockKey: "mediation-in-class", status: "SUGGESTED", variant: 1, body: inClass },
        { blockKey: "mediation-outside", status: "SUGGESTED", variant: 1, body: outside },
      ],
    });
    render(
      <MemoryRouter initialEntries={[`/plans/${planId}/steps/4`]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Qué haremos para aprender" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Tiempo" })).toBeInTheDocument();
  });

  it("keeps the 40-minute times after a focused field finishes saving", async () => {
    const loaded = {
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
      section: "4.° C",
      weeks: [{ position: 2, title: "Fracciones equivalentes" }],
      blocks: [
        { blockKey: "mediation-in-class", status: "SUGGESTED", variant: 1, body: inClass },
        { blockKey: "mediation-outside", status: "SUGGESTED", variant: 1, body: outside },
      ],
    };
    vi.mocked(getPlan).mockResolvedValue(loaded);
    let releaseSave = () => undefined as void;
    vi.mocked(patchPlan).mockImplementation(() => new Promise((resolve) => {
      releaseSave = () => resolve();
    }));
    const forty = inClass.replace('"minutes":10', '"minutes":8').replace('"minutes":25', '"minutes":14').replace('"minutes":20', '"minutes":12').replace('"minutes":5', '"minutes":6');
    vi.mocked(fitFortyMinutes).mockResolvedValue({
      ...loaded,
      blocks: loaded.blocks.map((block) =>
        block.blockKey === "mediation-in-class" ? { ...block, body: forty, status: "SUGGESTED" } : block,
      ),
    });
    render(
      <MemoryRouter initialEntries={[`/plans/${planId}/steps/4`]}>
        <Routes>
          <Route path="/plans/:planId/steps/:step" element={<StepPage teacherName="Juanita Pérez" onLogout={() => undefined} />} />
        </Routes>
      </MemoryRouter>,
    );
    const time = await screen.findByLabelText("Tiempo 1");
    fireEvent.change(time, { target: { value: "12" } });
    fireEvent.blur(time);
    fireEvent.click(screen.getByRole("button", { name: "Ajustar a 40 minutos" }));
    expect(fitFortyMinutes).not.toHaveBeenCalled();
    await act(async () => {
      releaseSave();
    });
    expect(fitFortyMinutes).toHaveBeenCalledOnce();
    expect(await screen.findByLabelText("Tiempo 1")).toHaveValue("8");
    expect(screen.getByLabelText("Tiempo 2")).toHaveValue("14");
  });
});
