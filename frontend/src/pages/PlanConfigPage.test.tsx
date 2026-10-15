import { act, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByLabelText("Nombre docente")).toHaveValue("Juanita Pérez");
    expect(screen.getByLabelText("Centro educativo")).toHaveValue("Escuela República de Arabia Saudita");
    expect(screen.getByLabelText("Dirección regional")).toHaveValue("Dirección Regional San José");
    expect(screen.getByLabelText("Mes")).toHaveValue("");
  });

  it("creates only one plan when Iniciar planeamiento con IA is clicked again before the request finishes", async () => {
    let release: () => void = () => undefined;
    const onCreate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    render(<PlanConfigPage teacher={juanita} onLogout={() => undefined} onCreate={onCreate} />);
    fireEvent.change(screen.getByLabelText("Ciclo"), { target: { value: "I_II" } });
    fireEvent.change(screen.getByLabelText("Nivel"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Asignatura"), { target: { value: "MATH" } });
    fireEvent.change(screen.getByLabelText("Modalidad"), { target: { value: "IN_PERSON" } });
    fireEvent.change(screen.getByLabelText("Curso lectivo"), { target: { value: "2026" } });
    fireEvent.change(screen.getByLabelText("Mes"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Sección o grupo"), { target: { value: "4.° A" } });
    fireEvent.change(screen.getByLabelText("Cantidad de estudiantes"), { target: { value: "28" } });
    fireEvent.change(screen.getByLabelText("Lecciones semanales"), { target: { value: "5" } });

    const button = screen.getByRole("button", { name: "Iniciar planeamiento con IA" });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    await act(async () => {
      release();
      await onCreate.mock.results[0]?.value;
    });
  });

  it("shows the cycle message when grade 4 stays selected under Educación Diversificada", () => {
    render(<PlanConfigPage teacher={juanita} onLogout={() => undefined} onCreate={async () => undefined} />);
    fireEvent.change(screen.getByLabelText("Ciclo"), { target: { value: "I_II" } });
    fireEvent.change(screen.getByLabelText("Nivel"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Ciclo"), { target: { value: "DIVERSIFIED" } });

    expect(screen.getByRole("alert")).toHaveTextContent("Seleccione un nivel del ciclo elegido.");
    expect(screen.getByRole("button", { name: "Iniciar planeamiento con IA" })).toBeDisabled();
  });
});
