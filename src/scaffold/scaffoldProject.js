const fs = require("fs-extra");
const { assertTargetDoesNotExist, resolveProjectDir } = require("./utils/fileManager");
const { replaceTokensRecursively } = require("./utils/tokenReplace");
const { scaffoldFoundryProject } = require("./scaffoldFoundry");
const { scaffoldHardhatProject } = require("./scaffoldHardhat");

async function scaffoldProject({ projectName, templatePath, options }) {
  const projectDir = resolveProjectDir(projectName);
  await assertTargetDoesNotExist(projectDir);

  const templateExists = await fs.pathExists(templatePath);
  if (!templateExists) {
    throw new Error(`Template path does not exist: ${templatePath}`);
  }

  if (options.framework === "foundry") {
    await scaffoldFoundryProject(projectName, templatePath, projectDir, options);
  } else if (options.framework === "hardhat") {
    await scaffoldHardhatProject(projectName, templatePath, projectDir, options);
  } else {
    throw new Error(`Unknown framework: ${options.framework}`);
  }

  await replaceTokensRecursively(projectDir, {
    "{{projectName}}": projectName,
  });

  return projectDir;
}

module.exports = {
  scaffoldProject,
};
