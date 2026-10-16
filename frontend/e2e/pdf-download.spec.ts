import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const planId = "11111111-1111-4111-8111-111111111111";
const editedObservation = "Observación nueva para la entrega.";

test("an edited observation is downloaded as the institutional PDF", async ({ page }) => {
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
  await page.getByRole("button", { name: "Editar campos" }).click();
  const observations = page.getByRole("textbox", { name: "Observaciones" });
  await observations.fill(editedObservation);
  await observations.blur();
  await expect(page.getByText("Borrador guardado automáticamente")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar PDF" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("planeamiento-matematica-4-marzo-2026.pdf");
  const filePath = await download.path();
  const bytes = readFileSync(filePath ?? "");
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect(bytes.toString("latin1")).toContain(editedObservation);
});
