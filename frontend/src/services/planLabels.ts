export type PlanSummary = {
  id: string;
  subject: string;
  gradeLevel: number;
  month: number;
  schoolYear: number;
  schoolName: string;
  status: "DRAFT" | "READY_FOR_DELIVERY" | "ADJUSTED";
  currentStep: number;
  updatedAt: string;
  section?: string;
};

const subjects: Record<string, string> = {
  MATH: "Matemática",
  SPANISH: "Español",
  SCIENCE: "Ciencias",
  SOCIAL_STUDIES: "Estudios Sociales",
};

const months = [
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

export function subjectLabel(subject: string): string {
  return subjects[subject] ?? subject;
}

export function statusLabel(status: PlanSummary["status"], currentStep: number): string {
  if (status === "DRAFT") {
    return `Borrador · Paso ${currentStep} de 8`;
  }
  if (status === "READY_FOR_DELIVERY") {
    return "Listo para entrega";
  }
  return "Ajustado";
}

export function planRowText(plan: PlanSummary): string {
  const updated = new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Costa_Rica",
  }).format(new Date(plan.updatedAt));
  return [
    subjectLabel(plan.subject),
    `${plan.gradeLevel}.° año`,
    `${months[plan.month]} ${plan.schoolYear}`,
    plan.schoolName,
    statusLabel(plan.status, plan.currentStep),
    updated,
  ].join(" · ");
}
