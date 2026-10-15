import { useRef, useState } from "react";

type SaveState = "idle" | "saved" | "error";

export function SaveFooter({ state }: { state: SaveState }) {
  return (
    <footer>
      {state === "saved" ? <p>Borrador guardado automáticamente</p> : null}
      {state === "error" ? <p>No se pudo guardar el borrador. Intente de nuevo.</p> : null}
    </footer>
  );
}

export function AutosaveField({
  initialValue,
  onSave,
  onStatus,
}: {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  onStatus?: (state: SaveState) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(initialValue);
  const savedRef = useRef(initialValue);
  const savingRef = useRef(false);

  async function persist(next: string) {
    savingRef.current = true;
    try {
      await onSave(next);
      savedRef.current = next;
      if (valueRef.current === next) {
        onStatus?.("saved");
      }
    } catch {
      if (valueRef.current === next) {
        onStatus?.("error");
      }
    } finally {
      savingRef.current = false;
      if (valueRef.current !== next && valueRef.current !== savedRef.current) {
        await persist(valueRef.current);
      }
    }
  }

  async function handleBlur() {
    if (valueRef.current === savedRef.current || savingRef.current) {
      return;
    }
    await persist(valueRef.current);
  }

  return (
    <label>
      Sección o grupo
      <input
        aria-label="Sección o grupo"
        value={value}
        onChange={(event) => {
          valueRef.current = event.target.value;
          setValue(event.target.value);
          onStatus?.("idle");
        }}
        onBlur={() => {
          void handleBlur();
        }}
      />
    </label>
  );
}
