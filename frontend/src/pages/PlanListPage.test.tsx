import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlanListPage } from "./PlanListPage";
import { PlanSummary } from "../services/planLabels";

const juanita: PlanSummary = {
  id: "11111111-1111-4111-8111-111111111111",
  subject: "MATH",
  gradeLevel: 4,
  month: 3,
  schoolYear: 2026,
  schoolName: "Escuela República de Arabia Saudita",
  status: "DRAFT",
  currentStep: 4,
  updatedAt: "2026-03-10T18:00:00.000Z",
};

describe("PlanListPage", () => {
  it("renders Juanita's draft label and the empty state", () => {
    const { rerender } = render(
      <MemoryRouter>
        <PlanListPage teacherName="Juanita Pérez" onLogout={() => undefined} plans={[juanita]} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Borrador · Paso 4 de 8/)).toBeInTheDocument();
    expect(screen.getByText(/10 de marzo de 2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nuevo planeamiento" })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <PlanListPage teacherName="Juanita Pérez" onLogout={() => undefined} plans={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Aún no tiene planeamientos.")).toBeInTheDocument();
  });
});
