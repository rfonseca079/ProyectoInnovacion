import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";
const modelHost = /openai|anthropic|generativelanguage|cohere|mistral|huggingface/i;
const observations = "El grupo responde bien a material concreto y juegos cortos de 8 a 10 minutos.";

test("clearing observations keeps Continuar on step 3", async ({ page }) => {
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
  await page.goto(`/plans/${planId}/steps/3`);
  await expect(page.getByRole("heading", { name: "Conozca a su grupo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /adecuacion/i })).toHaveCount(0);
  await page.getByLabel("Observaciones de la docente").fill(" ");
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
  await expect(page.getByText("Complete el campo Observaciones de la docente.")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/plans/${planId}/steps/3$`));
  await page.getByLabel("Observaciones de la docente").fill(observations);
  await expect(page.getByRole("button", { name: "Continuar" })).toBeEnabled();
  expect(hosts.filter((host) => modelHost.test(host))).toEqual([]);
});
