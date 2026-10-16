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
  return `semana-${weekNumber}-${subjectSlug(subject)}-${monthSlug(month)}-${year}.pdf`;
}

export function planPdfFilename(subject: string, grade: number, month: number, year: number): string {
  return `planeamiento-${subjectSlug(subject)}-${grade}-${monthSlug(month)}-${year}.pdf`;
}

function subjectSlug(subject: string): string {
  return subjects[subject] ?? "asignatura";
}

function monthSlug(month: number): string {
  return months[month - 1] ?? "mes";
}

const lineWidth = 88;

function winAnsi(value: string): string {
  return value
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/\u2026/g, "...")
    .replace(/[^\u0000-\u00FF]/g, "");
}

export function pdfString(value: string): string {
  return Buffer.from(winAnsi(value), "latin1")
    .toString("latin1")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export function wrapPdfLine(value: string, width: number): string[] {
  if (value.length === 0) {
    return [""];
  }
  const lines: string[] = [];
  let current = "";
  for (const word of value.split(" ").filter((part) => part.length > 0)) {
    let remaining = word;
    while (remaining.length > width) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(remaining.slice(0, width));
      remaining = remaining.slice(width);
    }
    const next = current ? `${current} ${remaining}` : remaining;
    if (next.length > width && current) {
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

function wrapLine(value: string): string[] {
  return wrapPdfLine(value, lineWidth);
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

export function assemblePdf(pageStreams: string[]): Buffer {
  const streams = pageStreams.length > 0 ? pageStreams : [""];
  const regularFontId = 3 + streams.length * 2;
  const boldFontId = regularFontId + 1;
  const pageIds = streams.map((_, index) => 3 + index * 2);
  const objects: Buffer[] = [
    latin1("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"),
    latin1(
      `2 0 obj << /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${streams.length} >> endobj\n`,
    ),
  ];

  streams.forEach((source, index) => {
    const pageId = pageIds[index];
    const contentId = pageId + 1;
    const stream = latin1(source);
    objects.push(
      latin1(
        `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> >> endobj\n`,
      ),
    );
    objects.push(
      Buffer.concat([
        latin1(`${contentId} 0 obj << /Length ${stream.length} >> stream\n`),
        stream,
        latin1("\nendstream endobj\n"),
      ]),
    );
  });

  objects.push(
    latin1(
      `${regularFontId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj\n`,
    ),
  );
  objects.push(
    latin1(
      `${boldFontId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> endobj\n`,
    ),
  );

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

export function renderTextPdf(lines: string[]): Buffer {
  const wrapped = lines.flatMap(wrapLine);
  const linesPerPage = 46;
  const chunks: string[][] = [];
  for (let start = 0; start < Math.max(wrapped.length, 1); start += linesPerPage) {
    const page = wrapped.slice(start, start + linesPerPage);
    chunks.push(page.length > 0 ? page : [""]);
  }
  return assemblePdf(
    chunks.map((pageLines) => {
      const commands = ["BT", "/F1 11 Tf", "54 740 Td"];
      pageLines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          commands.push("0 -14 Td");
        }
        commands.push(`(${pdfString(line)}) Tj`);
      });
      commands.push("ET");
      return commands.join("\n");
    }),
  );
}

export function renderWeekPdf(sessions: WeekPdfSession[]): Buffer {
  return renderTextPdf(sessions.flatMap(sessionLines));
}
