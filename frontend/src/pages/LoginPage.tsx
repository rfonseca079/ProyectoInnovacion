import { FormEvent, useState } from "react";
import { login } from "../services/authService";

type LoginPageProps = {
  onSuccess: () => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      onSuccess();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
    }
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="wordmark">Planificador AI</h1>
        <p className="lede">Ingrese con su cuenta de docente.</p>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <label className="field" htmlFor="email">
          Correo
          <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        </label>
        <label className="field" htmlFor="password">
          Contraseña
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button className="primary" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
