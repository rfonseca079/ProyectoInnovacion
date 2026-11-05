import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { WizardChrome } from "./WizardChrome";

const planId = "11111111-1111-4111-8111-111111111111";

function renderChrome(step: number, highestVisitedStep = 4) {
  render(
    <MemoryRouter initialEntries={[`/plans/${planId}/steps/${step}`]}>
      <Routes>
        <Route
          path="/plans/:planId/steps/:step"
          element={
            <WizardChrome
              planId={planId}
              step={step}
              highestVisitedStep={highestVisitedStep}
              subjectLabel="Matemática"
              gradeLevel={4}
              schoolName="Escuela República de Arabia Saudita"
              teacherName="Juanita Pérez"
              onLogout={() => undefined}
              onContinue={() => undefined}
            />
          }
        />
        <Route path="/planeamientos" element={<h2>Mis planeamientos</h2>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WizardChrome", () => {
  it("hides the step indicator on configuration and shows the nine labels", () => {
    renderChrome(0);
    expect(screen.getByRole("heading", { name: "EduAcompaña" })).toBeInTheDocument();
    expect(screen.queryByText(/Paso \d de 8/)).not.toBeInTheDocument();
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("4.° año")).toBeInTheDocument();
    expect(screen.getByText("Escuela República de Arabia Saudita")).toBeInTheDocument();
    expect(screen.getByText("Juanita Pérez")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mis planeamientos" })).toHaveAttribute("href", "/planeamientos");
    for (const label of [
      "0 Configuración",
      "1 Programa y calendario",
      "2 Unidades y evaluación",
      "3 Grupo",
      "4 Mediación",
      "5 Evidencias de aprendizaje",
      "6 Sesiones",
      "7 Formato MEP / PDF",
      "8 Ajuste post-clase",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows Paso X de 8 on a working step", () => {
    renderChrome(4);
    expect(screen.getByText("Paso 4 de 8")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "4 Mediación" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps an unvisited step visible and not clickable", () => {
    renderChrome(4, 4);
    expect(screen.getByText("5 Evidencias de aprendizaje").closest("a")).toBeNull();
    expect(screen.getByRole("link", { name: "4 Mediación" })).toHaveAttribute("href", `/plans/${planId}/steps/4`);
    expect(screen.getByRole("link", { name: "0 Configuración" })).toBeInTheDocument();
  });

  it("does not show Continuar on step 8", () => {
    renderChrome(8, 8);
    expect(screen.queryByRole("button", { name: "Continuar" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Atrás" })).toHaveAttribute("href", `/plans/${planId}/steps/7`);
  });

  it("returns to the plan list from configuration", () => {
    renderChrome(0);
    fireEvent.click(screen.getByRole("link", { name: "Atrás" }));
    expect(screen.getByRole("heading", { name: "Mis planeamientos" })).toBeInTheDocument();
  });

  it("opens only the seeded visit range for each teacher", () => {
    const { unmount } = render(
      <MemoryRouter>
        <WizardChrome
          planId={planId}
          step={4}
          highestVisitedStep={4}
          subjectLabel="Matemática"
          gradeLevel={4}
          schoolName="Escuela República de Arabia Saudita"
          teacherName="Juanita Pérez"
          onLogout={() => undefined}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "4 Mediación" })).toBeInTheDocument();
    expect(screen.getByText("5 Evidencias de aprendizaje").closest("a")).toBeNull();
    unmount();

    const carlos = render(
      <MemoryRouter>
        <WizardChrome
          planId="22222222-2222-4222-8222-222222222222"
          step={7}
          highestVisitedStep={7}
          subjectLabel="Español"
          gradeLevel={2}
          schoolName="Escuela José Figueres Ferrer"
          teacherName="Carlos Mora"
          onLogout={() => undefined}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "7 Formato MEP / PDF" })).toBeInTheDocument();
    expect(screen.getByText("8 Ajuste post-clase").closest("a")).toBeNull();
    carlos.unmount();

    const maria = render(
      <MemoryRouter>
        <WizardChrome
          planId="33333333-3333-4333-8333-333333333333"
          step={8}
          highestVisitedStep={8}
          subjectLabel="Ciencias"
          gradeLevel={7}
          schoolName="Liceo Experimental de San Pedro"
          teacherName="María Solís"
          onLogout={() => undefined}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "8 Ajuste post-clase" })).toBeInTheDocument();
    maria.unmount();
  });
});
