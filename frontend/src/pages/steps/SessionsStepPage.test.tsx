import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ClassSession, SessionsStepPage } from "./SessionsStepPage";

const sessions: ClassSession[] = [
  {
    id: "mon",
    position: 1,
    day: "Lunes",
    occursOn: "2026-03-09",
    expectedLearning: "reconocer fracciones equivalentes con material concreto",
    durationMinutes: 40,
    start: "10 min con círculos fraccionarios",
    development: "25 min para representar 1/2 = 2/4 = 3/6",
    close: "5 min para compartir una regla",
    materials: "círculos y fichas",
    formativeEvidence: "observación de la manipulación",
    homework: "buscar 3 ejemplos de equivalencias en empaques",
    expanded: true,
    status: "SUGGESTED",
    planBNote: null,
    planBMinutes: null,
  },
  {
    id: "tue",
    position: 2,
    day: "Martes",
    occursOn: "2026-03-10",
    expectedLearning: "practicar equivalencias con una actividad breve",
    durationMinutes: 40,
    start: "5 min de repaso",
    development: "práctica breve de equivalencias",
    close: "5 min de puesta en común",
    materials: "cuaderno",
    formativeEvidence: "ejercicio breve",
    homework: null,
    expanded: false,
    status: "SUGGESTED",
    planBNote: null,
    planBMinutes: null,
  },
  {
    id: "wed",
    position: 3,
    day: "Miércoles",
    occursOn: "2026-03-11",
    expectedLearning: "explicar con lenguaje matemático por qué dos fracciones son equivalentes",
    durationMinutes: 40,
    start: "8 min de repaso de la regla",
    development: "22 min de práctica en parejas",
    close: "10 min de vocabulario: equivalente, numerador y denominador",
    materials: "cuaderno y pizarra",
    formativeEvidence: "salida rápida de 2 ítems",
    homework: null,
    expanded: true,
    status: "SUGGESTED",
    planBNote: null,
    planBMinutes: null,
  },
  {
    id: "thu",
    position: 4,
    day: "Jueves",
    occursOn: "2026-03-12",
    expectedLearning: "sostener la práctica si la actividad institucional reduce el tiempo",
    durationMinutes: 40,
    start: "5 min de consigna",
    development: "práctica guiada de equivalencias",
    close: "5 min de cierre",
    materials: "fichas",
    formativeEvidence: "observación",
    homework: null,
    expanded: false,
    status: "SUGGESTED",
    planBNote: "Jueves con posible afectación por actividad institucional",
    planBMinutes: 25,
  },
  {
    id: "fri",
    position: 5,
    day: "Viernes",
    occursOn: "2026-03-13",
    expectedLearning: "comprobar equivalencias con el quiz 1",
    durationMinutes: 40,
    start: "5 min de indicaciones",
    development: "resolución del quiz 1",
    close: "5 min de revisión",
    materials: "quiz impreso",
    formativeEvidence: "quiz 1",
    homework: null,
    expanded: false,
    status: "SUGGESTED",
    planBNote: null,
    planBMinutes: null,
  },
];

describe("SessionsStepPage", () => {
  it("shows two expanded sessions and can request the week PDF", () => {
    const onExport = vi.fn();
    render(
      <SessionsStepPage
        weeks={[
          {
            position: 2,
            title: "Fracciones equivalentes",
            active: true,
            sessions,
          },
        ]}
        onSave={async () => undefined}
        onGenerate={() => undefined}
        onDuplicate={() => undefined}
        onExport={onExport}
      />,
    );
    expect(screen.getByRole("heading", { name: "Prepare la semana y cada sesión" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("reconocer fracciones equivalentes con material concreto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("explicar con lenguaje matemático por qué dos fracciones son equivalentes")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("práctica breve de equivalencias")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Exportar semana" }));
    expect(onExport).toHaveBeenCalledWith(2);
  });

  it("disables Generar on a week that is not active", () => {
    render(
      <SessionsStepPage
        weeks={[
          { position: 1, title: "Fracción como parte-todo", active: false, sessions },
          { position: 2, title: "Fracciones equivalentes", active: true, sessions },
        ]}
        onSave={async () => undefined}
        onGenerate={() => undefined}
        onDuplicate={() => undefined}
        onExport={() => undefined}
      />,
    );
    fireEvent.change(screen.getByLabelText("Semana"), { target: { value: "1" } });
    expect(screen.getByRole("button", { name: "Generar las 5 sesiones con IA" })).toBeDisabled();
  });
});
