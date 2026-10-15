import { expect, test } from "@playwright/test";

test("an edited section stays after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.locator('a[href="/plans/11111111-1111-4111-8111-111111111111/steps/4"]').click();
  const field = page.getByLabel("Sección o grupo");
  await field.fill("4.° B");
  await field.blur();
  await expect(page.getByText("Borrador guardado automáticamente")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Sección o grupo")).toHaveValue("4.° B");
});
