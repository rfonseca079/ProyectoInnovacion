import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const previousObservation = "Frase anterior del documento.";
const editedObservation = "Observación nueva para la entrega.";

describe("institutional PDF", () => {
  afterAll(async () => {
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("contains the edited observation and not the previous sentence", async () => {
    const cookie = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    const first = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/document`)
      .set("Cookie", cookie)
      .send({ observations: previousObservation });
    expect(first.status).toBe(200);
    const second = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/document`)
      .set("Cookie", cookie)
      .send({ observations: editedObservation });
    expect(second.status).toBe(200);

    const file = await request(app).get(`/api/plans/${juanitaPlanId}/document/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    const text = Buffer.from(file.body).toString("latin1");
    expect(text).toContain(editedObservation);
    expect(text).not.toContain(previousObservation);
  });
});

describe("missing field and ownership", () => {
  afterAll(async () => {
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("returns 422 and no file when a required field is empty", async () => {
    const cookie = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    const cleared = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/document`)
      .set("Cookie", cookie)
      .send({ schoolName: "" });
    expect(cleared.status).toBe(200);

    const file = await request(app).get(`/api/plans/${juanitaPlanId}/document/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(422);
    expect(String(file.headers["content-type"] ?? "")).toMatch(/application\/json/);
    expect(file.body).toEqual(expect.objectContaining({ message: "Complete el campo Centro educativo." }));
  });

  it("returns 404 and no file for another teacher", async () => {
    const owner = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", owner);
    expect(built.status).toBe(200);
    const carlos = await loginCookie("carlos.mora@demo.mep.cr");
    const file = await request(app).get(`/api/plans/${juanitaPlanId}/document/pdf`).set("Cookie", carlos);
    expect(file.status).toBe(404);
    expect(String(file.headers["content-type"] ?? "")).toMatch(/application\/json/);
    expect(file.body).toEqual(expect.objectContaining({ code: "NOT_FOUND" }));
  });
});

describe("institutional filename", () => {
  afterAll(async () => {
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("names Juanita's file planeamiento-matematica-4-marzo-2026.pdf", async () => {
    const cookie = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    const file = await request(app).get(`/api/plans/${juanitaPlanId}/document/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    expect(file.headers["content-disposition"]).toBe('attachment; filename="planeamiento-matematica-4-marzo-2026.pdf"');
  });
});

describe("scenario signature sentences", () => {
  const plans = [
    {
      id: "22222222-2222-4222-8222-222222222222",
      email: "carlos.mora@demo.mep.cr",
      sentence: "Lectura en voz alta del cuento de la semana",
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      email: "maria.solis@demo.mep.cr",
      sentence: "Observación guiada de la célula",
    },
  ];

  afterAll(async () => {
    await prisma.mepDocument.deleteMany({ where: { planId: { in: plans.map((plan) => plan.id) } } });
  });

  it.each(plans)("includes $sentence", async ({ id, email, sentence }) => {
    const cookie = await loginCookie(email);
    const built = await request(app).get(`/api/plans/${id}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    const file = await request(app).get(`/api/plans/${id}/document/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    expect(Buffer.from(file.body).toString("latin1")).toContain(sentence);
  });
});

describe("week PDF", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("renders the five saved sessions and omits the institutional header", async () => {
    const sessions = await prisma.classSession.findMany({
      where: { planId: juanitaPlanId, weekPosition: 2 },
      orderBy: { position: "asc" },
    });
    expect(sessions).toHaveLength(5);
    const cookie = await juanitaCookie();
    const file = await request(app).get(`/api/plans/${juanitaPlanId}/weeks/2/pdf`).set("Cookie", cookie);
    expect(file.status).toBe(200);
    const text = Buffer.from(file.body).toString("latin1");
    for (const session of sessions) {
      expect(text).toContain(session.expectedLearning);
    }
    expect(text).not.toContain("Dirección Regional de Educación");
  });
});

async function juanitaCookie(): Promise<string[]> {
  return loginCookie("juanita.perez@demo.mep.cr");
}

async function loginCookie(email: string): Promise<string[]> {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}
