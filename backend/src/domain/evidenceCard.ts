export const NO_STORED_LOAD = "No hay otra carga guardada para los rubros actuales.";
export const NON_TEACHING_DAY = "Esta fecha está marcada como no lectiva en el calendario.";

export type EvidenceCardBody = {
  kind: "FORMATIVE" | "SCHEDULED";
  position: number;
  title: string;
  measures: string;
  when: string;
  instrument: string;
  expectedLearning: string;
  occursOn: string | null;
};

export type AssessmentLoadBody = {
  rubricNames: string[];
  rubric: { name: string; count: number; percentage: number }[];
  scheduled: (EvidenceCardBody & { blockKey: string })[];
  updatesRubric: boolean;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function parseEvidenceCard(body: string): EvidenceCardBody | null {
  try {
    const parsed = JSON.parse(body) as Partial<EvidenceCardBody>;
    if (parsed.kind !== "FORMATIVE" && parsed.kind !== "SCHEDULED") {
      return null;
    }
    if (!Number.isInteger(parsed.position)) {
      return null;
    }
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.measures !== "string" ||
      typeof parsed.when !== "string" ||
      typeof parsed.instrument !== "string" ||
      typeof parsed.expectedLearning !== "string"
    ) {
      return null;
    }
    const occursOn = parsed.occursOn === null || parsed.occursOn === "" || parsed.occursOn === undefined ? null : parsed.occursOn;
    if (occursOn !== null && !datePattern.test(occursOn)) {
      return null;
    }
    return {
      kind: parsed.kind,
      position: parsed.position as number,
      title: parsed.title,
      measures: parsed.measures,
      when: parsed.when,
      instrument: parsed.instrument,
      expectedLearning: parsed.expectedLearning,
      occursOn,
    };
  } catch {
    return null;
  }
}

export function parseAssessmentLoad(body: string): AssessmentLoadBody | null {
  try {
    const parsed = JSON.parse(body) as Partial<AssessmentLoadBody>;
    if (!Array.isArray(parsed.rubricNames) || !parsed.rubricNames.every((name) => typeof name === "string")) {
      return null;
    }
    if (!Array.isArray(parsed.rubric) || !Array.isArray(parsed.scheduled)) {
      return null;
    }
    const scheduled = parsed.scheduled.flatMap((card) => {
      if (!card || typeof card.blockKey !== "string") {
        return [];
      }
      const fields = parseEvidenceCard(JSON.stringify(card));
      return fields ? [{ ...fields, blockKey: card.blockKey }] : [];
    });
    if (scheduled.length !== parsed.scheduled.length) {
      return null;
    }
    const rubric = parsed.rubric.flatMap((item) => {
      if (!item || typeof item.name !== "string" || !Number.isInteger(item.count) || !Number.isInteger(item.percentage)) {
        return [];
      }
      return [{ name: item.name, count: item.count, percentage: item.percentage }];
    });
    if (rubric.length !== parsed.rubric.length) {
      return null;
    }
    return { rubricNames: parsed.rubricNames, rubric, scheduled, updatesRubric: parsed.updatesRubric === true };
  } catch {
    return null;
  }
}

export function sameRubricNames(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const remaining = [...right];
  return left.every((name) => {
    const index = remaining.indexOf(name);
    if (index < 0) {
      return false;
    }
    remaining.splice(index, 1);
    return true;
  });
}

export function isCompleteEvidence(card: { measures: string; when: string; instrument: string; expectedLearning: string }): boolean {
  return [card.measures, card.when, card.instrument, card.expectedLearning].every((value) => value.trim().length > 0);
}

export function occursOnDate(value: string | null): Date | null {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}
