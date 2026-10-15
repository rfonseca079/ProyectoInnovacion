import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);

describe("logout", () => {
  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  it("ends the session and keeps the saved plan", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const teacher = await prisma.teacher.findUniqueOrThrow({
      where: { email: "juanita.perez@demo.mep.cr" },
    });
    const plan = await prisma.plan.create({
      data: {
        teacherId: teacher.id,
        cycle: "I_II",
        gradeLevel: 4,
        subject: "MATH",
        modality: "IN_PERSON",
        schoolYear: 2026,
        month: 3,
        schoolName: "Escuela República de Arabia Saudita",
        regionalDirectorate: "Dirección Regional San José",
        teacherName: "Juanita Pérez",
        section: "4.° A",
        studentCount: 28,
        weeklyLessons: 5,
        status: "DRAFT",
        currentStep: 4,
        highestVisitedStep: 4,
      },
    });

    const logout = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", login.headers["set-cookie"]);
    expect(logout.status).toBe(204);
    expect(logout.text).toBe("");

    const me = await request(app).get("/api/auth/me").set("Cookie", login.headers["set-cookie"]);
    expect(me.status).toBe(401);

    const stored = await prisma.plan.findUnique({ where: { id: plan.id } });
    expect(stored?.schoolName).toBe("Escuela República de Arabia Saudita");

    const again = await request(app)
      .post("/api/auth/login")
      .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
    const listed = await request(app).get("/api/plans").set("Cookie", again.headers["set-cookie"]);
    expect(listed.status).toBe(200);
    expect(listed.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: plan.id })]));

    await prisma.plan.delete({ where: { id: plan.id } });
  });
});
