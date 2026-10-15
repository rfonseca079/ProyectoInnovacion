import { expect, test } from "@playwright/test";

test("logout stays on the login screen after Back and refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto("/plans/11111111-1111-4111-8111-111111111111/steps/4");
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});
