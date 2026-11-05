import { useEffect, useRef, useState } from "react";

export type MediationRow = {
  activity: string;
  teacherRole: string;
  studentRole: string;
  minutes: number;
  materials: string;
};

export type OutsideTask = {
  task: string;
  purpose: string;
  estimatedDuration: string;
};

type MediationBlock = { blockKey: string; body: string };

const rowFields = [
  { key: "activity", label: "Actividad" },
  { key: "teacherRole", label: "Hace la persona docente" },
  { key: "studentRole", label: "Hace el estudiantado" },
  { key: "minutes", label: "Tiempo" },
  { key: "materials", label: "Materiales" },
] as const;

function blockBody(blocks: MediationBlock[], blockKey: string): string {
  return blocks.find((block) => block.blockKey === blockKey)?.body ?? "";
}

export function parseMediationRows(body: string): MediationRow[] {
  try {
    const parsed = JSON.parse(body) as MediationRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseOutside(body: string): OutsideTask[] {
  try {
    const parsed = JSON.parse(body) as OutsideTask[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isMediationStepReady(blocks: MediationBlock[]): boolean {
  const rows = parseMediationRows(blockBody(blocks, "mediation-in-class"));
  return rows.length > 0 && rows.every((row) => Number.isInteger(row.minutes) && row.minutes > 0);
}

function readinessMessage(rows: MediationRow[]): string | null {
  if (rows.length === 0) {
    return "Agregue al menos una actividad dentro del aula.";
  }
  if (rows.some((row) => !Number.isInteger(row.minutes) || row.minutes <= 0)) {
    return "Complete el tiempo de cada actividad.";
  }
  return null;
}

export function MediationStepPage({
  blocks,
  weeks,
  onSaveInClass,
  onSaveOutside,
  onRegenerate,
  onFit40,
  onSimplify,
  onReadyChange,
  actionMessage = "",
  notice = "",
}: {
  blocks: MediationBlock[];
  weeks: { position: number; title: string }[];
  onSaveInClass: (body: string) => Promise<void>;
  onSaveOutside: (body: string) => Promise<void>;
  onRegenerate: () => void | Promise<void>;
  onFit40: () => void | Promise<void>;
  onSimplify: () => void | Promise<void>;
  onReadyChange?: (ready: boolean) => void;
  actionMessage?: string;
  notice?: string;
}) {
  const inClassBody = blockBody(blocks, "mediation-in-class");
  const outsideBody = blockBody(blocks, "mediation-outside");
  const [rows, setRows] = useState(() => parseMediationRows(inClassBody));
  const [outside, setOutside] = useState(() => parseOutside(outsideBody));
  const rowsRef = useRef(rows);
  const outsideRef = useRef(outside);
  const [seenInClass, setSeenInClass] = useState(inClassBody);
  const [seenOutside, setSeenOutside] = useState(outsideBody);
  const [pending, setPending] = useState(false);
  if (seenInClass !== inClassBody) {
    const next = JSON.stringify(rowsRef.current) === seenInClass ? parseMediationRows(inClassBody) : rowsRef.current;
    setSeenInClass(inClassBody);
    setRows(next);
    rowsRef.current = next;
  }
  if (seenOutside !== outsideBody) {
    const next = JSON.stringify(outsideRef.current) === seenOutside ? parseOutside(outsideBody) : outsideRef.current;
    setSeenOutside(outsideBody);
    setOutside(next);
    outsideRef.current = next;
  }
  const message = readinessMessage(rows);
  useEffect(() => {
    onReadyChange?.(message === null);
  }, [message, onReadyChange]);

  const activeWeek = weeks.find((week) => week.position === 2);

  function updateRow(index: number, key: keyof MediationRow, value: string) {
    const next = rowsRef.current.map((row, rowIndex) => {
      if (rowIndex !== index) {
        return row;
      }
      if (key === "minutes") {
        const minutes = value.trim() === "" ? 0 : Number(value);
        return { ...row, minutes: Number.isInteger(minutes) ? minutes : 0 };
      }
      return { ...row, [key]: value };
    });
    rowsRef.current = next;
    setRows(next);
  }

  function updateOutside(index: number, key: keyof OutsideTask, value: string) {
    const next = outsideRef.current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item));
    outsideRef.current = next;
    setOutside(next);
  }

  function runAction(action: () => void | Promise<void>) {
    if (pending) {
      return;
    }
    setPending(true);
    void Promise.resolve(action()).finally(() => {
      setPending(false);
    });
  }

  return (
    <main className="page mediation-step">
      <h2>Qué haremos para aprender</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Defina el rol de la persona docente, el rol del estudiantado, los tiempos y los materiales. También el trabajo extraclase.</p>
      {activeWeek ? <h3>{`Semana ${activeWeek.position} — ${activeWeek.title}`}</h3> : null}
      <h3>Dentro del aula</h3>
      <table className="rubric-table">
        <thead>
          <tr>
            {rowFields.map((field) => (
              <th key={field.key}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.activity}-${index}`}>
              {rowFields.map((field) => (
                <td key={field.key}>
                  <input
                    aria-label={`${field.label} ${index + 1}`}
                    value={field.key === "minutes" ? String(row.minutes || "") : row[field.key]}
                    onChange={(event) => updateRow(index, field.key, event.target.value)}
                    onBlur={() => {
                      void onSaveInClass(JSON.stringify(rowsRef.current));
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Fuera del aula</h3>
      <div className="outside-tasks">
        {outside.map((item, index) => (
          <fieldset key={`${item.task}-${index}`} className="outside-task">
            <legend>{`Trabajo extraclase ${index + 1}`}</legend>
            <label className="field">
              <span>Trabajo</span>
              <textarea
                aria-label={`Trabajo ${index + 1}`}
                value={item.task}
                onChange={(event) => updateOutside(index, "task", event.target.value)}
                onBlur={() => {
                  void onSaveOutside(JSON.stringify(outsideRef.current));
                }}
              />
            </label>
            <label className="field">
              <span>Propósito</span>
              <textarea
                aria-label={`Propósito ${index + 1}`}
                value={item.purpose}
                onChange={(event) => updateOutside(index, "purpose", event.target.value)}
                onBlur={() => {
                  void onSaveOutside(JSON.stringify(outsideRef.current));
                }}
              />
            </label>
            <label className="field">
              <span>Duración estimada</span>
              <input
                aria-label={`Duración estimada ${index + 1}`}
                value={item.estimatedDuration}
                onChange={(event) => updateOutside(index, "estimatedDuration", event.target.value)}
                onBlur={() => {
                  void onSaveOutside(JSON.stringify(outsideRef.current));
                }}
              />
            </label>
          </fieldset>
        ))}
      </div>
      {message ? <p role="alert">{message}</p> : null}
      {actionMessage ? <p role="alert">{actionMessage}</p> : null}
      <div className="card-actions">
        <button type="button" disabled={pending} onClick={() => runAction(onRegenerate)}>
          Regenerar mediación
        </button>
        <button type="button" disabled={pending} onClick={() => runAction(onFit40)}>
          Ajustar a 40 minutos
        </button>
        <button type="button" disabled={pending} onClick={() => runAction(onSimplify)}>
          Simplificar materiales
        </button>
      </div>
    </main>
  );
}
