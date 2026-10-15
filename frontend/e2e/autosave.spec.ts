import { expect, test } from "@playwright/test";

test("an edited section stays after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.goto("/plans/11111111-1111-4111-8111-111111111111/steps/0");
  const field = page.getByLabel("Sección o grupo");
  const current = await field.inputValue();
  const next = current === "4.° B" ? "4.° C" : "4.° B";
  await field.fill(next);
  await field.blur();
  await expect(page.getByText("Borrador guardado automáticamente")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto("/plans/11111111-1111-4111-8111-111111111111/steps/0");
  await expect(page.getByLabel("Sección o grupo")).toHaveValue(next);
});
