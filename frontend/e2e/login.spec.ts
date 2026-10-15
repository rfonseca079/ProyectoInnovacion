import { expect, test } from "@playwright/test";

test("Juanita signs in and stays on her plan list after refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toHaveCount(0);
});

test("Carlos does not see Juanita's plan step", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("carlos.mora@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto("/plans/11111111-1111-4111-8111-111111111111/steps/4");
  await expect(page.getByRole("alert")).toHaveText("No tiene acceso a este planeamiento.");
  await expect(page.getByLabel("Sección o grupo")).toHaveCount(0);
});
