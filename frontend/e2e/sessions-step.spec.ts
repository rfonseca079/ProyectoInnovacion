import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";

test("the week selector expands a collapsed session and keeps its date in that week", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto(`/plans/${planId}/steps/4`);
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/5$`));
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/6$`));
  await expect(page.getByRole("heading", { name: "Prepare la semana y cada sesión" })).toBeVisible();
  await expect(page.getByLabel("Semana")).toHaveValue("2");
  await expect(page.locator('option[value="2"]')).toHaveText("Semana 2 (9 al 13 de marzo)");
  await page.getByRole("button", { name: "Abrir Martes" }).click();
  await expect(page.getByLabel("Desarrollo de Martes")).toHaveValue("práctica breve de equivalencias");
  await expect(page.getByRole("heading", { name: /Martes 10 de marzo de 2026/ })).toBeVisible();
  await expect(page.getByText("2026-03-10")).toBeVisible();
});
