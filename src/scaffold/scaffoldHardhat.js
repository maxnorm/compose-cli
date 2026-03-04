const fs = require("fs-extra");
const path = require("node:path");
const { copyTemplate, readJson, writeJson } = require("./utils/fileManager");
const { runCommand } = require("../utils/exec");
const { logger } = require("../utils/logger");
const { COMPOSE_NPM_PACKAGE } = require("../config/constants");

async function copyTemplateExcluding(sourceDir, targetDir, templateRoot) {
  const entries = await fs.readdir(sourceDir);
  for (const entry of entries) {
    const srcPath = path.join(sourceDir, entry);
    const destPath = path.join(targetDir, entry);
    const isRootPackageJson =
      templateRoot && path.dirname(srcPath) === templateRoot && entry === "package.json";
    if (isRootPackageJson) {
      continue;
    }
    const stat = await fs.stat(srcPath);
    if (stat.isDirectory()) {
      await fs.ensureDir(destPath);
      await copyTemplateExcluding(srcPath, destPath, templateRoot);
    } else {
      await fs.copy(srcPath, destPath);
    }
  }
}

async function scaffoldHardhatProject(projectName, templatePath, projectDir, options) {
  await fs.ensureDir(projectDir);

  const shouldInstallDeps = Boolean(options.installDeps);
  const isTs = options.language === "typescript";

  if (shouldInstallDeps) {
    logger.info("Initializing npm project…");
    await runCommand("npm", ["init", "-y"], { cwd: projectDir });

    const devDeps = ["hardhat"];
    if (isTs) {
      devDeps.push("typescript", "ts-node", "@types/node");
    }
    logger.info("Installing Hardhat…");
    await runCommand("npm", ["install", "--save-dev", ...devDeps], { cwd: projectDir });

    await copyTemplateExcluding(templatePath, projectDir, templatePath);
  } else {
    logger.info("Skipping dependency installation (installDeps=false).");
    await copyTemplate(templatePath, projectDir);
  }

  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await readJson(packageJsonPath);

  packageJson.name = path.basename(projectName);
  packageJson.type = "module";

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.build = "npx hardhat compile";
  packageJson.scripts.test = "npx hardhat test";

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  if (!packageJson.devDependencies.hardhat) {
    packageJson.devDependencies.hardhat = "latest";
  }

  if (isTs) {
    if (!packageJson.devDependencies.typescript) {
      packageJson.devDependencies.typescript = "latest";
    }
    if (!packageJson.devDependencies["ts-node"]) {
      packageJson.devDependencies["ts-node"] = "latest";
    }
  }

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies[COMPOSE_NPM_PACKAGE] = "latest";

  await writeJson(packageJsonPath, packageJson);
}

module.exports = {
  scaffoldHardhatProject,
};

