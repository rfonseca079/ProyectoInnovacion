import { renderWeekPdf, WeekPdfSession } from "../src/application/renderWeekPdf";

const session: WeekPdfSession = {
  day: "Miércoles",
  occursOn: "2026-03-11",
  expectedLearning: "práctica breve de equivalencias",
  durationMinutes: 40,
  start: "8 min de repaso",
  development: `${"palabra ".repeat(30)}círculos`,
  close: "5 min",
  materials: "cuaderno",
  formativeEvidence: "observación",
  homework: null,
  planBNote: null,
  planBMinutes: null,
};

describe("week PDF bytes", () => {
  const pdf = renderWeekPdf([session]);
  const text = pdf.toString("latin1");

  it("points each cross-reference offset at an object and keeps the accented text", () => {
    const offsets = [...text.matchAll(/^(\d{10}) 00000 n $/gm)].map((match) => Number(match[1]));
    expect(offsets.length).toBeGreaterThan(0);
    for (const offset of offsets) {
      expect(text.slice(offset, offset + 8)).toMatch(/^\d+ 0 obj/);
    }
    expect(text).toContain("Miércoles");
    expect(text).toContain("práctica");
  });

  it("wraps a long development so no drawn line is wider than the page", () => {
    const literals = [...text.matchAll(/\(([^)\\]*)\) Tj/g)].map((match) => match[1]);
    expect(literals.some((line) => line.includes("palabra"))).toBe(true);
    expect(literals.every((line) => line.length <= 90)).toBe(true);
  });
});
