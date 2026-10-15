import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders Cerrar sesión only when a session exists", () => {
    const { rerender } = render(<AppHeader />);
    expect(screen.queryByRole("button", { name: "Cerrar sesión" })).not.toBeInTheDocument();
    rerender(<AppHeader teacherName="Juanita Pérez" onLogout={() => undefined} />);
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeInTheDocument();
  });
});
