import { render, screen } from "@testing-library/react";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("shows Entrar and does not offer registration or recovery", () => {
    render(<LoginPage onSuccess={() => undefined} />);
    expect(screen.getByRole("heading", { name: "Planificador AI" })).toBeInTheDocument();
    expect(screen.getByText("Correo")).toBeInTheDocument();
    expect(screen.getByText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.queryByText(/registr/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/recuper/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invitado/i)).not.toBeInTheDocument();
  });
});
