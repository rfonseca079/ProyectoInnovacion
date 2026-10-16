import { Plan, PrismaClient } from "@prisma/client";
import { AppError, PLAN_FORBIDDEN } from "../domain/errors";
import { currentTeacher } from "./loginTeacher";

export type PlanSummary = {
  id: string;
  subject: string;
  gradeLevel: number;
  month: number;
  schoolYear: number;
  schoolName: string;
  status: string;
  currentStep: number;
  updatedAt: string;
};

function toSummary(plan: Plan): PlanSummary {
  return {
    id: plan.id,
    subject: plan.subject,
    gradeLevel: plan.gradeLevel,
    month: plan.month,
    schoolYear: plan.schoolYear,
    schoolName: plan.schoolName,
    status: plan.status,
    currentStep: plan.currentStep,
    updatedAt: plan.updatedAt.toISOString(),
  };
}

export async function listPlans(prisma: PrismaClient, sessionId: string | undefined): Promise<PlanSummary[]> {
  const teacher = await currentTeacher(prisma, sessionId);
  const plans = await prisma.plan.findMany({
    where: { teacherId: teacher.id },
    orderBy: { updatedAt: "desc" },
  });
  return plans.map(toSummary);
}

export async function getPlan(prisma: PrismaClient, sessionId: string | undefined, planId: string) {
  const teacher = await currentTeacher(prisma, sessionId);
  const plan = await prisma.plan.findFirst({
    where: { id: planId, teacherId: teacher.id },
    include: {
      blocks: true,
      weeks: { orderBy: { position: "asc" } },
      classSessions: { orderBy: [{ weekPosition: "asc" }, { position: "asc" }] },
      rubricItems: { orderBy: { position: "asc" } },
      evidence: { orderBy: [{ kind: "asc" }, { position: "asc" }] },
    },
  });
  if (!plan) {
    throw new AppError(404, "NOT_FOUND", PLAN_FORBIDDEN);
  }
  return {
    ...toSummary(plan),
    highestVisitedStep: plan.highestVisitedStep,
    teacherName: plan.teacherName,
    section: plan.section,
    scenarioId: plan.scenarioId,
    usedFallback: plan.usedFallback,
    adjustmentApplied: plan.adjustmentApplied,
    schoolName: plan.schoolName,
    blocks: plan.blocks.map((block) => ({
      blockKey: block.blockKey,
      status: block.status,
      variant: block.variant,
      body: block.body,
    })),
    weeks: plan.weeks.map((week) => ({
      position: week.position,
      title: week.title,
      active: week.active,
      sessions: plan.classSessions
        .filter((session) => session.weekPosition === week.position)
        .map((session) => ({
          id: session.id,
          position: session.position,
          day: session.day,
          occursOn: session.occursOn.toISOString().slice(0, 10),
          expectedLearning: session.expectedLearning,
          durationMinutes: session.durationMinutes,
          start: session.start,
          development: session.development,
          close: session.close,
          materials: session.materials,
          formativeEvidence: session.formativeEvidence,
          homework: session.homework,
          expanded: session.expanded,
          status: session.status,
          planBNote: session.planBNote,
          planBMinutes: session.planBMinutes,
        })),
    })),
    rubric: plan.rubricItems.map((item) => ({
      name: item.name,
      count: item.count,
      percentage: item.percentage,
    })),
    evidence: plan.evidence.map((item) => ({
      blockKey: item.blockKey,
      kind: item.kind,
      position: item.position,
      title: item.title,
      measures: item.measures,
      when: item.when,
      instrument: item.instrument,
      expectedLearning: item.expectedLearning,
      occursOn: item.occursOn ? item.occursOn.toISOString().slice(0, 10) : null,
    })),
    calendarDays: (
      plan.scenarioId
        ? await prisma.calendarDay.findMany({
            where: { scenarioId: plan.scenarioId },
            orderBy: { date: "asc" },
          })
        : []
    ).map((day) => ({
      date: day.date.toISOString().slice(0, 10),
      kind: day.kind,
      label: day.label,
    })),
  };
}
