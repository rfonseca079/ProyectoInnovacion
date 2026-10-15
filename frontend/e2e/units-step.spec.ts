import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";
const modelHost = /openai|anthropic|generativelanguage|cohere|mistral|huggingface/i;

test("adding a zero-percent row keeps the total at 100 and blocks Continuar", async ({ page }) => {
  const hosts: string[] = [];
  page.on("request", (request) => {
    hosts.push(new URL(request.url()).host);
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Correo").fill("juanita.perez@demo.mep.cr");
  await page.getByLabel("Contraseña").fill("Demo2026");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Mis planeamientos" })).toBeVisible();
  await page.goto(`/plans/${planId}/steps/2`);
  await expect(page.getByRole("heading", { name: "Organice unidades y defina la evaluación" })).toBeVisible();
  await expect(page.getByText("Distribución completa")).toBeVisible();
  await expect(page.getByText("Total: 100 %")).toBeVisible();
  await page.getByRole("button", { name: "Agregar rubro" }).click();
  await expect(page.getByText("Total: 100 %")).toBeVisible();
  await expect(page.getByText("Distribución completa")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
  await expect(page.getByText("La distribución debe sumar 100 %.")).toBeVisible();
  await page.getByRole("button", { name: "Quitar" }).last().click();
  await expect(page.getByText("Distribución completa")).toBeVisible();
  expect(hosts.filter((host) => modelHost.test(host))).toEqual([]);
});
