import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { AppError, EMPTY_CREDENTIALS, INVALID_CREDENTIALS } from "../domain/errors";
import { TeacherProfile, toTeacherProfile } from "../domain/teacher";

export const UNKNOWN_EMAIL_PASSWORD_HASH = bcrypt.hashSync("planificador-unknown-email", 10);

export async function passwordMatchesAccount(
  password: string,
  passwordHash: string | undefined,
  compare: (plain: string, hash: string) => Promise<boolean> = bcrypt.compare,
): Promise<boolean> {
  const matches = await compare(password, passwordHash ?? UNKNOWN_EMAIL_PASSWORD_HASH);
  return passwordHash !== undefined && matches;
}

export async function loginTeacher(
  prisma: PrismaClient,
  email: unknown,
  password: unknown,
): Promise<{ profile: TeacherProfile; sessionId: string }> {
  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  const normalizedPassword = typeof password === "string" ? password : "";
  if (!normalizedEmail || !normalizedPassword.trim()) {
    throw new AppError(400, "VALIDATION", EMPTY_CREDENTIALS);
  }

  const teacher = await prisma.teacher.findUnique({
    where: { email: normalizedEmail.toLowerCase() },
  });
  const matches = await passwordMatchesAccount(normalizedPassword, teacher?.passwordHash);
  if (!teacher || !matches) {
    throw new AppError(401, "INVALID_CREDENTIALS", INVALID_CREDENTIALS);
  }

  const session = await prisma.session.create({ data: { teacherId: teacher.id } });
  return { profile: toTeacherProfile(teacher), sessionId: session.id };
}

export async function currentTeacher(
  prisma: PrismaClient,
  sessionId: string | undefined,
): Promise<TeacherProfile> {
  if (!sessionId) {
    throw new AppError(401, "UNAUTHENTICATED", "Inicie sesión para continuar.");
  }
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { teacher: true },
  });
  if (!session) {
    throw new AppError(401, "UNAUTHENTICATED", "Inicie sesión para continuar.");
  }
  return toTeacherProfile(session.teacher);
}
