const inquirer = require("inquirer").default;
const templateConfig = require("../config/templates");

function getTemplateChoices() {
  const list = templateConfig.templates || [];
  if (list.length === 0) {
    return [{ name: "Default", value: "default" }];
  }
  return list.map((t) => ({ name: t.name, value: t.id }));
}

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
      type: "select",
      name: "template",
      message: "Template",
      choices: () => getTemplateChoices(),
      when: () => !seed.template,
    },
    {
      type: "select",
      name: "framework",
      message: "Framework",
      choices: ["foundry", "hardhat"],
      when: () => !seed.framework,
    },
    {
      type: "select",
      name: "language",
      message: "Hardhat language",
      choices: ["javascript", "typescript"],
      when: (answers) => {
        const framework = seed.framework || answers.framework;
        return framework === "hardhat" && !seed.language;
      },
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
