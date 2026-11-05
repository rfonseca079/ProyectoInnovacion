import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";
const modelHost = /openai|anthropic|generativelanguage|cohere|mistral|huggingface/i;

test("Juanita lands on step 4 and sees the in-class columns", async ({ page }) => {
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
  await page.locator(`a[href="/plans/${planId}/steps/4"]`).click();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/4$`));
  await expect(page.getByRole("heading", { name: "Qué haremos para aprender" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Actividad" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Hace la persona docente" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Hace el estudiantado" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Tiempo" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Materiales" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  expect(hosts.filter((host) => modelHost.test(host))).toEqual([]);
});
