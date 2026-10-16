import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../src/app";

const prisma = new PrismaClient();
const app = createApp(prisma);
const juanitaPlanId = "11111111-1111-4111-8111-111111111111";
const editedObservation = "Observación editada del 4.° A.";
const editedMediation = "Mediación editada para la primera fila.";

describe("MEP document assembly", () => {
  let originalNotes = "";
  let originalMediation = "";

  afterAll(async () => {
    if (originalNotes) {
      await prisma.planBlock.update({
        where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "teacher-notes" } },
        data: { body: originalNotes, status: "SUGGESTED" },
      });
    }
    if (originalMediation) {
      await prisma.planBlock.update({
        where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
        data: { body: originalMediation, status: "SUGGESTED" },
      });
    }
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("assembles the document from the snapshot, scenario competencies, and the edited group observation", async () => {
    const notes = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "teacher-notes" } },
    });
    originalNotes = notes.body;
    const mediation = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
    });
    originalMediation = mediation.body;
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "teacher-notes" } },
      data: { body: editedObservation, status: "EDITED" },
    });
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
      data: { body: editedMediation, status: "EDITED" },
    });

    const response = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", await juanitaCookie());

    expect(response.status).toBe(200);
    expect(response.body.regionalDirectorate).toBe("Dirección Regional San José");
    expect(response.body.schoolName).toBe("Escuela República de Arabia Saudita");
    expect(response.body.teacherName).toBe("Juanita Pérez");
    expect(response.body.subjectLabel).toBe("Matemática");
    expect(response.body.gradeLabel).toBe("4.° año");
    expect(response.body.schoolYear).toBe(2026);
    expect(response.body.periodicity).toBe("Mensual — Marzo");
    expect(response.body.competencies).toContain("Ciudadanía responsable y solidaria");
    expect(response.body.competencies).toContain("Competencias para la vida");
    expect(response.body.observations).toBe(editedObservation);
    expect(response.body.rows).toHaveLength(2);
    expect(response.body.rows[0].mediationStrategy).toBe(editedMediation);
    expect(response.body.rows[1].expectedLearning).toBe("resolver un problema sencillo de parte-todo");
    expect(response.body.rows[1].indicator).toBe("explica con sus palabras por qué dos fracciones equivalen");
    expect(
      response.body.rows.every(
        (row: { expectedLearning: string; mediationStrategy: string; indicator: string }) =>
          row.expectedLearning.trim() && row.mediationStrategy.trim() && row.indicator.trim(),
      ),
    ).toBe(true);
    expect(response.body.instruments.length).toBeGreaterThan(0);
  });
});

describe("edited mediation stays readable", () => {
  let originalMediation = "";

  afterAll(async () => {
    if (originalMediation) {
      await prisma.planBlock.update({
        where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
        data: { body: originalMediation, status: "SUGGESTED" },
      });
    }
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("lists the activity names and does not store the raw JSON", async () => {
    const mediation = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
    });
    originalMediation = mediation.body;
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "mediation-in-class" } },
      data: {
        status: "EDITED",
        body: JSON.stringify([
          { activity: "Activación con fichas", teacherRole: "modela", studentRole: "representan", minutes: 10, materials: "fichas" },
          { activity: "Cierre verbal", teacherRole: "pregunta", studentRole: "responden", minutes: 5, materials: "pizarra" },
        ]),
      },
    });

    const response = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", await juanitaCookie());

    expect(response.status).toBe(200);
    expect(response.body.rows[0].mediationStrategy).toBe("Activación con fichas; Cierre verbal");
    expect(response.body.rows[0].mediationStrategy).not.toContain("{");
  });
});

describe("edited session and evidence fill the first row", () => {
  let sessionId = "";
  let originalLearning = "";
  let originalEvidence = "";

  afterAll(async () => {
    if (sessionId) {
      await prisma.classSession.update({
        where: { id: sessionId },
        data: { expectedLearning: originalLearning, status: "SUGGESTED" },
      });
    }
    if (originalEvidence) {
      await prisma.planBlock.update({
        where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "evidence-formative-1" } },
        data: { body: originalEvidence, status: "SUGGESTED" },
      });
    }
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("uses the edited learning and the evidence card, and leaves the second row on the template", async () => {
    const session = await prisma.classSession.findFirstOrThrow({
      where: { planId: juanitaPlanId, weekPosition: 2, position: 1 },
    });
    sessionId = session.id;
    originalLearning = session.expectedLearning;
    await prisma.classSession.update({
      where: { id: session.id },
      data: { expectedLearning: "aprendizaje editado en la sesión", status: "EDITED" },
    });
    const evidence = await prisma.planBlock.findUniqueOrThrow({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "evidence-formative-1" } },
    });
    originalEvidence = evidence.body;
    const card = JSON.parse(evidence.body) as { expectedLearning: string };
    card.expectedLearning = "indicador editado en la evidencia";
    await prisma.planBlock.update({
      where: { planId_blockKey: { planId: juanitaPlanId, blockKey: "evidence-formative-1" } },
      data: { body: JSON.stringify(card), status: "EDITED" },
    });

    const response = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", await juanitaCookie());

    expect(response.status).toBe(200);
    expect(response.body.rows[0].expectedLearning).toBe("aprendizaje editado en la sesión");
    expect(response.body.rows[0].indicator).toBe("indicador editado en la evidencia");
    expect(response.body.rows[1].expectedLearning).toBe("resolver un problema sencillo de parte-todo");
    expect(response.body.rows[1].indicator).toBe("explica con sus palabras por qué dos fracciones equivalen");
  });
});

describe("edit MEP fields", () => {
  afterAll(async () => {
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
  });

  it("persists an Editar campos patch and keeps the document when a required field is cleared", async () => {
    const cookie = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    const patched = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/document`)
      .set("Cookie", cookie)
      .send({ observations: "Nota corregida en el documento.", schoolName: "Escuela República de Arabia Saudita" });
    expect(patched.status).toBe(200);
    expect(patched.body.observations).toBe("Nota corregida en el documento.");
    const cleared = await request(app)
      .patch(`/api/plans/${juanitaPlanId}/document`)
      .set("Cookie", cookie)
      .send({ schoolName: "" });
    expect(cleared.status).toBe(200);
    const stored = await prisma.mepDocument.findUnique({ where: { planId: juanitaPlanId } });
    expect(stored).not.toBeNull();
    expect(stored?.schoolName).toBe("");
    const again = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(again.body.schoolName).toBe("");
    expect(again.body.observations).toBe("Nota corregida en el documento.");
  });
});

describe("continue from the MEP document", () => {
  afterAll(async () => {
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 4, highestVisitedStep: 4, status: "DRAFT" },
    });
    await prisma.mepDocument.deleteMany({ where: { planId: juanitaPlanId } });
    await prisma.$disconnect();
  });

  it("opens step 8 without applying an adjustment", async () => {
    const cookie = await juanitaCookie();
    const built = await request(app).get(`/api/plans/${juanitaPlanId}/document`).set("Cookie", cookie);
    expect(built.status).toBe(200);
    await prisma.plan.update({
      where: { id: juanitaPlanId },
      data: { currentStep: 7, highestVisitedStep: 7, status: "READY_FOR_DELIVERY" },
    });
    const continued = await request(app)
      .post(`/api/plans/${juanitaPlanId}/steps/7/continue`)
      .set("Cookie", cookie);
    expect(continued.status).toBe(200);
    expect(continued.body.currentStep).toBe(8);
    expect(continued.body.adjustmentApplied).toBe(false);
  });
});

async function juanitaCookie(): Promise<string[]> {
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "juanita.perez@demo.mep.cr", password: "Demo2026" });
  return login.headers["set-cookie"] as unknown as string[];
}
