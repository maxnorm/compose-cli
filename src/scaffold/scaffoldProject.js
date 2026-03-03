const fs = require("fs-extra");
const {
  assertTargetDoesNotExist,
  copyTemplate,
  resolveProjectDir,
} = require("./fileManager");
const { replaceTokensRecursively } = require("./tokenReplace");
const { applyFacetSource } = require("./facetSource");

async function scaffoldProject({ projectName, templatePath, options }) {
  const projectDir = resolveProjectDir(projectName);
  await assertTargetDoesNotExist(projectDir);

  const templateExists = await fs.pathExists(templatePath);
  if (!templateExists) {
    throw new Error(`Template path does not exist: ${templatePath}`);
  }

  await copyTemplate(templatePath, projectDir);

  await replaceTokensRecursively(projectDir, {
    "{{projectName}}": projectName,
  });

  await applyFacetSource(projectDir, options);
  return projectDir;
}

module.exports = {
  scaffoldProject,
};
