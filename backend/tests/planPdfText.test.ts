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
  it("writes the periodicity em dash as a hyphen", () => {
    const text = renderPlanPdf(document).toString("latin1");
    expect(text).toContain("Mensual - Marzo");
    expect(text).not.toContain("\u0014");
  });
});
