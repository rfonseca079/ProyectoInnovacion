import { fitFortyMinutes, regenerateMediation, simplifyMaterials } from "./suggestionService";

describe("mediation actions", () => {
  it("posts the three mediation action keys", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ blocks: [] }),
    } as Response);
    await regenerateMediation("plan-1");
    await fitFortyMinutes("plan-1");
    await simplifyMaterials("plan-1");
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      "/api/plans/plan-1/actions/regenerate-mediation",
      "/api/plans/plan-1/actions/fit-40-minutes",
      "/api/plans/plan-1/actions/simplify-materials",
    ]);
    fetchMock.mockRestore();
  });
});
