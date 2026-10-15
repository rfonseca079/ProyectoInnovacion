import { NextFunction, Request, Response } from "express";
import { AppError } from "../domain/errors";

export const SESSION_COOKIE = "planificador_session";

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
}

export function readSessionId(req: Request): string | undefined {
  const value = req.cookies?.[SESSION_COOKIE];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.status).json({ code: error.code, message: error.message });
    return;
  }
  console.error(error instanceof Error ? error.message : "Unexpected error");
  res.status(500).json({ code: "INTERNAL", message: "No se pudo completar la solicitud." });
}
