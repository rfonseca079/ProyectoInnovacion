import { PrismaClient } from "@prisma/client";

export async function logoutTeacher(prisma: PrismaClient, sessionId: string | undefined): Promise<void> {
  if (!sessionId) {
    return;
  }
  await prisma.session.deleteMany({ where: { id: sessionId } });
}
