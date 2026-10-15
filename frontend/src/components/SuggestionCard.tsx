import { useRef } from "react";

export function SuggestionCard({
  title,
  body,
  onAccept,
  onEdit,
  onRegenerate,
}: {
  title: string;
  body: string;
  onAccept: () => void;
  onEdit: (body: string) => void;
  onRegenerate: () => void;
}) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  return (
    <article className="suggestion-card">
      <h3>{title}</h3>
      <textarea ref={textRef} aria-label={title} defaultValue={body} onBlur={(event) => onEdit(event.target.value)} />
      <div className="card-actions">
        <button type="button" onClick={onAccept}>
          Aceptar sugerencia
        </button>
        <button type="button" onClick={() => textRef.current?.focus()}>
          Editar
        </button>
        <button type="button" onClick={onRegenerate}>
          Regenerar
        </button>
      </div>
    </article>
  );
}
