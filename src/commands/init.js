const fs = require("fs-extra");
const path = require("node:path");
const { askInitPrompts } = require("../prompts/initPrompts");
const { logger } = require("../utils/logger");
const { loadTemplateConfig, pickVariant, resolveTemplatePath } = require("../scaffold/utils/templateLoader");
const { scaffoldProject } = require("../scaffold/scaffoldProject");

function normalizeInitOptions(argv) {
  const options = {
    projectName: argv.name || "",
    template: argv.template || "",
    framework: argv.framework || "",
    language: argv.language,
    yes: Boolean(argv.yes),
  };

  return options;
}

async function ensureBinaryExists(binaryName) {
  const hasPath = process.env.PATH || "";
  const separator = process.platform === "win32" ? ";" : ":";
  const paths = hasPath.split(separator);
  const extensions = process.platform === "win32" ? [".exe", ".cmd", ".bat", ""] : [""];

  for (const currentPath of paths) {
    for (const extension of extensions) {
      const candidate = path.join(currentPath, `${binaryName}${extension}`);
      if (await fs.pathExists(candidate)) {
        return true;
      }
    }
  }

  return false;
}

async function preflightChecks(options) {
  if (options.framework === "foundry") {
    const forgeExists = await ensureBinaryExists("forge");
    if (!forgeExists) {
      throw new Error(
        "forge not found in PATH. Please install Foundry and try again.",
      );
    }
  }

  if (options.framework === "hardhat") {
    const npmExists = await ensureBinaryExists("npm");
    if (!npmExists) {
      throw new Error("npm not found in PATH. Please install Node.js (with npm) and try again.");
    }
  }
}

async function collectInitOptions(argv) {
  const normalized = normalizeInitOptions(argv);

  if (normalized.yes) {
    if (!normalized.projectName) {
      normalized.projectName = "my-diamond";
    }
    return normalized;
  }

  const answers = await askInitPrompts({
    name: normalized.projectName || undefined,
    template: normalized.template || undefined,
    framework: normalized.framework || undefined,
    language: normalized.language,
  });

  return {
    ...normalized,
    projectName: answers.name || normalized.projectName || "my-diamond",
    template: answers.template || normalized.template,
    framework: answers.framework || normalized.framework,
    language: answers.language || normalized.language,
  };
}

async function runInitCommand(argv) {
  const initOptions = await collectInitOptions(argv);
  await preflightChecks(initOptions);

  const templateConfig = await loadTemplateConfig();
  const selectedVariant = pickVariant(templateConfig, {
    template: initOptions.template,
    framework: initOptions.framework,
    language: initOptions.language,
  });

  const templatePath = resolveTemplatePath(selectedVariant);

  const projectDir = await scaffoldProject({
    projectName: initOptions.projectName,
    templatePath,
    options: {
      framework: selectedVariant.framework,
      language: selectedVariant.language,
      installDeps: true,
    },
  });

  logger.success(`Project scaffolded in ${projectDir}`);
  logger.info(`Next: cd ${initOptions.projectName}`);
  if (selectedVariant.framework === "foundry") {
    logger.info("Then run: forge build && forge test");
  } else if (selectedVariant.framework === "hardhat") {
    logger.info("Then run: npx hardhat compile && npx hardhat test");
  }
}

module.exports = {
  runInitCommand,
  normalizeInitOptions,
};
