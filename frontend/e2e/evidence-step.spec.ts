import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";

test("a holiday warning still lets Continuar open step 6", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.locator(`a[href="/plans/${planId}/steps/4"]`).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/4$`));
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/5$`));
  await expect(page.getByRole("heading", { name: "Evidencias de aprendizaje" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quiz 1" })).toBeVisible();
  await page.getByLabel("Fecha de Quiz 1").fill("2026-03-30");
  await expect(page.getByText("Esta fecha está marcada como no lectiva en el calendario.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeEnabled();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/6$`));
});
