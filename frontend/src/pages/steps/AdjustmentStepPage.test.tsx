import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AdjustmentStepPage } from "./AdjustmentStepPage";
import { MepDocumentView, MepStepPage } from "./MepStepPage";

const document: MepDocumentView = {
  regionalDirectorate: "Dirección Regional San José",
  schoolName: "Liceo Experimental de San Pedro",
  teacherName: "María Solís",
  subjectLabel: "Ciencias",
  gradeLabel: "7.° año",
  schoolYear: 2026,
  periodicity: "Mensual — Febrero",
  competencies: "Pensamiento científico",
  observations: "La observación precede al esquema.",
  instruments: ["Informe de observación"],
  rows: [
    {
      position: 1,
      expectedLearning: "reconocer las partes de la célula",
      mediationStrategy: "Observación guiada de la célula",
      indicator: "rotula las partes observadas",
    },
  ],
};

const blocks = [
  { blockKey: "adjustment-planned", body: "Observar la célula y cerrar con las partes vistas." },
  { blockKey: "adjustment-executed", body: "La observación empezó." },
  { blockKey: "adjustment-achieved", body: "Ubicar la célula en el microscopio." },
  { blockKey: "adjustment-pending", body: "Nombrar las partes observadas." },
  { blockKey: "adjustment-collected-evidence", body: "El registro del cuaderno quedó incompleto." },
  { blockKey: "adjustment-log", body: "El montaje del microscopio tomó más tiempo del previsto." },
  { blockKey: "adjustment-1", body: "Reprogramar el cierre de la observación de células al inicio de la siguiente lección." },
  { blockKey: "adjustment-2", body: "Acortar la observación guiada." },
  { blockKey: "adjustment-3", body: "Dejar un registro breve en el cuaderno." },
];

const sessions = [
  { day: "Lunes", occursOn: "2026-02-02", expectedLearning: "Observación guiada de la célula", start: "Inicio de la observación" },
  { day: "Martes", occursOn: "2026-02-03", expectedLearning: "Repaso breve de Partes de la célula.", start: "5 min de repaso." },
];

function DocumentStep() {
  const location = useLocation();
  const notice = (location.state as { adjustmentNotice?: string } | null)?.adjustmentNotice ?? "";
  return (
    <MepStepPage
      document={document}
      status="READY_FOR_DELIVERY"
      notice={notice}
      onSave={() => undefined}
      requestPdf={() => Promise.resolve({ blob: new Blob(), filename: "planeamiento.pdf" })}
    />
  );
}

function renderStep(adjustmentApplied: boolean) {
  render(
    <MemoryRouter initialEntries={["/plans/plan-1/steps/8"]}>
      <Routes>
        <Route
          path="/plans/:planId/steps/8"
          element={
            <AdjustmentStepPage
              adjustmentApplied={adjustmentApplied}
              notifyEvaluationChanges={false}
              blocks={blocks}
              sessions={sessions}
              onSaveField={() => Promise.resolve()}
              onToggle={() => Promise.resolve()}
              onApply={() => Promise.resolve()}
              onAccept={() => undefined}
              onRegenerate={() => undefined}
            />
          }
        />
        <Route path="/plans/:planId/steps/7" element={<DocumentStep />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdjustmentStepPage", () => {
  it("shows the return notice when no adjustment was applied", async () => {
    renderStep(false);
    fireEvent.click(screen.getByRole("button", { name: "Volver al formato MEP actualizado" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Aún no hay ajustes aplicados.");
  });

  it("does not save an adjustment card when its text did not change", () => {
    const onSaveField = vi.fn(() => Promise.resolve());
    render(
      <MemoryRouter initialEntries={["/plans/plan-1/steps/8"]}>
        <Routes>
          <Route
            path="/plans/:planId/steps/8"
            element={
              <AdjustmentStepPage
                adjustmentApplied={false}
                notifyEvaluationChanges={false}
                blocks={blocks}
                sessions={sessions}
                onSaveField={onSaveField}
                onToggle={() => Promise.resolve()}
                onApply={() => Promise.resolve()}
                onAccept={() => undefined}
                onRegenerate={() => undefined}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    const card = screen.getByRole("textbox", { name: "Ajuste 1" });
    fireEvent.blur(card);
    expect(onSaveField).not.toHaveBeenCalled();
  });
});
