import { useState } from "react";

type SaveState = "idle" | "saved" | "error";

export function AutosaveField({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [state, setState] = useState<SaveState>("idle");

  async function handleBlur() {
    try {
      await onSave(value);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <label>
        Sección o grupo
        <input aria-label="Sección o grupo" value={value} onChange={(event) => setValue(event.target.value)} onBlur={handleBlur} />
      </label>
      {state === "saved" ? <p>Borrador guardado automáticamente</p> : null}
      {state === "error" ? <p>No se pudo guardar el borrador. Intente de nuevo.</p> : null}
    </div>
  );
}
