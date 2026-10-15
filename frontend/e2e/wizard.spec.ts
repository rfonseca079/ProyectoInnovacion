import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";

test("visited steps open and an unvisited step stays closed", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.locator(`a[href="/plans/${planId}/steps/4"]`).click();
  await expect(page.getByText("Paso 4 de 8")).toBeVisible();

  await page.getByRole("link", { name: "Atrás" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/3$`));

  await page.getByRole("link", { name: "2 Unidades y evaluación" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/2$`));

  await page.getByRole("link", { name: "4 Mediación" }).click();
  await page.getByText("5 Evidencias de aprendizaje").click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/4$`));

  await page.goto(`/plans/${planId}/steps/5`);
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/4$`));

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Complete los campos de este paso antes de continuar.")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/4$`));
});
