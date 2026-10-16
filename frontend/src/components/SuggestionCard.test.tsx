import { fireEvent, render, screen } from "@testing-library/react";
import { SuggestionCard } from "./SuggestionCard";

const fallbackSentence =
  "No hay un escenario específico para esta combinación. Se usa el escenario de Matemática de 4.° año, marzo 2026.";

describe("SuggestionCard", () => {
  it("has no chat panel and shows the fallback sentence", () => {
    render(
      <SuggestionCard
        title="Objetivos priorizados del mes"
        body="Priorizar parte-todo."
        fallbackNotice={fallbackSentence}
        onAccept={() => undefined}
        onEdit={() => undefined}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText(fallbackSentence)).toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: /chat/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/chat/i)).not.toBeInTheDocument();
  });

  it("shows the Spanish state and ignores an unchanged blur", () => {
    const onEdit = vi.fn();
    const { rerender } = render(
      <SuggestionCard
        title="Objetivos priorizados del mes"
        body="Priorizar parte-todo."
        status="SUGGESTED"
        onAccept={() => undefined}
        onEdit={onEdit}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText("Sugerido por IA")).toBeInTheDocument();
    fireEvent.blur(screen.getByRole("textbox", { name: "Objetivos priorizados del mes" }));
    expect(onEdit).not.toHaveBeenCalled();

    rerender(
      <SuggestionCard
        title="Objetivos priorizados del mes"
        body="Priorizar parte-todo."
        status="ACCEPTED"
        onAccept={() => undefined}
        onEdit={onEdit}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText("Aceptada")).toBeInTheDocument();

    rerender(
      <SuggestionCard
        title="Objetivos priorizados del mes"
        body="Priorizar parte-todo."
        status="EDITED"
        onAccept={() => undefined}
        onEdit={onEdit}
        onRegenerate={() => undefined}
      />,
    );
    expect(screen.getByText("Editada")).toBeInTheDocument();
  });
});
