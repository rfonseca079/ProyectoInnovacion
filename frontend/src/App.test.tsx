import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";

const { session, carlos } = vi.hoisted(() => {
  const juanita = {
    id: "juanita",
    fullName: "Juanita Pérez",
    email: "juanita.perez@demo.mep.cr",
    schoolName: "Escuela República de Arabia Saudita",
    regionalDirectorate: "Dirección Regional San José",
  };
  const carlos = {
    id: "carlos",
    fullName: "Carlos Mora",
    email: "carlos.mora@demo.mep.cr",
    schoolName: "Escuela José Figueres Ferrer",
    regionalDirectorate: "Dirección Regional Cartago",
  };
  const juanitaPlan = {
    id: "11111111-1111-4111-8111-111111111111",
    subject: "MATH",
    gradeLevel: 4,
    month: 3,
    schoolYear: 2026,
    schoolName: "Escuela República de Arabia Saudita",
    status: "DRAFT" as const,
    currentStep: 4,
    updatedAt: "2026-03-10T18:00:00.000Z",
  };
  return {
    carlos,
    session: { teacher: juanita as typeof juanita | typeof carlos | null, listCount: 0, juanitaPlan },
  };
});

vi.mock("./services/authService", () => ({
  currentTeacher: () => Promise.resolve(session.teacher),
  logout: () => {
    session.teacher = null;
    return Promise.resolve();
  },
  login: (email: string) => {
    session.teacher = email === carlos.email ? carlos : session.teacher;
    return Promise.resolve(session.teacher);
  },
}));

vi.mock("./services/planService", () => ({
  listPlans: () => {
    session.listCount += 1;
    if (session.listCount === 1) {
      return Promise.resolve([session.juanitaPlan]);
    }
    return new Promise(() => undefined);
  },
  createPlan: () => Promise.resolve(session.juanitaPlan),
}));

describe("App logout", () => {
  it("does not show the previous teacher's plans while the next list is still loading", async () => {
    render(
      <MemoryRouter initialEntries={["/planeamientos"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Escuela República de Arabia Saudita/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(await screen.findByRole("button", { name: "Entrar" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: carlos.email } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Demo2026" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("heading", { name: "Mis planeamientos" })).toBeInTheDocument();
    expect(screen.queryByText(/Escuela República de Arabia Saudita/)).not.toBeInTheDocument();
    expect(screen.getByText("Aún no tiene planeamientos.")).toBeInTheDocument();
  });
});
