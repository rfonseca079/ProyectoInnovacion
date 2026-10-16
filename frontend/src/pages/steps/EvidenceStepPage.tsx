import { useEffect, useRef, useState } from "react";

export type EvidenceCard = {
  blockKey: string;
  kind: "FORMATIVE" | "SCHEDULED";
  position: number;
  title: string;
  measures: string;
  when: string;
  instrument: string;
  expectedLearning: string;
  occursOn: string | null;
};

export const NON_TEACHING_DAY = "Esta fecha está marcada como no lectiva en el calendario.";
export const NO_STORED_LOAD = "No hay otra carga guardada para los rubros actuales.";

const fields = [
  { key: "measures", label: "Qué mide" },
  { key: "when", label: "Cuándo" },
  { key: "instrument", label: "Instrumento" },
  { key: "expectedLearning", label: "Aprendizaje esperado" },
] as const;

export function evidenceCardBody(card: EvidenceCard): string {
  return JSON.stringify({
    kind: card.kind,
    position: card.position,
    title: card.title,
    measures: card.measures,
    when: card.when,
    instrument: card.instrument,
    expectedLearning: card.expectedLearning,
    occursOn: card.occursOn,
  });
}

export function isEvidenceStepReady(cards: EvidenceCard[]): boolean {
  const complete = (kind: EvidenceCard["kind"]) =>
    cards.some(
      (card) =>
        card.kind === kind &&
        [card.measures, card.when, card.instrument, card.expectedLearning].every((value) => value.trim().length > 0),
    );
  return complete("FORMATIVE") && complete("SCHEDULED");
}

export function nonTeachingWarning(occursOn: string | null, days: { date: string; kind: string }[]): string | null {
  if (!occursOn) {
    return null;
  }
  const day = days.find((item) => item.date === occursOn);
  return day && (day.kind === "HOLIDAY" || day.kind === "SUSPENDED") ? NON_TEACHING_DAY : null;
}

export function EvidenceStepPage({
  evidence,
  calendarDays,
  onSave,
  onBalance,
  onAccept,
  onRegenerate,
  onReadyChange,
  actionMessage = "",
  notice = "",
}: {
  evidence: EvidenceCard[];
  calendarDays: { date: string; kind: string; label: string }[];
  onSave: (blockKey: string, body: string) => Promise<void>;
  onBalance: () => void | Promise<void>;
  onAccept: (blockKey: string) => void;
  onRegenerate: (blockKey: string) => void;
  onReadyChange?: (ready: boolean) => void;
  actionMessage?: string;
  notice?: string;
}) {
  const incoming = JSON.stringify(evidence);
  const [cards, setCards] = useState(evidence);
  const cardsRef = useRef(evidence);
  const [seen, setSeen] = useState(incoming);
  if (seen !== incoming) {
    setSeen(incoming);
    setCards(evidence);
    cardsRef.current = evidence;
  }
  const [balancing, setBalancing] = useState(false);
  const balancingRef = useRef(false);
  const ready = isEvidenceStepReady(cards);

  function balance() {
    if (balancingRef.current) {
      return;
    }
    balancingRef.current = true;
    setBalancing(true);
    Promise.resolve(onBalance()).finally(() => {
      balancingRef.current = false;
      setBalancing(false);
    });
  }
  useEffect(() => {
    onReadyChange?.(ready);
  }, [onReadyChange, ready]);

  function updateCard(blockKey: string, patch: Partial<EvidenceCard>, persist: boolean) {
    const next = cardsRef.current.map((card) => (card.blockKey === blockKey ? { ...card, ...patch } : card));
    cardsRef.current = next;
    setCards(next);
    const saved = next.find((card) => card.blockKey === blockKey);
    if (persist && saved) {
      void onSave(saved.blockKey, evidenceCardBody(saved));
    }
  }

  function column(kind: EvidenceCard["kind"], title: string) {
    return (
      <section>
        <h3>{title}</h3>
        {cards
          .filter((card) => card.kind === kind)
          .map((card) => {
            const warning = nonTeachingWarning(card.occursOn, calendarDays);
            return (
              <article key={card.blockKey} className="evidence-card">
                <h3>{card.title}</h3>
                {fields.map((field) => (
                  <label key={field.key}>
                    {field.label}
                    <input
                      id={field.key === "measures" ? `measures-${card.blockKey}` : undefined}
                      aria-label={`${field.label} de ${card.title}`}
                      value={card[field.key]}
                      onChange={(event) => updateCard(card.blockKey, { [field.key]: event.target.value }, false)}
                      onBlur={() => updateCard(card.blockKey, {}, true)}
                    />
                  </label>
                ))}
                <label>
                  Fecha
                  <input
                    type="date"
                    aria-label={`Fecha de ${card.title}`}
                    value={card.occursOn ?? ""}
                    onChange={(event) => updateCard(card.blockKey, { occursOn: event.target.value || null }, false)}
                    onBlur={() => updateCard(card.blockKey, {}, true)}
                  />
                </label>
                {warning ? <p className="evidence-warning">{warning}</p> : null}
                <div className="card-actions">
                  <button type="button" onClick={() => onAccept(card.blockKey)}>
                    Aceptar sugerencia
                  </button>
                  <button type="button" onClick={() => document.getElementById(`measures-${card.blockKey}`)?.focus()}>
                    Editar
                  </button>
                  <button type="button" onClick={() => onRegenerate(card.blockKey)}>
                    Regenerar
                  </button>
                </div>
              </article>
            );
          })}
      </section>
    );
  }

  return (
    <main className="page evidence-step">
      <h2>Evidencias de aprendizaje</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Combine chequeos durante la clase con las evaluaciones ya calendarizadas.</p>
      <button type="button" onClick={balance} disabled={balancing}>
        Equilibrar carga evaluativa del mes
      </button>
      {actionMessage ? <p role="alert">{actionMessage}</p> : null}
      <div className="evidence-columns">
        {column("FORMATIVE", "Durante la clase")}
        {column("SCHEDULED", "Evaluaciones calendarizadas")}
      </div>
    </main>
  );
}
