const fs = require("fs-extra");
const path = require("path");
const { copyTemplate } = require("./utils/fileManager");
const { runCommand } = require("../utils/exec");
const { logger } = require("../utils/logger");
const { COMPOSE_FOUNDRY_DEP } = require("../config/constants");

async function scaffoldFoundryProject(projectName, templatePath, projectDir, options) {
  const shouldInstallDeps = Boolean(options.installDeps);
  const templateName = path.basename(templatePath);

  if (shouldInstallDeps) {
    await fs.ensureDir(projectDir);

    logger.info("Initializing Foundry project with forge…");
    // Use quiet mode to avoid noisy forge-std install output
    await runCommand("forge", ["init", ".", "--quiet"], { cwd: projectDir });

    await runCommand("forge", ["install", "--quiet", COMPOSE_FOUNDRY_DEP], { cwd: projectDir });
    logger.info("Compose library installed successfully.");

    logger.info(`Applying foundry template "${templateName}"…`);
    await copyTemplate(templatePath, projectDir);
  } else {
    logger.info("Skipping forge init (installDeps=false).");
    logger.info(`Applying foundry template "${templateName}"…`);
    await copyTemplate(templatePath, projectDir);
  }
}

module.exports = {
  scaffoldFoundryProject,
};

