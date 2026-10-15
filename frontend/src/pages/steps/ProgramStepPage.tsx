import { SuggestionCard } from "../../components/SuggestionCard";
import { AutosaveField } from "../../components/AutosaveField";

export type ProgramBlock = { blockKey: string; status: string; variant: number; body: string };
export type ProgramCalendarDay = { date: string; kind: string; label: string };

const monthNames = [
  "",
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const kindLabel: Record<string, string> = {
  TEACHING: "Lectivo",
  HOLIDAY: "Feriado",
  SUSPENDED: "Suspendido",
  ASSESSMENT: "Evaluación",
};

const cardTitles: Record<string, string> = {
  "month-objectives": "Objetivos priorizados del mes",
  "month-contents": "Contenidos que caben en el tiempo disponible",
  "calendar-risks": "Riesgos de calendario",
};

function blockBody(blocks: ProgramBlock[], blockKey: string): string {
  return blocks.find((block) => block.blockKey === blockKey)?.body ?? "";
}

export function readLessons(body: string): { plannableLessons: string; affectedLessons: string } {
  try {
    const parsed = JSON.parse(body) as { plannableLessons?: string; affectedLessons?: string };
    return {
      plannableLessons: parsed.plannableLessons?.trim() ?? "",
      affectedLessons: parsed.affectedLessons?.trim() ?? "",
    };
  } catch {
    return { plannableLessons: "", affectedLessons: "" };
  }
}

export function isProgramStepReady(blocks: ProgramBlock[]): boolean {
  const lessons = readLessons(blockBody(blocks, "available-time"));
  return Boolean(
    blockBody(blocks, "program-extract").trim() &&
      lessons.plannableLessons &&
      lessons.affectedLessons &&
      blockBody(blocks, "month-objectives").trim() &&
      blockBody(blocks, "month-contents").trim() &&
      blockBody(blocks, "calendar-risks").trim(),
  );
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function ProgramStepPage({
  schoolYear,
  month,
  blocks,
  calendarDays,
  onSaveBlock,
  onReanalyze,
  onAccept,
  onRegenerate,
  onStatus,
  notice = "",
}: {
  schoolYear: number;
  month: number;
  blocks: ProgramBlock[];
  calendarDays: ProgramCalendarDay[];
  onSaveBlock: (blockKey: string, body: string) => Promise<void>;
  onReanalyze: () => void;
  onAccept: (blockKey: string) => void;
  onRegenerate: (blockKey: string) => void;
  onStatus: (state: "idle" | "saved" | "error") => void;
  notice?: string;
}) {
  const lessons = readLessons(blockBody(blocks, "available-time"));
  const marks = new Map(calendarDays.map((day) => [day.date, day]));
  const totalDays = daysInMonth(schoolYear, month);

  function saveLessons(next: { plannableLessons: string; affectedLessons: string }) {
    return onSaveBlock("available-time", JSON.stringify(next));
  }

  return (
    <main className="page program-step">
      <h2>Programa, objetivos y tiempo disponible</h2>
      {notice ? <p>{notice}</p> : null}
      <p>Revise lo esencial del programa oficial y la calendarización real del mes, incluyendo feriados.</p>
      <section>
        <h3>Extracto del programa</h3>
        <p className="extract">{blockBody(blocks, "program-extract")}</p>
        <button type="button" onClick={onReanalyze}>
          Reanalizar programa
        </button>
      </section>
      <section>
        <h3>Tiempo disponible</h3>
        <AutosaveField
          label="Lecciones planificables"
          initialValue={lessons.plannableLessons}
          onStatus={onStatus}
          onSave={(value) => saveLessons({ ...lessons, plannableLessons: value })}
        />
        <AutosaveField
          label="Lecciones afectadas"
          initialValue={lessons.affectedLessons}
          onStatus={onStatus}
          onSave={(value) => saveLessons({ ...lessons, affectedLessons: value })}
        />
        <label>
          Restricciones
          <textarea
            aria-label="Restricciones"
            defaultValue={blockBody(blocks, "calendar-restrictions")}
            onBlur={(event) => {
              void onSaveBlock("calendar-restrictions", event.target.value).then(
                () => onStatus("saved"),
                () => onStatus("error"),
              );
            }}
          />
        </label>
      </section>
      <section>
        <h3>Calendario del mes</h3>
        <ul className="calendar-legend" aria-label="Leyenda del calendario">
          <li>Lectivo</li>
          <li>Feriado</li>
          <li>Suspendido</li>
          <li>Evaluación</li>
        </ul>
        <div className="calendar-grid" role="grid">
          {Array.from({ length: totalDays }, (_, index) => {
            const dayNumber = index + 1;
            const date = `${schoolYear}-${String(month).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
            const mark = marks.get(date);
            const label = mark ? kindLabel[mark.kind] : "";
            const accessibleName = label
              ? `${dayNumber} de ${monthNames[month]}, ${label}`
              : `${dayNumber} de ${monthNames[month]}`;
            return (
              <div key={date} role="gridcell" aria-label={accessibleName} className={mark ? `day day-${mark.kind}` : "day"}>
                <span>{dayNumber}</span>
                {label ? <span>{label}</span> : null}
              </div>
            );
          })}
        </div>
      </section>
      {Object.entries(cardTitles).map(([blockKey, title]) => (
        <SuggestionCard
          key={blockKey}
          title={title}
          body={blockBody(blocks, blockKey)}
          onAccept={() => onAccept(blockKey)}
          onEdit={(body) => {
            void onSaveBlock(blockKey, body);
          }}
          onRegenerate={() => onRegenerate(blockKey)}
        />
      ))}
    </main>
  );
}
