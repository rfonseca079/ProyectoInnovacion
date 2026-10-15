import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { seedTeachers } from "../prisma/seedData";

export default async function globalSetup(): Promise<void> {
  process.env.DATABASE_URL =
    "postgresql://planificador:planificador@localhost:5432/planificador_test";
  process.env.NODE_ENV = "test";
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: __dirname + "/..",
    stdio: "inherit",
    env: process.env,
  });
  const prisma = new PrismaClient();
  await seedTeachers(prisma, "test");
  await prisma.$disconnect();
}
