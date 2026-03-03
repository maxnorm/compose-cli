const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTemplateConfig, pickVariant } = require("../../src/scaffold/templateLoader");

test("pickVariant returns foundry variant", async () => {
  const config = await loadTemplateConfig();
  const variant = pickVariant(config, {
    template: "default",
    framework: "foundry",
  });

  assert.equal(variant.id, "default-foundry");
});

test("pickVariant returns hardhat ts variant", async () => {
  const config = await loadTemplateConfig();
  const variant = pickVariant(config, {
    template: "default",
    framework: "hardhat",
    language: "typescript",
  });

  assert.equal(variant.id, "default-hardhat-ts");
});
