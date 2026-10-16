const subjects: Record<string, string> = {
  MATH: "matematica",
  SPANISH: "espanol",
  SCIENCE: "ciencias",
  SOCIAL_STUDIES: "estudios-sociales",
};

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export type WeekPdfSession = {
  day: string;
  occursOn: string;
  expectedLearning: string;
  durationMinutes: number;
  start: string;
  development: string;
  close: string;
  materials: string;
  formativeEvidence: string;
  homework: string | null;
  planBNote: string | null;
  planBMinutes: number | null;
};

export function weekPdfFilename(weekNumber: number, subject: string, month: number, year: number): string {
  const subjectName = subjects[subject] ?? "asignatura";
  const monthName = months[month - 1] ?? "mes";
  return `semana-${weekNumber}-${subjectName}-${monthName}-${year}.pdf`;
}

const lineWidth = 90;

function pdfString(value: string): string {
  return Buffer.from(value, "latin1")
    .toString("latin1")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapLine(value: string): string[] {
  if (value.length === 0) {
    return [""];
  }
  const lines: string[] = [];
  let current = "";
  for (const word of value.split(" ").filter((part) => part.length > 0)) {
    let remaining = word;
    while (remaining.length > lineWidth) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(remaining.slice(0, lineWidth));
      remaining = remaining.slice(lineWidth);
    }
    const next = current ? `${current} ${remaining}` : remaining;
    if (next.length > lineWidth && current) {
      lines.push(current);
      current = remaining;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function sessionLines(session: WeekPdfSession): string[] {
  const lines = [
    `${session.day} ${session.occursOn}`,
    `Aprendizaje: ${session.expectedLearning}`,
    `Duracion: ${session.durationMinutes} min`,
    `Inicio: ${session.start}`,
    `Desarrollo: ${session.development}`,
    `Cierre: ${session.close}`,
    `Materiales: ${session.materials}`,
    `Evidencia: ${session.formativeEvidence}`,
  ];
  if (session.homework) {
    lines.push(`Tarea: ${session.homework}`);
  }
  if (session.planBNote) {
    lines.push(`${session.planBNote}. Plan B: ${session.planBMinutes ?? ""} min`);
  }
  lines.push("");
  return lines;
}

function latin1(value: string): Buffer {
  return Buffer.from(value, "latin1");
}

export function renderWeekPdf(sessions: WeekPdfSession[]): Buffer {
  const lines = sessions.flatMap(sessionLines).flatMap(wrapLine);
  const commands = ["BT", "/F1 11 Tf", "50 760 Td"];
  lines.forEach((line, index) => {
    if (index > 0) {
      commands.push("0 -14 Td");
    }
    commands.push(`(${pdfString(line)}) Tj`);
  });
  commands.push("ET");
  const stream = latin1(commands.join("\n"));
  const objects = [
    latin1("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"),
    latin1("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"),
    latin1(
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
    ),
    Buffer.concat([
      latin1(`4 0 obj << /Length ${stream.length} >> stream\n`),
      stream,
      latin1("\nendstream endobj\n"),
    ]),
    latin1("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj\n"),
  ];
  const header = latin1("%PDF-1.4\n");
  const parts: Buffer[] = [header];
  const offsets: number[] = [];
  let cursor = header.length;
  for (const object of objects) {
    offsets.push(cursor);
    parts.push(object);
    cursor += object.length;
  }
  const xrefStart = cursor;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`),
    `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`,
  ];
  parts.push(latin1(xref.join("")));
  return Buffer.concat(parts);
}
