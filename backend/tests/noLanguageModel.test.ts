import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const forbiddenPackages = ["openai", "@anthropic-ai/sdk", "langchain", "@langchain/core", "@google/generative-ai"];

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return /\.(ts|tsx|js|jsx)$/.test(entry) ? [path] : [];
  });
}

describe("language-model boundary", () => {
  it("does not import a language-model SDK", () => {
    const packageFiles = [join(__dirname, "../package.json"), join(__dirname, "../../frontend/package.json")];
    const sources = [
      ...sourceFiles(join(__dirname, "../src")),
      ...sourceFiles(join(__dirname, "../../frontend/src")),
    ];
    const corpus = [...packageFiles, ...sources].map((path) => readFileSync(path, "utf8")).join("\n");
    for (const packageName of forbiddenPackages) {
      expect(corpus.includes(`"${packageName}"`) || corpus.includes(`from "${packageName}`)).toBe(false);
    }
  });
});
