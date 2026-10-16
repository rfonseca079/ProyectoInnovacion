import { renderPlanPdf, SavedMepDocument } from "../src/application/renderPlanPdf";

const document = {
  regionalDirectorate: "Dirección Regional San José",
  schoolName: "Escuela República de Arabia Saudita",
  teacherName: "Juanita Pérez",
  subjectLabel: "Matemática",
  gradeLabel: "4.° año",
  schoolYear: 2026,
  periodicity: "Mensual — Marzo",
  competencies: "Ciudadanía responsable y solidaria",
  observations: "Observación de la entrega.",
  instruments: ["Lista de cotejo"],
  rows: [
    { position: 1, expectedLearning: "reconocer fracciones", mediationStrategy: "material concreto", indicator: "representa dos fracciones" },
    { position: 2, expectedLearning: "resolver un problema", mediationStrategy: "práctica en parejas", indicator: "explica la equivalencia" },
  ],
} as SavedMepDocument;

describe("institutional PDF text", () => {
  it("lays the MEP columns out as a bordered table", () => {
    const text = renderPlanPdf(document).toString("latin1");
    expect(text).toContain("(Aprendizajes esperados) Tj");
    expect(text).toContain("(Estrategias de mediación) Tj");
    expect(text).toContain("(Indicadores) Tj");
    expect(text).toContain("(reconocer fracciones) Tj");
    expect(text).not.toContain("Aprendizajes esperados:");
    expect(text).toMatch(/\d+ \d+ \d+ \d+ re S/);
  });

  it("writes the periodicity em dash as a hyphen", () => {
    const text = renderPlanPdf(document).toString("latin1");
    expect(text).toContain("Mensual - Marzo");
    expect(text).not.toContain("\u0014");
  });

  it("splits a long institutional document across more than one page", () => {
    const longRow = {
      expectedLearning: "reconocer fracciones equivalentes en situaciones de la casa ".repeat(12),
      mediationStrategy: "representar con material concreto y explicar la equivalencia ".repeat(12),
      indicator: "muestra dos fracciones equivalentes y justifica el procedimiento ".repeat(12),
    };
    const longDocument = {
      ...document,
      rows: Array.from({ length: 6 }, (_, index) => ({ position: index + 1, ...longRow })),
    } as SavedMepDocument;
    const text = renderPlanPdf(longDocument).toString("latin1");
    const count = Number(text.match(/\/Count (\d+)/)?.[1]);
    expect(count).toBeGreaterThan(1);
    expect(text).toContain("reconocer fracciones equivalentes");
  });
});
