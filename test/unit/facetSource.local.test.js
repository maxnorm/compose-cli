const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("fs-extra");
const os = require("node:os");
const { applyLocalFacetSource } = require("../../src/scaffold/facetSource/local");

test("local facet source injects compose package in hardhat project", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "compose-cli-local-"));
  const packagePath = path.join(tempDir, "package.json");

  await fs.writeJson(
    packagePath,
    {
      name: "demo",
      version: "0.0.0",
      dependencies: {},
    },
    { spaces: 2 }
  );

  await applyLocalFacetSource(tempDir, {
    framework: "hardhat",
    installDeps: false,
  });

  const packageJson = await fs.readJson(packagePath);
  assert.equal(packageJson.dependencies["@perfect-abstractions/compose"], "latest");
});
