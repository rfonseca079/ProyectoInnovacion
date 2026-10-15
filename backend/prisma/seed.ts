import { PrismaClient } from "@prisma/client";
import { seedTeachers } from "./seedData";

const prisma = new PrismaClient();

seedTeachers(prisma, process.env.NODE_ENV)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  });
