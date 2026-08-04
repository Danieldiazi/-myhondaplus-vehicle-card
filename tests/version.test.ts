import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { VERSION } from "../src/constants";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

describe("card version", () => {
  it("matches package.json", () => {
    expect(VERSION).toBe(packageJson.version);
  });
});
