import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { EvidenceCard, EvidenceStepPage, isEvidenceStepReady, NON_TEACHING_DAY } from "./EvidenceStepPage";

const formative: EvidenceCard = {
  blockKey: "evidence-formative-1",
  kind: "FORMATIVE",
  position: 1,
  title: "Tres preguntas orales de chequeo",
  measures: "Si el estudiantado explica una equivalencia con sus palabras.",
  when: "Durante la construcción",
  instrument: "Preguntas orales",
  expectedLearning: "Explica una equivalencia con sus palabras.",
  occursOn: null,
};

const quiz: EvidenceCard = {
  blockKey: "evidence-scheduled-1",
  kind: "SCHEDULED",
  position: 1,
  title: "Quiz 1",
  measures: "Fracciones equivalentes.",
  when: "viernes 13 de marzo, semana 2",
  instrument: "Quiz escrito",
  expectedLearning: "Representa fracciones equivalentes.",
  occursOn: "2026-03-13",
};

describe("EvidenceStepPage", () => {
  it("renders Quiz 1 on 13 March for variant 1", () => {
    render(
      <EvidenceStepPage
        evidence={[formative, quiz]}
        calendarDays={[]}
        onSave={async () => undefined}
        onBalance={() => undefined}
        onAccept={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByRole("heading", { name: "Durante la clase" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evaluaciones calendarizadas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quiz 1" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("viernes 13 de marzo, semana 2")).toBeInTheDocument();
  });

  it("shows the non-teaching-day warning and still counts both columns as complete", () => {
    const holidayQuiz = { ...quiz, occursOn: "2026-03-30" };
    render(
      <EvidenceStepPage
        evidence={[formative, holidayQuiz]}
        calendarDays={[{ date: "2026-03-30", kind: "HOLIDAY", label: "Feriado" }]}
        onSave={async () => undefined}
        onBalance={() => undefined}
        onAccept={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText(NON_TEACHING_DAY)).toBeInTheDocument();
    expect(isEvidenceStepReady([formative, holidayQuiz])).toBe(true);
  });

  it("shows the warning for a suspended day and still treats the step as ready", () => {
    const suspendedQuiz = { ...quiz, occursOn: "2026-03-06" };
    render(
      <EvidenceStepPage
        evidence={[formative, suspendedQuiz]}
        calendarDays={[{ date: "2026-03-06", kind: "SUSPENDED", label: "Consejo de docentes" }]}
        onSave={async () => undefined}
        onBalance={() => undefined}
        onAccept={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText(NON_TEACHING_DAY)).toBeInTheDocument();
    expect(isEvidenceStepReady([formative, suspendedQuiz])).toBe(true);
  });

  it("does not warn when a scheduled card has no date even if the calendar has a holiday", () => {
    const undated = { ...quiz, occursOn: null, when: "Entrega en la semana 4" };
    render(
      <EvidenceStepPage
        evidence={[formative, undated]}
        calendarDays={[{ date: "2026-03-30", kind: "HOLIDAY", label: "Asueto" }]}
        onSave={async () => undefined}
        onBalance={() => undefined}
        onAccept={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.queryByText(NON_TEACHING_DAY)).not.toBeInTheDocument();
  });

  it("ignores a second balance click while the first request is in flight", async () => {
    let resolveBalance = (): void => undefined;
    const pending = new Promise<void>((resolve) => {
      resolveBalance = resolve;
    });
    const onBalance = vi.fn(() => pending);
    render(
      <EvidenceStepPage
        evidence={[formative, quiz]}
        calendarDays={[]}
        onSave={async () => undefined}
        onBalance={onBalance}
        onAccept={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    const button = screen.getByRole("button", { name: "Equilibrar carga evaluativa del mes" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(onBalance).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveBalance();
    });
  });
});
