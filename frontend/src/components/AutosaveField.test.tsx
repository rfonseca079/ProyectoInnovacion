import { fireEvent, render, screen } from "@testing-library/react";
import { AutosaveField } from "./AutosaveField";

describe("AutosaveField", () => {
  it("shows the saved footer after a successful response", async () => {
    render(<AutosaveField initialValue="4.° A" onSave={async () => undefined} />);
    const input = screen.getByLabelText("Sección o grupo");
    fireEvent.change(input, { target: { value: "4.° B" } });
    fireEvent.blur(input);
    expect(await screen.findByText("Borrador guardado automáticamente")).toBeInTheDocument();
  });

  it("keeps the typed value when the save fails", async () => {
    render(
      <AutosaveField
        initialValue="4.° A"
        onSave={async () => {
          throw new Error("fail");
        }}
      />,
    );
    const input = screen.getByLabelText("Sección o grupo");
    fireEvent.change(input, { target: { value: "4.° B" } });
    fireEvent.blur(input);
    expect(await screen.findByText("No se pudo guardar el borrador. Intente de nuevo.")).toBeInTheDocument();
    expect(input).toHaveValue("4.° B");
  });
});
