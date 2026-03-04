const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
const fs = require("fs-extra");
const { loadTemplateConfig, pickVariant, resolveTemplatePath } = require("../../src/scaffold/templateLoader");
const { scaffoldProject } = require("../../src/scaffold/scaffoldProject");

async function scaffoldWithVariant(variant, options = {}) {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "compose-cli-it-"));
  const originalCwd = process.cwd();
  process.chdir(tempRoot);
  try {
    const projectName = options.projectName || "demo-project";
    const outputPath = await scaffoldProject({
      projectName,
      templatePath: resolveTemplatePath(variant),
      options: {
        framework: variant.framework,
        language: variant.language,
        installDeps: false,
      },
    });
    return { tempRoot, outputPath };
  } finally {
    process.chdir(originalCwd);
  }
}

test("scaffolds foundry variant", async () => {
  const config = await loadTemplateConfig();
  const variant = pickVariant(config, {
    template: "default",
    framework: "foundry",
  });

  const { outputPath } = await scaffoldWithVariant(variant, { projectName: "foundry-app" });

  assert.equal(await fs.pathExists(path.join(outputPath, "foundry.toml")), true);
  assert.equal(await fs.pathExists(path.join(outputPath, "src", "CounterFacet.sol")), true);
});

test("scaffolds hardhat js variant", async () => {
  const config = await loadTemplateConfig();
  const variant = pickVariant(config, {
    template: "default",
    framework: "hardhat",
    language: "javascript",
  });

  const { outputPath } = await scaffoldWithVariant(variant, { projectName: "hardhat-js-app" });

  assert.equal(await fs.pathExists(path.join(outputPath, "hardhat.config.js")), true);
  assert.equal(await fs.pathExists(path.join(outputPath, "contracts", "CounterFacet.sol")), true);
});

test("scaffolds hardhat ts variant", async () => {
  const config = await loadTemplateConfig();
  const variant = pickVariant(config, {
    template: "default",
    framework: "hardhat",
    language: "typescript",
  });

  const { outputPath } = await scaffoldWithVariant(variant, { projectName: "hardhat-ts-app" });

  assert.equal(await fs.pathExists(path.join(outputPath, "hardhat.config.ts")), true);
  assert.equal(await fs.pathExists(path.join(outputPath, "tsconfig.json")), true);
});
