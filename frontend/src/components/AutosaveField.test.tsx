import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AutosaveField, SaveFooter } from "./AutosaveField";

function FieldWithFooter({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
}) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  return (
    <>
      <AutosaveField initialValue={initialValue} onSave={onSave} onStatus={setState} />
      <SaveFooter state={state} />
    </>
  );
}

describe("AutosaveField", () => {
  it("shows the saved footer after a successful response", async () => {
    render(<FieldWithFooter initialValue="4.° A" onSave={async () => undefined} />);
    const input = screen.getByLabelText("Sección o grupo");
    fireEvent.change(input, { target: { value: "4.° B" } });
    fireEvent.blur(input);
    expect(await screen.findByText("Borrador guardado automáticamente")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toContainElement(screen.getByText("Borrador guardado automáticamente"));
  });

  it("does not save when the teacher leaves the field unchanged", () => {
    const onSave = vi.fn(async () => undefined);
    render(<FieldWithFooter initialValue="4.° A" onSave={onSave} />);
    fireEvent.blur(screen.getByLabelText("Sección o grupo"));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("keeps the typed value when the save fails", async () => {
    render(
      <FieldWithFooter
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
    expect(screen.getByRole("contentinfo")).toContainElement(screen.getByText("No se pudo guardar el borrador. Intente de nuevo."));
    expect(input).toHaveValue("4.° B");
  });

  it("clears the success sentence when the field changes again", async () => {
    render(<FieldWithFooter initialValue="4.° A" onSave={async () => undefined} />);
    const input = screen.getByLabelText("Sección o grupo");
    fireEvent.change(input, { target: { value: "4.° B" } });
    fireEvent.blur(input);
    expect(await screen.findByText("Borrador guardado automáticamente")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "4.° C" } });
    expect(screen.queryByText("Borrador guardado automáticamente")).not.toBeInTheDocument();
  });

  it("stores the newer text after a save that is still running", async () => {
    const resolvers: Array<() => void> = [];
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    render(<FieldWithFooter initialValue="4.° A" onSave={onSave} />);
    const input = screen.getByLabelText("Sección o grupo");
    fireEvent.change(input, { target: { value: "4.° B" } });
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: "4.° C" } });
    fireEvent.blur(input);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("4.° B");

    await act(async () => {
      resolvers[0]();
    });

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenLastCalledWith("4.° C");

    await act(async () => {
      resolvers[1]();
    });
    expect(screen.getByText("Borrador guardado automáticamente")).toBeInTheDocument();
    expect(input).toHaveValue("4.° C");
  });
});
