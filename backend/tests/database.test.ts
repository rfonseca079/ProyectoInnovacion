import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("test database", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("loads the seeded teachers", async () => {
    expect(process.env.DATABASE_URL).toContain("test");
    const emails = (await prisma.teacher.findMany({ orderBy: { email: "asc" } })).map((teacher) => teacher.email);
    expect(emails).toEqual([
      "carlos.mora@demo.mep.cr",
      "juanita.perez@demo.mep.cr",
      "maria.solis@demo.mep.cr",
    ]);
  });
});
