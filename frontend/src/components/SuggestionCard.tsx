import { useRef } from "react";

export function SuggestionCard({
  title,
  body,
  preview,
  fallbackNotice = "",
  status = "SUGGESTED",
  onAccept,
  onEdit,
  onRegenerate,
}: {
  title: string;
  body: string;
  preview?: string;
  fallbackNotice?: string;
  status?: "SUGGESTED" | "ACCEPTED" | "EDITED" | string;
  onAccept: () => void;
  onEdit: (body: string) => void;
  onRegenerate: () => void;
}) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const nextSentence = preview && preview !== body ? preview : "";
  const stateLabel =
    status === "ACCEPTED" ? "Aceptada" : status === "EDITED" ? "Editada" : "Sugerido por IA";
  return (
    <article className="suggestion-card">
      <h3>{title}</h3>
      <p>{stateLabel}</p>
      {fallbackNotice ? <p>{fallbackNotice}</p> : null}
      {nextSentence ? <p>{nextSentence}</p> : null}
      <textarea
        ref={textRef}
        aria-label={title}
        defaultValue={body}
        onBlur={(event) => {
          if (event.target.value !== body) {
            onEdit(event.target.value);
          }
        }}
      />
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
