const path = require("node:path");
const { runCommand } = require("../../utils/exec");
const { logger } = require("../../utils/logger");
const { COMPOSE_NPM_PACKAGE, COMPOSE_PREP_RELEASE_URL } = require("../../config/constants");
const { readJson, writeJson, appendLineIfMissing } = require("../fileManager");

async function applyFoundryLocal(projectDir) {
  await appendLineIfMissing(path.join(projectDir, "remappings.txt"), "@perfect-abstractions/compose/=lib/Compose/src/");
  await runCommand("forge", ["install", "foundry-rs/forge-std"], { cwd: projectDir });
  await runCommand("forge", ["install", "Perfect-Abstractions/Compose"], { cwd: projectDir });
}

async function installHardhatDeps(projectDir) {
  await runCommand("npm", ["install"], { cwd: projectDir });
}

async function applyHardhatLocal(projectDir, options) {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await readJson(packageJsonPath);
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies[COMPOSE_NPM_PACKAGE] = "latest";
  await writeJson(packageJsonPath, packageJson);

  if (!options.installDeps) {
    logger.warn(`Skipped dependency installation. Run npm install later for ${COMPOSE_NPM_PACKAGE}.`);
    return;
  }

  try {
    await installHardhatDeps(projectDir);
  } catch (error) {
    logger.warn(
      [
        `Hardhat dependency installation failed for ${COMPOSE_NPM_PACKAGE}.`,
        `This is expected until package publication. Track progress: ${COMPOSE_PREP_RELEASE_URL}`,
      ].join("\n")
    );
    logger.warn(`Original error: ${error.message}`);
  }
}

async function applyLocalFacetSource(projectDir, options) {
  if (options.framework === "foundry") {
    await applyFoundryLocal(projectDir);
    return;
  }

  if (options.framework === "hardhat") {
    await applyHardhatLocal(projectDir, options);
    return;
  }

  throw new Error(`Unsupported framework for local facet source: ${options.framework}`);
}

module.exports = {
  applyLocalFacetSource,
};
