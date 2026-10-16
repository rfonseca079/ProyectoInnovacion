import { useState } from "react";

export type MepRowView = {
  position: number;
  expectedLearning: string;
  mediationStrategy: string;
  indicator: string;
};

export type MepDocumentView = {
  regionalDirectorate: string;
  schoolName: string;
  teacherName: string;
  subjectLabel: string;
  gradeLabel: string;
  schoolYear: number;
  periodicity: string;
  competencies: string;
  observations: string;
  instruments: string[];
  rows: MepRowView[];
};

const headerFields: { key: keyof MepDocumentView; label: string }[] = [
  { key: "regionalDirectorate", label: "Dirección Regional de Educación" },
  { key: "schoolName", label: "Centro educativo" },
  { key: "teacherName", label: "Nombre de la persona docente" },
  { key: "subjectLabel", label: "Asignatura" },
  { key: "gradeLabel", label: "Nivel" },
  { key: "schoolYear", label: "Curso lectivo" },
  { key: "periodicity", label: "Periodicidad" },
  { key: "competencies", label: "Competencias generales" },
];

export function emptyDocumentField(document: MepDocumentView): string | null {
  for (const field of headerFields) {
    const value = document[field.key];
    if (typeof value === "number") {
      if (!Number.isInteger(value) || value <= 0) {
        return field.label;
      }
    } else if (typeof value === "string" && value.trim().length === 0) {
      return field.label;
    }
  }
  if (document.observations.trim().length === 0) {
    return "Observaciones";
  }
  if (document.rows.length < 2) {
    return "Aprendizajes esperados";
  }
  for (const row of document.rows) {
    if (row.expectedLearning.trim().length === 0) {
      return "Aprendizajes esperados";
    }
    if (row.mediationStrategy.trim().length === 0) {
      return "Estrategias de mediación";
    }
    if (row.indicator.trim().length === 0) {
      return "Indicadores";
    }
  }
  return null;
}

export function MepStepPage({
  document,
  status,
  onSave,
  onDownload,
  onPreview,
}: {
  document: MepDocumentView;
  status: string;
  onSave: (patch: Partial<MepDocumentView>) => void;
  onDownload: () => void;
  onPreview?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(document);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [seenDocument, setSeenDocument] = useState(document);
  if (seenDocument !== document) {
    setSeenDocument(document);
    setDraft(document);
  }

  function saveText(field: keyof MepDocumentView, value: string) {
    const next = { ...draft, [field]: field === "schoolYear" ? Number(value) : value };
    setDraft(next);
    onSave({ [field]: next[field] });
  }

  function saveRow(position: number, field: keyof MepRowView, value: string) {
    const rows = draft.rows.map((row) => (row.position === position ? { ...row, [field]: value } : row));
    setDraft({ ...draft, rows });
    onSave({ rows });
  }

  function guardedFileAction(start: () => void) {
    const missing = emptyDocumentField(draft);
    if (missing) {
      setDownloadMessage(`Complete el campo ${missing}.`);
      return;
    }
    setDownloadMessage("");
    start();
  }

  return (
    <main className="page mep-step">
      <h2>Planeamiento en formato institucional</h2>
      <p>Todas las decisiones anteriores se consolidan en la plantilla tipo MEP, lista para descargar.</p>
      <div className="mep-actions">
        <button type="button" onClick={() => setEditing((current) => !current)}>
          Editar campos
        </button>
        <button type="button" onClick={() => guardedFileAction(() => onPreview?.())}>
          Vista previa PDF
        </button>
        <button type="button" onClick={() => guardedFileAction(onDownload)}>
          Descargar PDF
        </button>
        {status === "READY_FOR_DELIVERY" ? <p>Listo para entrega a dirección</p> : null}
      </div>
      {downloadMessage ? <p role="alert">{downloadMessage}</p> : null}
      <article className="mep-document">
        <dl>
          {headerFields.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>
                {editing ? (
                  <input
                    aria-label={field.label}
                    value={String(draft[field.key])}
                    onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                    onBlur={(event) => saveText(field.key, event.target.value)}
                  />
                ) : (
                  String(draft[field.key])
                )}
              </dd>
            </div>
          ))}
        </dl>
        <table>
          <thead>
            <tr>
              <th>Aprendizajes esperados</th>
              <th>Estrategias de mediación</th>
              <th>Indicadores</th>
            </tr>
          </thead>
          <tbody>
            {draft.rows.map((row) => (
              <tr key={row.position}>
                <td>
                  {editing ? (
                    <input
                      aria-label={`Aprendizaje de la fila ${row.position}`}
                      value={row.expectedLearning}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          rows: draft.rows.map((item) =>
                            item.position === row.position ? { ...item, expectedLearning: event.target.value } : item,
                          ),
                        })
                      }
                      onBlur={(event) => saveRow(row.position, "expectedLearning", event.target.value)}
                    />
                  ) : (
                    row.expectedLearning
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      aria-label={`Mediación de la fila ${row.position}`}
                      value={row.mediationStrategy}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          rows: draft.rows.map((item) =>
                            item.position === row.position ? { ...item, mediationStrategy: event.target.value } : item,
                          ),
                        })
                      }
                      onBlur={(event) => saveRow(row.position, "mediationStrategy", event.target.value)}
                    />
                  ) : (
                    row.mediationStrategy
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      aria-label={`Indicador de la fila ${row.position}`}
                      value={row.indicator}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          rows: draft.rows.map((item) =>
                            item.position === row.position ? { ...item, indicator: event.target.value } : item,
                          ),
                        })
                      }
                      onBlur={(event) => saveRow(row.position, "indicator", event.target.value)}
                    />
                  ) : (
                    row.indicator
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Instrumentos de evaluación</h3>
        <ul>
          {draft.instruments.map((instrument, index) => (
            <li key={`${index}-${instrument}`}>{instrument}</li>
          ))}
        </ul>
        <h3>Observaciones</h3>
        {editing ? (
          <textarea
            aria-label="Observaciones"
            value={draft.observations}
            onChange={(event) => setDraft({ ...draft, observations: event.target.value })}
            onBlur={(event) => saveText("observations", event.target.value)}
          />
        ) : (
          <p>{draft.observations}</p>
        )}
      </article>
    </main>
  );
}
