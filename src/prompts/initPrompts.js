const inquirer = require("inquirer");

async function askInitPrompts(seed = {}) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name",
      default: seed.name || "my-compose-diamond",
      when: () => !seed.name,
    },
    {
      type: "list",
      name: "template",
      message: "Template",
      choices: ["default"],
      when: () => !seed.template,
    },
    {
      type: "list",
      name: "framework",
      message: "Framework",
      choices: ["foundry", "hardhat"],
      when: () => !seed.framework,
    },
    {
      type: "list",
      name: "language",
      message: "Hardhat language",
      choices: ["javascript", "typescript"],
      when: (answers) => {
        const framework = seed.framework || answers.framework;
        return framework === "hardhat" && !seed.language;
      },
    },
    {
      type: "confirm",
      name: "installDeps",
      message: "Install dependencies now?",
      default: true,
      when: () => seed.installDeps === undefined,
    },
    {
      type: "list",
      name: "facetSource",
      message: "Facet source",
      choices: ["local", "registry"],
      default: "local",
      when: () => !seed.facetSource,
    },
  ]);

  return {
    ...seed,
    ...answers,
  };
}

module.exports = {
  askInitPrompts,
};
