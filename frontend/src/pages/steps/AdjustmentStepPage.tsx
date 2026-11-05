import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SuggestionCard } from "../../components/SuggestionCard";

const comparisonFields = [
  { key: "adjustment-planned", label: "Lo planeado" },
  { key: "adjustment-executed", label: "Lo ejecutado" },
  { key: "adjustment-achieved", label: "Aprendizajes logrados" },
  { key: "adjustment-pending", label: "Aprendizajes pendientes" },
  { key: "adjustment-collected-evidence", label: "Evidencia recogida" },
] as const;

const cards = [
  { key: "adjustment-1", title: "Ajuste 1" },
  { key: "adjustment-2", title: "Ajuste 2" },
  { key: "adjustment-3", title: "Ajuste 3" },
] as const;

type AdjustmentBlock = { blockKey: string; body: string; preview?: string; status?: string };

export type AdjustmentSessionSketch = {
  day: string;
  occursOn: string;
  expectedLearning: string;
  start: string;
};

function blockBody(blocks: AdjustmentBlock[], blockKey: string): string {
  return blocks.find((block) => block.blockKey === blockKey)?.body ?? "";
}

export function AdjustmentStepPage({
  adjustmentApplied,
  notifyEvaluationChanges,
  blocks,
  sessions,
  onSaveField,
  onToggle,
  onApply,
  onAccept,
  onRegenerate,
  notice = "",
}: {
  adjustmentApplied: boolean;
  notifyEvaluationChanges: boolean;
  blocks: AdjustmentBlock[];
  sessions: AdjustmentSessionSketch[];
  onSaveField: (blockKey: string, body: string) => Promise<void>;
  onToggle: (enabled: boolean) => Promise<void>;
  onApply: () => Promise<void>;
  onAccept: (blockKey: string) => void;
  onRegenerate: (blockKey: string) => void;
  notice?: string;
}) {
  const navigate = useNavigate();
  const { planId = "" } = useParams();
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  function openDocument(notice: string) {
    navigate(`/plans/${planId}/steps/7`, { state: notice ? { adjustmentNotice: notice } : {} });
  }

  async function apply() {
    setApplying(true);
    setMessage("");
    try {
      await onApply();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "No se pudieron aplicar los ajustes.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <main className="page adjustment-step">
      <h2>Ajuste lo planeado según lo ocurrido</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Puede registrar lo ocurrido y redistribuir las actividades para adaptarlas al tiempo disponible.</p>
      <div className="adjustment-layout">
        <section aria-label="Sesión de referencia">
          <h3>Sesión de referencia</h3>
          {comparisonFields.map((field) => (
            <label key={field.key}>
              {field.label}
              <textarea
                aria-label={field.label}
                defaultValue={blockBody(blocks, field.key)}
                onBlur={(event) => {
                  void onSaveField(field.key, event.target.value);
                }}
              />
            </label>
          ))}
        </section>
        <section aria-label="Ajustes">
          {cards.map((card) => (
            <SuggestionCard
              key={`${card.key}-${blockBody(blocks, card.key)}`}
              title={card.title}
              body={blockBody(blocks, card.key)}
              preview={blocks.find((block) => block.blockKey === card.key)?.preview}
              status={blocks.find((block) => block.blockKey === card.key)?.status}
              fallbackNotice={notice}
              onAccept={() => onAccept(card.key)}
              onEdit={(body) => {
                if (body === blockBody(blocks, card.key)) {
                  return;
                }
                void onSaveField(card.key, body);
              }}
              onRegenerate={() => onRegenerate(card.key)}
            />
          ))}
        </section>
        <label className="adjustment-log">
          Bitácora de la persona docente
          <textarea
            aria-label="Bitácora de la persona docente"
            defaultValue={blockBody(blocks, "adjustment-log")}
            onBlur={(event) => {
              void onSaveField("adjustment-log", event.target.value);
            }}
          />
        </label>
        <section className="adjustment-week" aria-label="Esquema de la semana">
          <h3>{adjustmentApplied ? "Semana actualizada" : "Semana original"}</h3>
          <ul>
            {sessions.map((session) => (
              <li key={session.occursOn}>
                {session.day}: {adjustmentApplied ? session.start : session.expectedLearning}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <label>
        <input
          type="checkbox"
          checked={notifyEvaluationChanges}
          onChange={(event) => {
            void onToggle(event.target.checked);
          }}
        />
        Notificar cambios en evaluaciones calendarizadas
      </label>
      {message ? <p role="alert">{message}</p> : null}
      <div className="adjustment-actions">
        <button type="button" onClick={() => void apply()} disabled={applying}>
          Aplicar ajustes al planeamiento
        </button>
        <button
          type="button"
          onClick={() => openDocument(adjustmentApplied ? "" : "Aún no hay ajustes aplicados.")}
        >
          Volver al formato MEP actualizado
        </button>
        <button type="button" onClick={() => openDocument("")}>
          Atrás
        </button>
      </div>
    </main>
  );
}
