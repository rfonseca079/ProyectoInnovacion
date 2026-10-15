import { expect, test } from "@playwright/test";

test("Carlos opens his plan on step 7", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("carlos.mora@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByRole("link", { name: /Listo para entrega/ }).click();
  await expect(page).toHaveURL(/\/plans\/.+\/steps\/7$/);
});
