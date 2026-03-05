const fs = require("fs-extra");
const { assertTargetDoesNotExist, resolveProjectDir } = require("./utils/fileManager");
const { replaceTokensRecursively } = require("./utils/tokenReplace");
const { scaffoldFoundry } = require("./frameworks/scaffoldFoundry");
const { scaffoldHardhat } = require("./frameworks/scaffoldHardhat");

async function scaffold({ projectName, templatePath, options }) {
  const projectDir = resolveProjectDir(projectName);
  await assertTargetDoesNotExist(projectDir);

  const templateExists = await fs.pathExists(templatePath);
  if (!templateExists) {
    throw new Error(`Template path does not exist: ${templatePath}`);
  }

  let frameworkResult;
  if (options.framework === "foundry") {
    frameworkResult = await scaffoldFoundry(projectName, templatePath, projectDir, options);
  } else if (options.framework === "hardhat") {
    frameworkResult = await scaffoldHardhat(projectName, templatePath, projectDir, options);
  } else {
    throw new Error(`Unknown framework: ${options.framework}`);
  }

  await replaceTokensRecursively(projectDir, {
    "{{projectName}}": projectName,
  });

  return {
    projectDir,
    nextSteps: frameworkResult?.nextSteps || [],
  };
}

module.exports = {
  scaffold,
};
