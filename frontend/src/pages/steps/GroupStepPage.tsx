import { useEffect, useRef, useState } from "react";
import { SuggestionCard } from "../../components/SuggestionCard";

export const groupFields = [
  { key: "prior-knowledge", label: "Conocimientos previos" },
  { key: "difficulties", label: "Áreas de dificultad" },
  { key: "resources", label: "Recursos del aula" },
  { key: "pace", label: "Ritmo del grupo" },
  { key: "supports", label: "Apoyos requeridos" },
  { key: "teacher-notes", label: "Observaciones de la persona docente" },
] as const;

const implicationCards = [
  { key: "implication-manipulatives", title: "Manipulativos" },
  { key: "implication-scaffolding", title: "Andamiaje" },
  { key: "implication-differentiation", title: "Diferenciación ligera" },
] as const;

type GroupBlock = { blockKey: string; body: string; preview?: string; status?: string };

function blockBody(blocks: GroupBlock[], blockKey: string): string {
  return blocks.find((block) => block.blockKey === blockKey)?.body ?? "";
}

export function isGroupStepReady(blocks: GroupBlock[]): boolean {
  return groupFields.every((field) => blockBody(blocks, field.key).trim().length > 0);
}

function emptyFieldMessage(values: Record<string, string>): string | null {
  const missing = groupFields.find((field) => values[field.key].trim().length === 0);
  return missing ? `Complete el campo ${missing.label}.` : null;
}

export function GroupStepPage({
  blocks,
  onSaveField,
  onGenerate,
  onAccept,
  onEdit,
  onRegenerate,
  onReadyChange,
  actionMessage = "",
  notice = "",
}: {
  blocks: GroupBlock[];
  onSaveField: (blockKey: string, body: string) => Promise<void>;
  onGenerate: () => void | Promise<void>;
  onAccept: (blockKey: string) => void;
  onEdit: (blockKey: string, body: string) => void;
  onRegenerate: (blockKey: string) => void;
  onReadyChange?: (ready: boolean) => void;
  actionMessage?: string;
  notice?: string;
}) {
  const initial = Object.fromEntries(groupFields.map((field) => [field.key, blockBody(blocks, field.key)]));
  const [values, setValues] = useState(initial);
  const valuesRef = useRef(initial);
  const [generating, setGenerating] = useState(false);
  const blockKey = JSON.stringify(groupFields.map((field) => blockBody(blocks, field.key)));
  const [seenBlocks, setSeenBlocks] = useState(blockKey);
  if (seenBlocks !== blockKey) {
    const previous = JSON.parse(seenBlocks) as string[];
    const next = { ...valuesRef.current };
    groupFields.forEach((field, index) => {
      if (next[field.key] === previous[index]) {
        next[field.key] = blockBody(blocks, field.key);
      }
    });
    setSeenBlocks(blockKey);
    setValues(next);
    valuesRef.current = next;
  }
  const message = emptyFieldMessage(values);
  const ready = message === null;
  useEffect(() => {
    onReadyChange?.(ready);
  }, [onReadyChange, ready]);

  return (
    <main className="page group-step">
      <h2>Conozca a su grupo</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Complete el perfil del grupo. Después puede adaptar la mediación y las evaluaciones.</p>
      {groupFields.map((field) => (
        <label key={field.key}>
          {field.label}
          <textarea
            aria-label={field.label}
            aria-invalid={values[field.key].trim().length === 0}
            value={values[field.key]}
            onChange={(event) => {
              const next = { ...valuesRef.current, [field.key]: event.target.value };
              valuesRef.current = next;
              setValues(next);
            }}
            onBlur={() => {
              void onSaveField(field.key, valuesRef.current[field.key]);
            }}
          />
        </label>
      ))}
      {message ? <p role="alert">{message}</p> : null}
      {actionMessage ? <p role="alert">{actionMessage}</p> : null}
      <div className="card-actions">
        <button
          type="button"
          disabled={generating}
          onClick={() => {
            if (generating) {
              return;
            }
            setGenerating(true);
            void Promise.resolve(onGenerate()).finally(() => {
              setGenerating(false);
            });
          }}
        >
          Generar implicaciones pedagógicas
        </button>
      </div>
      {implicationCards.map((card) => (
        <SuggestionCard
          key={`${card.key}-${blockBody(blocks, card.key)}`}
          title={card.title}
          body={blockBody(blocks, card.key)}
          preview={blocks.find((block) => block.blockKey === card.key)?.preview}
          status={blocks.find((block) => block.blockKey === card.key)?.status}
          fallbackNotice={notice}
          onAccept={() => onAccept(card.key)}
          onEdit={(body) => onEdit(card.key, body)}
          onRegenerate={() => onRegenerate(card.key)}
        />
      ))}
    </main>
  );
}
