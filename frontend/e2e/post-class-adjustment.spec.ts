import { expect, test } from "@playwright/test";

const planId = "33333333-3333-4333-8333-333333333333";
const updatedStrategy = "Reprogramar el cierre de la observación de células al inicio de la siguiente lección.";

test("María applies the stored adjustment and sees it on step 7", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("maria.solis@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto(`/plans/${planId}/steps/8`);
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/8$`));
  await expect(page.getByRole("heading", { name: "Ajuste lo planeado según lo ocurrido" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Notificar cambios en evaluaciones calendarizadas" })).not.toBeChecked();

  await page.getByRole("button", { name: "Aplicar ajustes al planeamiento" }).click();
  await expect(page.getByRole("heading", { name: "Semana actualizada" })).toBeVisible();
  await page.getByRole("button", { name: "Volver al formato MEP actualizado" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/7$`));
  await expect(page.getByText(updatedStrategy)).toBeVisible();
  await expect(page.getByText("Aún no hay ajustes aplicados.")).toHaveCount(0);
  await expect(page.getByText("Ajustado")).toBeVisible();
});
