import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";

test("step 7 shows the three institutional columns at 1440px", async ({ page }) => {
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
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/7$`));
  await expect(page.getByRole("heading", { name: "Planeamiento en formato institucional" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Aprendizajes esperados" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Estrategias de mediación" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Indicadores" })).toBeVisible();
  await expect(page.getByText("Listo para entrega a dirección")).toBeVisible();
  const box = await page.locator(".mep-document").boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(600);
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(1440);
});
