import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MepDocumentView, MepStepPage } from "./MepStepPage";

const carlos: MepDocumentView = {
  regionalDirectorate: "Dirección Regional Cartago",
  schoolName: "Escuela José Figueres Ferrer",
  teacherName: "Carlos Mora",
  subjectLabel: "Español",
  gradeLabel: "2.° año",
  schoolYear: 2026,
  periodicity: "Mensual — Abril",
  competencies: "Comunicación oral y escrita; Competencias para la vida",
  observations: "El 2.° B responde cuando el cuento se lee en voz alta antes de la pregunta.",
  instruments: ["Lista de cotejo"],
  rows: [
    {
      position: 1,
      expectedLearning: "identificar la idea principal de un cuento corto",
      mediationStrategy: "Lectura en voz alta del cuento de la semana",
      indicator: "dice de qué trata el cuento en una oración",
    },
    {
      position: 2,
      expectedLearning: "reconocer al personaje principal",
      mediationStrategy: "preguntas cortas sobre quién actúa en el cuento",
      indicator: "señala al personaje principal en la lámina",
    },
  ],
};

const maria: MepDocumentView = {
  regionalDirectorate: "Dirección Regional San José",
  schoolName: "Liceo Experimental de San Pedro",
  teacherName: "María Solís",
  subjectLabel: "Ciencias",
  gradeLabel: "7.° año",
  schoolYear: 2026,
  periodicity: "Mensual — Febrero",
  competencies: "Pensamiento científico; Competencias para la vida",
  observations: "El 7.° C responde mejor cuando la observación precede al esquema.",
  instruments: ["Informe de observación"],
  rows: [
    {
      position: 1,
      expectedLearning: "reconocer las partes de la célula que se observan",
      mediationStrategy: "Observación guiada de la célula",
      indicator: "rotula en el dibujo las partes observadas",
    },
    {
      position: 2,
      expectedLearning: "comparar la célula animal y la vegetal",
      mediationStrategy: "contraste en parejas a partir de las láminas",
      indicator: "nombra una diferencia visible entre las dos células",
    },
  ],
};

const unusedPdf = () => Promise.resolve({ blob: new Blob(), filename: "planeamiento.pdf" });

describe("MepStepPage", () => {
  it("shows a three-column document, the ready state, and Carlos's and María's signature sentences", () => {
    const { unmount } = render(
      <MepStepPage document={carlos} status="READY_FOR_DELIVERY" onSave={() => undefined} requestPdf={unusedPdf} />,
    );
    expect(screen.getByRole("columnheader", { name: "Aprendizajes esperados" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Estrategias de mediación" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Indicadores" })).toBeInTheDocument();
    expect(screen.getByText("Listo para entrega a dirección")).toBeInTheDocument();
    expect(screen.getByText("Lectura en voz alta del cuento de la semana")).toBeInTheDocument();
    unmount();
    render(
      <MepStepPage document={maria} status="READY_FOR_DELIVERY" onSave={() => undefined} requestPdf={unusedPdf} />,
    );
    expect(screen.getByText("Observación guiada de la célula")).toBeInTheDocument();
  });

  it("saves Curso lectivo as a number", () => {
    const onSave = vi.fn();
    render(
      <MepStepPage document={carlos} status="READY_FOR_DELIVERY" onSave={onSave} requestPdf={unusedPdf} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Editar campos" }));
    const year = screen.getByRole("textbox", { name: "Curso lectivo" });
    fireEvent.change(year, { target: { value: "2027" } });
    fireEvent.blur(year);
    expect(onSave).toHaveBeenCalledWith({ schoolYear: 2027 });
  });

  it("keeps the document on screen and does not download when a required field is empty", () => {
    const requestPdf = vi.fn();
    render(
      <MepStepPage
        document={{ ...carlos, schoolName: "" }}
        status="READY_FOR_DELIVERY"
        onSave={() => undefined}
        requestPdf={requestPdf}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
    expect(requestPdf).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Complete el campo Centro educativo.");
    expect(screen.getByRole("columnheader", { name: "Aprendizajes esperados" })).toBeInTheDocument();
    expect(screen.getByText("Lectura en voz alta del cuento de la semana")).toBeInTheDocument();
  });

  it("previews and downloads the same PDF response", async () => {
    const blob = new Blob(["observacion nueva"], { type: "application/pdf" });
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:preview") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const requestPdf = vi.fn().mockResolvedValue({
      blob,
      filename: "planeamiento-matematica-4-marzo-2026.pdf",
    });
    render(
      <MepStepPage
        document={carlos}
        status="READY_FOR_DELIVERY"
        onSave={() => undefined}
        requestPdf={requestPdf}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Vista previa PDF" }));
    const preview = await screen.findByTitle("Vista previa del planeamiento");
    expect(requestPdf).toHaveBeenCalledTimes(1);
    expect(preview).toHaveAttribute("src", expect.stringMatching(/^blob:/));
    fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
    expect(requestPdf).toHaveBeenCalledTimes(2);
  });

  it("shows the message when the PDF request fails", async () => {
    const requestPdf = vi.fn().mockRejectedValue(new Error("Complete el campo Centro educativo."));
    render(
      <MepStepPage document={carlos} status="READY_FOR_DELIVERY" onSave={() => undefined} requestPdf={requestPdf} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Complete el campo Centro educativo.");
  });
});
