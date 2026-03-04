const fs = require("fs-extra");
const path = require("node:path");

async function assertTargetDoesNotExist(projectDir) {
  const exists = await fs.pathExists(projectDir);
  if (exists) {
    throw new Error(`Target directory already exists: ${projectDir}`);
  }
}

async function copyTemplate(templateDir, projectDir) {
  await fs.copy(templateDir, projectDir);
}

async function readJson(filePath) {
  return fs.readJson(filePath);
}

async function writeJson(filePath, data) {
  await fs.writeJson(filePath, data, { spaces: 2 });
}

async function appendLineIfMissing(filePath, line) {
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    await fs.outputFile(filePath, `${line}\n`);
    return;
  }

  const content = await fs.readFile(filePath, "utf8");
  if (!content.includes(line)) {
    await fs.writeFile(filePath, `${content.trimEnd()}\n${line}\n`);
  }
}

function resolveProjectDir(projectName) {
  return path.join(process.cwd(), projectName);
}

module.exports = {
  assertTargetDoesNotExist,
  copyTemplate,
  readJson,
  writeJson,
  appendLineIfMissing,
  resolveProjectDir,
};
