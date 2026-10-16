import { useEffect, useRef, useState } from "react";
import { SuggestionCard } from "../../components/SuggestionCard";

export type WeekDraft = { position: number; title: string };
export type RubricDraft = { name: string; count: number; percentage: number };

export const DISTRIBUTION_NOT_READY = "La distribución debe sumar 100 %.";

function percentageInRange(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

export function isUnitsStepReady(weeks: WeekDraft[], rubric: RubricDraft[]): boolean {
  const total = rubric.reduce((sum, item) => sum + item.percentage, 0);
  return (
    total === 100 &&
    weeks.length === 4 &&
    weeks.every((week) => week.title.trim().length > 0) &&
    rubric.length > 0 &&
    rubric.every((item) => item.name.trim().length > 0 && percentageInRange(item.percentage))
  );
}

export function UnitsStepPage({
  weeks,
  rubric,
  justification,
  justificationPreview = "",
  justificationStatus = "SUGGESTED",
  onSaveWeeks,
  onSaveRubric,
  onRedistribute,
  onAccept,
  onEdit,
  onRegenerate,
  onReadyChange,
  actionMessage = "",
  notice = "",
}: {
  weeks: WeekDraft[];
  rubric: RubricDraft[];
  justification: string;
  justificationPreview?: string;
  justificationStatus?: string;
  onSaveWeeks: (weeks: WeekDraft[]) => Promise<void>;
  onSaveRubric: (rubric: RubricDraft[]) => Promise<void>;
  onRedistribute: () => void;
  onAccept: () => void;
  onEdit: (body: string) => void;
  onRegenerate: () => void;
  onReadyChange?: (ready: boolean) => void;
  actionMessage?: string;
  notice?: string;
}) {
  const [titles, setTitles] = useState(weeks);
  const [rows, setRows] = useState(rubric);
  const titlesRef = useRef(weeks);
  const rowsRef = useRef(rubric);
  const weekKey = JSON.stringify(weeks);
  const rowKey = JSON.stringify(rubric);
  const [seenWeeks, setSeenWeeks] = useState(weekKey);
  const [seenRows, setSeenRows] = useState(rowKey);
  if (seenWeeks !== weekKey) {
    setSeenWeeks(weekKey);
    setTitles(weeks);
    titlesRef.current = weeks;
  }
  if (seenRows !== rowKey) {
    setSeenRows(rowKey);
    setRows(rubric);
    rowsRef.current = rubric;
  }

  const total = rows.reduce((sum, item) => sum + item.percentage, 0);
  const ready = isUnitsStepReady(titles, rows);
  useEffect(() => {
    onReadyChange?.(ready);
  }, [onReadyChange, ready]);

  function saveRows(next: RubricDraft[]) {
    rowsRef.current = next;
    setRows(next);
    return onSaveRubric(next);
  }

  return (
    <main className="page units-step">
      <h2>Organice unidades y defina la evaluación</h2>
      {notice ? <p>{notice}</p> : null}
      <p>La IA propone la secuencia. Usted define cada rubro y su porcentaje.</p>
      <section>
        <h3>Secuencia del mes</h3>
        <div className="week-row">
          {titles.map((week) => (
            <label key={week.position}>
              {`Semana ${week.position}`}
              <input
                aria-label={`Semana ${week.position}`}
                value={week.title}
                onChange={(event) => {
                  const next = titlesRef.current.map((item) =>
                    item.position === week.position ? { ...item, title: event.target.value } : item,
                  );
                  titlesRef.current = next;
                  setTitles(next);
                }}
                onBlur={() => {
                  void onSaveWeeks(titlesRef.current);
                }}
              />
            </label>
          ))}
        </div>
      </section>
      <section>
        <h3>Metodología de evaluación del periodo</h3>
        <table className="rubric-table">
          <thead>
            <tr>
              <th>Rubro</th>
              <th>Cantidad</th>
              <th>Porcentaje</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.name}-${index}`}>
                <td>
                  <input
                    aria-label={`Rubro ${index + 1}`}
                    value={row.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      const next = rowsRef.current.map((item, itemIndex) => (itemIndex === index ? { ...item, name } : item));
                      rowsRef.current = next;
                      setRows(next);
                    }}
                    onBlur={() => {
                      void onSaveRubric(rowsRef.current);
                    }}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Cantidad ${index + 1}`}
                    inputMode="numeric"
                    value={row.count}
                    onChange={(event) => {
                      const count = Number(event.target.value);
                      const next = rowsRef.current.map((item, itemIndex) => (itemIndex === index ? { ...item, count } : item));
                      rowsRef.current = next;
                      setRows(next);
                    }}
                    onBlur={() => {
                      void onSaveRubric(rowsRef.current);
                    }}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Porcentaje ${index + 1}`}
                    inputMode="numeric"
                    value={row.percentage}
                    onChange={(event) => {
                      const percentage = Number(event.target.value);
                      const next = rowsRef.current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, percentage } : item,
                      );
                      rowsRef.current = next;
                      setRows(next);
                    }}
                    onBlur={() => {
                      void onSaveRubric(rowsRef.current);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    disabled={rows.length <= 1}
                    onClick={() => {
                      void saveRows(rowsRef.current.filter((_, itemIndex) => itemIndex !== index));
                    }}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>{`Total: ${total} %`}</p>
        {ready ? <p className="distribution-complete">Distribución completa</p> : <p role="alert">{DISTRIBUTION_NOT_READY}</p>}
        {actionMessage ? <p role="alert">{actionMessage}</p> : null}
        <div className="card-actions">
          <button
            type="button"
            onClick={() => {
              void saveRows([...rowsRef.current, { name: "", count: 1, percentage: 0 }]);
            }}
          >
            Agregar rubro
          </button>
          <button type="button" onClick={onRedistribute}>
            Redistribuir con IA
          </button>
        </div>
      </section>
      <SuggestionCard
        key={justification}
        title="Justificación del orden y de los pesos"
        body={justification}
        preview={justificationPreview}
        status={justificationStatus}
        fallbackNotice={notice}
        onAccept={onAccept}
        onEdit={onEdit}
        onRegenerate={onRegenerate}
      />
    </main>
  );
}
