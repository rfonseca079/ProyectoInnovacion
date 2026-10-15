import { expect, test } from "@playwright/test";

const planId = "11111111-1111-4111-8111-111111111111";
const modelHost = /openai|anthropic|generativelanguage|cohere|mistral|huggingface/i;

test("step 1 shows the calendar legend without calling a language model", async ({ page }) => {
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
  await page.goto(`/plans/${planId}/steps/1`);
  const legend = page.getByRole("list", { name: "Leyenda del calendario" });
  await expect(legend.getByText("Lectivo")).toBeVisible();
  await expect(legend.getByText("Feriado")).toBeVisible();
  await expect(legend.getByText("Suspendido")).toBeVisible();
  await expect(legend.getByText("Evaluación")).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "6 de marzo, Suspendido" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "13 de marzo, Evaluación" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "27 de marzo, Evaluación" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "30 de marzo, Feriado" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "31 de marzo, Feriado" })).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "1 de marzo", exact: true })).toBeVisible();
  expect(hosts.filter((host) => modelHost.test(host))).toEqual([]);
});
