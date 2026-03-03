const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeInitOptions } = require("../../src/commands/init");

test("normalizeInitOptions sets defaults", () => {
  const options = normalizeInitOptions({});

  assert.equal(options.template, "default");
  assert.equal(options.framework, "foundry");
  assert.equal(options.facetSource, "local");
  assert.equal(options.installDeps, false);
});

test("normalizeInitOptions prioritizes explicit flags", () => {
  const options = normalizeInitOptions({
    name: "demo",
    template: "default",
    framework: "hardhat",
    language: "javascript",
    "facet-source": "registry",
    "install-deps": true,
  });

  assert.equal(options.projectName, "demo");
  assert.equal(options.framework, "hardhat");
  assert.equal(options.language, "javascript");
  assert.equal(options.facetSource, "registry");
  assert.equal(options.installDeps, true);
});
