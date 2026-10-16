import { MepDocument, MepRow } from "@prisma/client";
import { assemblePdf, pdfString } from "./renderWeekPdf";

export const INSTITUTIONAL_HEADER = "Dirección Regional de Educación";

export type SavedMepDocument = MepDocument & { rows: MepRow[] };

const pageWidth = 612;
const pageHeight = 792;
const margin = 36;
const bottomMargin = 48;
const contentWidth = pageWidth - margin * 2;
const columnWidths = [180, 180, 180];
const columnHeaders = ["Aprendizajes esperados", "Estrategias de mediación", "Indicadores"];

export function renderPlanPdf(document: SavedMepDocument): Buffer {
  const rows = [...document.rows].sort((left, right) => left.position - right.position);
  const layout = new PlanPdfLayout();
  layout.paintTitle(false);
  const fields: [string, string][] = [
    [INSTITUTIONAL_HEADER, document.regionalDirectorate],
    ["Centro educativo", document.schoolName],
    ["Nombre de la persona docente", document.teacherName],
    ["Asignatura", document.subjectLabel],
    ["Nivel", document.gradeLabel],
    ["Curso lectivo", String(document.schoolYear)],
    ["Periodicidad", document.periodicity],
    ["Competencias generales", document.competencies],
  ];
  for (const [label, value] of fields) {
    layout.drawRow([label, value], [200, 340], 9, { shadeFirst: true });
  }
  layout.gap(16);
  layout.beginTable();
  layout.drawRow(columnHeaders, columnWidths, 8, { header: true });
  for (const row of rows) {
    layout.drawRow([row.expectedLearning, row.mediationStrategy, row.indicator], columnWidths, 8, {});
  }
  layout.endTable();
  layout.gap(18);
  layout.drawHeading("Instrumentos de evaluación");
  for (const instrument of document.instruments) {
    layout.drawParagraph(`- ${instrument}`, 9);
  }
  layout.gap(10);
  layout.drawHeading("Observaciones");
  layout.drawBoxedText(document.observations, 9);
  return assemblePdf(layout.finish());
}

class PlanPdfLayout {
  private pages: string[][] = [];
  private commands: string[] = [];
  private cursor = pageHeight - margin;
  private inTable = false;

  paintTitle(continued: boolean): void {
    const height = 28;
    const boxBottom = this.cursor - height;
    this.commands.push(`0.059 0.239 0.298 rg ${margin} ${boxBottom} ${contentWidth} ${height} re f`);
    this.commands.push("0 0 0 rg");
    this.commands.push(showText(margin + 12, boxBottom + 9, 12, "Planeamiento didáctico", true, "1 1 1 rg"));
    if (continued) {
      this.commands.push(showText(margin + 250, boxBottom + 10, 9, "continuación", false, "0.85 0.92 0.9 rg"));
    }
    this.cursor = boxBottom - 12;
  }

  beginTable(): void {
    this.inTable = true;
  }

  endTable(): void {
    this.inTable = false;
  }

  gap(amount: number): void {
    if (this.cursor - amount < bottomMargin) {
      this.newPage();
      return;
    }
    this.cursor -= amount;
  }

  drawHeading(title: string): void {
    const height = 18;
    if (this.cursor - height < bottomMargin) {
      this.newPage();
    }
    this.commands.push(showText(margin, this.cursor - 14, 11, title, true));
    this.cursor -= height;
  }

  drawParagraph(value: string, fontSize: number): void {
    const lines = wrapToWidth(value, contentWidth - 10, fontSize);
    const lineHeight = fontSize + 5;
    for (const line of lines) {
      if (this.cursor - lineHeight < bottomMargin) {
        this.newPage();
      }
      this.commands.push(showText(margin, this.cursor - fontSize, fontSize, line, false));
      this.cursor -= lineHeight;
    }
  }

  drawBoxedText(value: string, fontSize: number): void {
    const lines = wrapToWidth(value, contentWidth - 16, fontSize);
    const lineHeight = fontSize + 4;
    let drawn = 0;
    while (drawn < lines.length) {
      const maxLines = Math.floor((this.cursor - bottomMargin - 10) / lineHeight);
      if (maxLines < 1) {
        this.newPage();
        continue;
      }
      const take = Math.min(maxLines, lines.length - drawn);
      const height = take * lineHeight + 10;
      const boxBottom = this.cursor - height;
      this.commands.push(`0.72 0.78 0.75 RG 0.8 w ${margin} ${boxBottom} ${contentWidth} ${height} re S`);
      this.commands.push("0 0 0 RG");
      lines.slice(drawn, drawn + take).forEach((line, index) => {
        this.commands.push(showText(margin + 6, this.cursor - 6 - fontSize - index * lineHeight, fontSize, line, false));
      });
      this.cursor = boxBottom;
      drawn += take;
    }
  }

  drawRow(
    cells: string[],
    widths: number[],
    fontSize: number,
    options: { header?: boolean; shadeFirst?: boolean },
  ): void {
    const lineHeight = fontSize + 5;
    const wrapped = cells.map((cell, index) => wrapToWidth(cell, widths[index] - 10, fontSize));
    const totalLines = Math.max(1, ...wrapped.map((lines) => lines.length));
    let drawn = 0;
    while (drawn < totalLines) {
      const maxLines = Math.floor((this.cursor - bottomMargin - 8) / lineHeight);
      if (maxLines < 1) {
        this.newPage();
        continue;
      }
      const take = Math.min(maxLines, totalLines - drawn);
      const height = take * lineHeight + 8;
      const top = this.cursor;
      const boxBottom = top - height;
      let x = margin;
      cells.forEach((_, index) => {
        const shade = options.header || (options.shadeFirst === true && index === 0);
        if (shade) {
          this.commands.push(`0.93 0.96 0.95 rg ${x} ${boxBottom} ${widths[index]} ${height} re f`);
          this.commands.push("0 0 0 rg");
        }
        this.commands.push(`0.72 0.78 0.75 RG 0.8 w ${x} ${boxBottom} ${widths[index]} ${height} re S`);
        this.commands.push("0 0 0 RG");
        wrapped[index].slice(drawn, drawn + take).forEach((line, lineIndex) => {
          this.commands.push(
            showText(x + 5, top - 4 - fontSize - lineIndex * lineHeight, fontSize, line, options.header === true),
          );
        });
        x += widths[index];
      });
      this.cursor = boxBottom;
      drawn += take;
    }
  }

  finish(): string[] {
    if (this.commands.length > 0) {
      this.pages.push(this.commands);
    }
    return this.pages.map((page) => page.join("\n"));
  }

  private newPage(): void {
    if (this.commands.length > 0) {
      this.pages.push(this.commands);
    }
    this.commands = [];
    this.cursor = pageHeight - margin;
    this.paintTitle(true);
    if (this.inTable) {
      this.drawRow(columnHeaders, columnWidths, 8, { header: true });
    }
  }
}

const helveticaUnits: Record<string, number> = {
  " ": 278,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 611, v: 500, w: 722, x: 500, y: 500, z: 500,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833,
  N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556, "8": 556, "9": 556,
  ".": 278, ",": 278, ":": 278, ";": 278, "-": 333, "'": 191, "(": 333, ")": 333, "/": 278, "?": 556, "!": 278,
  "°": 400,
};

function textUnits(value: string): number {
  let units = 0;
  for (const char of value) {
    const base = char.normalize("NFD").replace(/\p{M}/gu, "");
    units += helveticaUnits[char] ?? helveticaUnits[base] ?? helveticaUnits[base.toLowerCase()] ?? 560;
  }
  return units;
}

function wrapToWidth(value: string, maxPoints: number, fontSize: number): string[] {
  if (value.length === 0) {
    return [""];
  }
  const limit = maxPoints * 1000;
  const lines: string[] = [];
  let current = "";
  for (const word of value.split(" ").filter((part) => part.length > 0)) {
    let remaining = word;
    while (textUnits(remaining) * fontSize > limit) {
      if (current) {
        lines.push(current);
        current = "";
      }
      let take = 1;
      while (take < remaining.length && textUnits(remaining.slice(0, take + 1)) * fontSize <= limit) {
        take += 1;
      }
      lines.push(remaining.slice(0, take));
      remaining = remaining.slice(take);
    }
    const next = current ? `${current} ${remaining}` : remaining;
    if (current && textUnits(next) * fontSize > limit) {
      lines.push(current);
      current = remaining;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines.length > 0 ? lines : [""];
}

function showText(x: number, baseline: number, size: number, value: string, bold: boolean, color = "0 0 0 rg"): string {
  const font = bold ? "F2" : "F1";
  return `${color}\nBT /${font} ${size} Tf 1 0 0 1 ${Math.round(x)} ${Math.round(baseline)} Tm (${pdfString(value)}) Tj ET`;
}
