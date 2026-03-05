const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
const fs = require("fs-extra");
const {
  assertTargetDoesNotExist,
  appendLineIfMissing,
  getTemplateDisplayName,
} = require("../../src/scaffold/utils/fileManager");

test("assertTargetDoesNotExist throws when path already exists", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "compose-cli-fm-"));
  await assert.rejects(() => assertTargetDoesNotExist(tempDir), /Target directory already exists/);
});

test("appendLineIfMissing creates file and avoids duplicate lines", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "compose-cli-fm-"));
  const filePath = path.join(tempDir, ".gitignore");

  await appendLineIfMissing(filePath, "node_modules");
  await appendLineIfMissing(filePath, "node_modules");
  await appendLineIfMissing(filePath, "dist");

  const content = await fs.readFile(filePath, "utf8");
  assert.equal(content, "node_modules\ndist\n");
});

test("getTemplateDisplayName returns relative template path when inside templates root", () => {
  const templatePath = path.join(process.cwd(), "src", "templates", "default", "foundry");
  assert.equal(getTemplateDisplayName(templatePath), "default/foundry");
});

test("getTemplateDisplayName falls back to basename for external paths", () => {
  const templatePath = path.join(os.tmpdir(), "custom-template");
  assert.equal(getTemplateDisplayName(templatePath), "custom-template");
});
