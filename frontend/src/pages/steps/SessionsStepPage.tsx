import { useEffect, useRef, useState } from "react";

export type ClassSession = {
  id: string;
  position: number;
  day: string;
  occursOn: string;
  expectedLearning: string;
  durationMinutes: number;
  start: string;
  development: string;
  close: string;
  materials: string;
  formativeEvidence: string;
  homework: string | null;
  expanded: boolean;
  status: string;
  planBNote: string | null;
  planBMinutes: number | null;
};

export type WeekSessions = {
  position: number;
  title: string;
  active: boolean;
  sessions: ClassSession[];
};

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const textFields = [
  { key: "expectedLearning", label: "Aprendizaje esperado" },
  { key: "start", label: "Inicio" },
  { key: "development", label: "Desarrollo" },
  { key: "close", label: "Cierre" },
  { key: "materials", label: "Materiales" },
  { key: "formativeEvidence", label: "Evidencia formativa" },
] as const;

export function isSessionsStepReady(weeks: WeekSessions[]): boolean {
  const active = weeks.find((week) => week.active) ?? weeks[0];
  if (!active || active.sessions.length !== 5) {
    return false;
  }
  return active.sessions.every(
    (session) =>
      session.expectedLearning.trim().length > 0 &&
      session.start.trim().length > 0 &&
      session.development.trim().length > 0 &&
      session.close.trim().length > 0,
  );
}

export function weekOptionLabel(week: WeekSessions): string {
  const first = week.sessions[0];
  const last = week.sessions[week.sessions.length - 1];
  if (!first || !last) {
    return `Semana ${week.position}`;
  }
  const month = months[Number(first.occursOn.slice(5, 7)) - 1] ?? "";
  return `Semana ${week.position} (${Number(first.occursOn.slice(8, 10))} al ${Number(last.occursOn.slice(8, 10))} de ${month})`;
}

function spanishDate(occursOn: string): string {
  const month = months[Number(occursOn.slice(5, 7)) - 1] ?? "";
  return `${Number(occursOn.slice(8, 10))} de ${month} de ${occursOn.slice(0, 4)}`;
}

export function SessionsStepPage({
  weeks,
  onSave,
  onGenerate,
  onDuplicate,
  onExport,
  onReadyChange,
  actionMessage = "",
  notice = "",
}: {
  weeks: WeekSessions[];
  onSave: (sessionId: string, patch: Partial<ClassSession>) => Promise<void>;
  onGenerate: (weekNumber: number) => void | Promise<void>;
  onDuplicate: (weekNumber: number) => void | Promise<void>;
  onExport: (weekNumber: number) => void | Promise<void>;
  onReadyChange?: (ready: boolean) => void;
  actionMessage?: string;
  notice?: string;
}) {
  const incoming = JSON.stringify(weeks);
  const [rows, setRows] = useState(weeks);
  const rowsRef = useRef(weeks);
  const [seen, setSeen] = useState(incoming);
  const [selected, setSelected] = useState(weeks.find((week) => week.active)?.position ?? weeks[0]?.position ?? 1);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  if (seen !== incoming) {
    setSeen(incoming);
    setRows(weeks);
    rowsRef.current = weeks;
  }
  const ready = isSessionsStepReady(rows);
  useEffect(() => {
    onReadyChange?.(ready);
  }, [onReadyChange, ready]);

  const week = rows.find((item) => item.position === selected) ?? rows[0];

  function runAction(action: (weekNumber: number) => void | Promise<void>) {
    if (!week || busyRef.current) {
      return;
    }
    busyRef.current = true;
    setBusy(true);
    Promise.resolve(action(week.position)).finally(() => {
      busyRef.current = false;
      setBusy(false);
    });
  }

  function updateSession(sessionId: string, patch: Partial<ClassSession>, persist: boolean) {
    const next = rowsRef.current.map((item) => ({
      ...item,
      sessions: item.sessions.map((session) => (session.id === sessionId ? { ...session, ...patch } : session)),
    }));
    rowsRef.current = next;
    setRows(next);
    if (persist) {
      const saved = next.flatMap((item) => item.sessions).find((session) => session.id === sessionId);
      if (saved) {
        void onSave(sessionId, Object.keys(patch).length === 0 ? saved : patch);
      }
    }
  }

  return (
    <main className="page sessions-step">
      <h2>Prepare la semana y cada sesión</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Detalle qué toca esta semana. Toda sesión tiene inicio, desarrollo y cierre.</p>
      <label>
        Semana
        <select aria-label="Semana" value={week?.position ?? ""} onChange={(event) => setSelected(Number(event.target.value))}>
          {rows.map((item) => (
            <option key={item.position} value={item.position}>
              {weekOptionLabel(item)}
            </option>
          ))}
        </select>
      </label>
      <div className="card-actions">
        <button type="button" onClick={() => runAction(onGenerate)} disabled={busy || week?.active !== true}>
          Generar las 5 sesiones con IA
        </button>
        <button type="button" onClick={() => runAction(onDuplicate)} disabled={busy}>
          Duplicar estructura
        </button>
        <button type="button" onClick={() => week && void onExport(week.position)}>
          Exportar semana
        </button>
      </div>
      {actionMessage ? <p role="alert">{actionMessage}</p> : null}
      {(week?.sessions ?? []).map((session) => (
        <article key={session.id} className="session-card">
          <h3>
            {session.day} {spanishDate(session.occursOn)}
          </h3>
          <p>{session.occursOn}</p>
          {session.planBNote ? (
            <p>
              {session.planBNote}
              {session.planBMinutes ? ` — plan B de ${session.planBMinutes} min incluido` : ""}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => updateSession(session.id, { expanded: !session.expanded }, true)}
          >
            {session.expanded ? `Cerrar ${session.day}` : `Abrir ${session.day}`}
          </button>
          {session.expanded ? (
            <>
              <p>Duración: {session.durationMinutes} min</p>
              {textFields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  <input
                    aria-label={`${field.label} de ${session.day}`}
                    value={session[field.key]}
                    onChange={(event) => updateSession(session.id, { [field.key]: event.target.value }, false)}
                    onBlur={() => updateSession(session.id, {}, true)}
                  />
                </label>
              ))}
              {session.homework ? (
                <label>
                  Tarea o extraclase
                  <input
                    aria-label={`Tarea de ${session.day}`}
                    value={session.homework}
                    onChange={(event) => updateSession(session.id, { homework: event.target.value }, false)}
                    onBlur={() => updateSession(session.id, {}, true)}
                  />
                </label>
              ) : null}
            </>
          ) : null}
        </article>
      ))}
    </main>
  );
}
