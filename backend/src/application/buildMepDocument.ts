import { MepDocument, MepRow, Prisma, PrismaClient, Subject } from "@prisma/client";
import { AppError, PLAN_FORBIDDEN } from "../domain/errors";
import { MepTemplate } from "../../prisma/mepSeed";
import { getPlan } from "./listPlans";

const subjectLabels: Record<Subject, string> = {
  MATH: "Matemática",
  SPANISH: "Español",
  SCIENCE: "Ciencias",
  SOCIAL_STUDIES: "Estudios Sociales",
};

const monthNames = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

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
  rows: { position: number; expectedLearning: string; mediationStrategy: string; indicator: string }[];
};

function readableMediation(
  block: { status: string; body: string } | undefined,
  templateStrategy: string,
): string {
  if (!block || block.status !== "EDITED") {
    return templateStrategy;
  }
  try {
    const parsed = JSON.parse(block.body) as { activity?: unknown }[];
    if (Array.isArray(parsed)) {
      const names = parsed
        .map((row) => (typeof row?.activity === "string" ? row.activity.trim() : ""))
        .filter((name) => name.length > 0);
      return names.length > 0 ? names.join("; ") : templateStrategy;
    }
  } catch {
    // A plain-text edit is already the strategy the teacher wrote.
  }
  const text = block.body.trim();
  return text.length > 0 ? text : templateStrategy;
}

function editedLearning(
  sessions: { weekPosition: number; position: number; status: string; expectedLearning: string }[],
  activeWeek: number | undefined,
  templateLearning: string,
): string {
  const edited = sessions
    .filter((session) => session.weekPosition === activeWeek && session.status === "EDITED" && session.expectedLearning.trim().length > 0)
    .sort((left, right) => left.position - right.position);
  return edited[0]?.expectedLearning ?? templateLearning;
}

function editedIndicator(blocks: { status: string; body: string }[], templateIndicator: string): string {
  const cards = blocks
    .filter((block) => block.status === "EDITED")
    .flatMap((block) => {
      try {
        const card = JSON.parse(block.body) as { kind?: unknown; position?: unknown; expectedLearning?: unknown };
        if (card.kind !== "FORMATIVE" || typeof card.expectedLearning !== "string" || card.expectedLearning.trim().length === 0) {
          return [];
        }
        return [{ position: typeof card.position === "number" ? card.position : 0, expectedLearning: card.expectedLearning }];
      } catch {
        return [];
      }
    })
    .sort((left, right) => left.position - right.position);
  return cards[0]?.expectedLearning ?? templateIndicator;
}

function toView(document: MepDocument & { rows: MepRow[] }): MepDocumentView {
  return {
    regionalDirectorate: document.regionalDirectorate,
    schoolName: document.schoolName,
    teacherName: document.teacherName,
    subjectLabel: document.subjectLabel,
    gradeLabel: document.gradeLabel,
    schoolYear: document.schoolYear,
    periodicity: document.periodicity,
    competencies: document.competencies,
    observations: document.observations,
    instruments: document.instruments,
    rows: [...document.rows]
      .sort((left, right) => left.position - right.position)
      .map((row) => ({
        position: row.position,
        expectedLearning: row.expectedLearning,
        mediationStrategy: row.mediationStrategy,
        indicator: row.indicator,
      })),
  };
}

export async function readMepDocument(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
): Promise<MepDocumentView> {
  await getPlan(prisma, sessionId, planId);
  const existing = await prisma.mepDocument.findUnique({
    where: { planId },
    include: { rows: true },
  });
  if (existing) {
    return toView(existing);
  }
  const plan = await prisma.plan.findFirst({
    where: { id: planId },
    include: {
      blocks: true,
      weeks: true,
      classSessions: true,
      evidence: { orderBy: [{ kind: "asc" }, { position: "asc" }] },
    },
  });
  if (!plan?.scenarioId) {
    throw new AppError(404, "NOT_FOUND", PLAN_FORBIDDEN);
  }
  const stored = await prisma.suggestionVariant.findUnique({
    where: {
      scenarioId_blockKey_variant: { scenarioId: plan.scenarioId, blockKey: "mep-template", variant: 1 },
    },
  });
  if (!stored) {
    throw new AppError(404, "NOT_FOUND", "No hay una plantilla guardada para este escenario.");
  }
  const template = JSON.parse(stored.body) as MepTemplate;
  const notes = plan.blocks.find((block) => block.blockKey === "teacher-notes");
  const mediation = plan.blocks.find((block) => block.blockKey === "mediation-in-class");
  const observations = notes?.status === "EDITED" ? notes.body : template.observations;
  const created = await prisma.mepDocument.create({
    data: {
      planId,
      regionalDirectorate: plan.regionalDirectorate,
      schoolName: plan.schoolName,
      teacherName: plan.teacherName,
      subjectLabel: subjectLabels[plan.subject],
      gradeLabel: `${plan.gradeLevel}.° año`,
      schoolYear: plan.schoolYear,
      periodicity: `Mensual — ${monthNames[plan.month]}`,
      competencies: template.competencies,
      observations,
      instruments: plan.evidence.map((card) => card.instrument),
      rows: {
        create: template.rows.map((row, index) => ({
          position: index + 1,
          expectedLearning: index === 0 ? editedLearning(plan.classSessions, plan.weeks.find((week) => week.active)?.position, row.expectedLearning) : row.expectedLearning,
          mediationStrategy: index === 0 ? readableMediation(mediation, row.mediationStrategy) : row.mediationStrategy,
          indicator: index === 0 ? editedIndicator(plan.blocks, row.indicator) : row.indicator,
        })),
      },
    },
    include: { rows: true },
  });
  return toView(created);
}

const documentTextFields = [
  "regionalDirectorate",
  "schoolName",
  "teacherName",
  "subjectLabel",
  "gradeLabel",
  "periodicity",
  "competencies",
  "observations",
] as const;

type DocumentPatch = Partial<Record<(typeof documentTextFields)[number], unknown>> & {
  schoolYear?: unknown;
  instruments?: unknown;
  rows?: unknown;
};

export async function updateMepDocument(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  body: DocumentPatch,
): Promise<MepDocumentView> {
  await getPlan(prisma, sessionId, planId);
  const existing = await prisma.mepDocument.findUnique({ where: { planId }, include: { rows: true } });
  if (!existing) {
    throw new AppError(404, "NOT_FOUND", "No hay un documento guardado para este planeamiento.");
  }
  const data: Prisma.MepDocumentUpdateInput = {};
  for (const field of documentTextFields) {
    if (typeof body[field] === "string") {
      data[field] = body[field];
    }
  }
  if (typeof body.schoolYear === "number") {
    data.schoolYear = body.schoolYear;
  }
  if (Array.isArray(body.instruments) && body.instruments.every((item) => typeof item === "string")) {
    data.instruments = body.instruments;
  }
  if (Array.isArray(body.rows)) {
    for (const row of body.rows) {
      if (!row || typeof row !== "object") {
        continue;
      }
      const position = (row as { position?: unknown }).position;
      if (typeof position !== "number") {
        continue;
      }
      const current = existing.rows.find((item) => item.position === position);
      if (!current) {
        continue;
      }
      const next = row as { expectedLearning?: unknown; mediationStrategy?: unknown; indicator?: unknown };
      await prisma.mepRow.update({
        where: { id: current.id },
        data: {
          ...(typeof next.expectedLearning === "string" ? { expectedLearning: next.expectedLearning } : {}),
          ...(typeof next.mediationStrategy === "string" ? { mediationStrategy: next.mediationStrategy } : {}),
          ...(typeof next.indicator === "string" ? { indicator: next.indicator } : {}),
        },
      });
    }
  }
  const updated = await prisma.mepDocument.update({
    where: { planId },
    data,
    include: { rows: true },
  });
  return toView(updated);
}
