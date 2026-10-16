import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";

test("Regenerar shows the next stored sentence", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto(`/plans/${planId}/steps/1`);
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/1$`));

  const card = page.locator("article").filter({ has: page.getByRole("heading", { name: "Objetivos priorizados del mes" }) });
  const field = card.getByRole("textbox", { name: "Objetivos priorizados del mes" });
  await expect(field).toHaveValue(/parte-todo/);
  await card.getByRole("button", { name: "Regenerar" }).click();
  await expect(field).toHaveValue("Priorizar la ubicación de fracciones en la recta antes de compararlas.");
});
