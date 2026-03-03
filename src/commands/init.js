const fs = require("fs-extra");
const path = require("node:path");
const { askInitPrompts } = require("../prompts/initPrompts");
const { logger } = require("../utils/logger");
const { loadTemplateConfig, pickVariant, resolveTemplatePath } = require("../scaffold/templateLoader");
const { scaffoldProject } = require("../scaffold/scaffoldProject");
const { DEFAULT_FACET_SOURCE, DEFAULT_FRAMEWORK, DEFAULT_TEMPLATE_ID } = require("../config/constants");

function normalizeInitOptions(argv) {
  const options = {
    projectName: argv.name || "",
    template: argv.template || DEFAULT_TEMPLATE_ID,
    framework: argv.framework || DEFAULT_FRAMEWORK,
    language: argv.language,
    facetSource: argv["facet-source"] || DEFAULT_FACET_SOURCE,
    installDeps: argv["skip-install"] ? false : Boolean(argv["install-deps"]),
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
      logger.warn("forge not found in PATH. Foundry dependency install may fail.");
    }
  }

  if (options.framework === "hardhat" && options.installDeps) {
    const npmExists = await ensureBinaryExists("npm");
    if (!npmExists) {
      logger.warn("npm not found in PATH. Hardhat dependency installation will be skipped.");
      options.installDeps = false;
    }
  }
}

async function collectInitOptions(argv) {
  const normalized = normalizeInitOptions(argv);

  if (normalized.yes) {
    if (!normalized.projectName) {
      normalized.projectName = "my-compose-diamond";
    }
    return normalized;
  }

  const answers = await askInitPrompts({
    name: normalized.projectName || undefined,
    template: normalized.template || undefined,
    framework: normalized.framework || undefined,
    language: normalized.language,
    facetSource: normalized.facetSource || undefined,
    installDeps: argv["install-deps"] || argv["skip-install"] ? normalized.installDeps : undefined,
  });

  return {
    ...normalized,
    projectName: answers.name || normalized.projectName || "my-compose-diamond",
    template: answers.template || normalized.template,
    framework: answers.framework || normalized.framework,
    language: answers.language || normalized.language,
    facetSource: answers.facetSource || normalized.facetSource,
    installDeps: typeof answers.installDeps === "boolean" ? answers.installDeps : normalized.installDeps,
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
      facetSource: initOptions.facetSource || selectedVariant.facets,
      installDeps: Boolean(initOptions.installDeps),
    },
  });

  logger.success(`Project scaffolded in ${projectDir}`);
  logger.info(`Next: cd ${initOptions.projectName}`);
  if (selectedVariant.framework === "foundry") {
    logger.info("Then run: forge build && forge test");
  } else {
    logger.info("Then run: npm install && npx hardhat compile");
  }
}

module.exports = {
  runInitCommand,
  normalizeInitOptions,
};
