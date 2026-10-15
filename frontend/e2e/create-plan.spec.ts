import { expect, test } from "@playwright/test";

test("Juanita starts a plan and sees the fractions extract", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByRole("link", { name: "Nuevo planeamiento" }).click();
  await page.getByLabel("Ciclo").selectOption("I y II Ciclos");
  await page.getByLabel("Nivel").selectOption("4.° año");
  await page.getByLabel("Asignatura").selectOption("Matemática");
  await page.getByLabel("Modalidad").selectOption("Presencial");
  await page.getByLabel("Curso lectivo").fill("2026");
  await page.getByLabel("Mes").selectOption("Marzo");
  await page.getByLabel("Sección o grupo").fill("4.° A");
  await page.getByLabel("Cantidad de estudiantes").fill("28");
  await page.getByLabel("Lecciones semanales").fill("5");
  await page.getByRole("button", { name: "Iniciar planeamiento con IA" }).click();
  await expect(page.getByText(/representar fracciones propias/)).toBeVisible();
});
