export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const EMPTY_CREDENTIALS = "Ingrese su correo y su contraseña.";
export const INVALID_CREDENTIALS = "Correo o contraseña incorrectos.";
export const PLAN_FORBIDDEN = "No tiene acceso a este planeamiento.";
