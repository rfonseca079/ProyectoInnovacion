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
    include: { blocks: true },
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
    schoolName: plan.schoolName,
    blocks: plan.blocks.map((block) => ({
      blockKey: block.blockKey,
      status: block.status,
      variant: block.variant,
      body: block.body,
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
