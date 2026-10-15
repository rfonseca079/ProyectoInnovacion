import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";

describe("autosave", () => {
  afterAll(async () => {
    await prisma.rubricItem.deleteMany({ where: { planId: juanitaPlanId } });
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { section: "A", notifyEvaluationChanges: false },
    });
    await prisma.session.deleteMany();
    await prisma.$disconnect();
  });

  async function cookie(email: string) {
    const login = await request(app).post("/api/auth/login").send({ email, password: "Demo2026" });
    return login.headers["set-cookie"];
  }

  it("updates the owner's plan and hides it from another teacher", async () => {
    const before = await prisma.plan.findUniqueOrThrow({ where: { id: juanitaPlanId } });
    const juanita = await cookie("juanita.perez@demo.mep.cr");
    const patched = await request(app)
      .patch(`/api/plans/${juanitaPlanId}`)
      .set("Cookie", juanita)
      .send({ section: "4.° B", notifyEvaluationChanges: true, rubric: [{ name: "Tareas", percentage: 100 }] });
    expect(patched.status).toBe(200);
    expect(patched.body.section).toBe("4.° B");
    expect(new Date(patched.body.updatedAt).getTime()).toBeGreaterThan(before.updatedAt.getTime());

    const again = await request(app).get(`/api/plans/${juanitaPlanId}`).set("Cookie", juanita);
    expect(again.body.section).toBe("4.° B");

    const carlos = await cookie("carlos.mora@demo.mep.cr");
    const hidden = await request(app).patch(`/api/plans/${juanitaPlanId}`).set("Cookie", carlos).send({ section: "ajeno" });
    expect(hidden.status).toBe(404);
  });
});
