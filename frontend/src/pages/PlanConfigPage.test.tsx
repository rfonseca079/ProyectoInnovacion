import { render, screen } from "@testing-library/react";
import { PlanConfigPage } from "./PlanConfigPage";

const juanita = {
  id: "teacher-1",
  fullName: "Juanita Pérez",
  email: "juanita.perez@demo.mep.cr",
  schoolName: "Escuela República de Arabia Saudita",
  regionalDirectorate: "Dirección Regional San José",
};

describe("PlanConfigPage", () => {
  it("keeps Iniciar planeamiento con IA disabled while month is empty", () => {
    render(<PlanConfigPage teacher={juanita} onLogout={() => undefined} onCreate={async () => undefined} />);
    expect(screen.getByRole("button", { name: "Iniciar planeamiento con IA" })).toBeDisabled();
    expect(screen.getByLabelText("Centro educativo")).toHaveValue("Escuela República de Arabia Saudita");
    expect(screen.getByLabelText("Mes")).toHaveValue("");
  });
});
