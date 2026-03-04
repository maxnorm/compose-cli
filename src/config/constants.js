const path = require("node:path");

const COMPOSE_NPM_PACKAGE = "@perfect-abstractions/compose";
const COMPOSE_REPO_URL = "https://github.com/Perfect-Abstractions/Compose";
const COMPOSE_PREP_RELEASE_URL = "https://github.com/maxnorm/Compose/tree/prep-release";
const COMPOSE_FOUNDRY_DEP = "Perfect-Abstractions/Compose";
const DEFAULT_TEMPLATE_ID = "default";
const DEFAULT_FRAMEWORK = "foundry";
const TEMPLATE_REGISTRY_PATH = path.join(__dirname, "templates.json");

module.exports = {
  COMPOSE_NPM_PACKAGE,
  COMPOSE_REPO_URL,
  COMPOSE_PREP_RELEASE_URL,
  COMPOSE_FOUNDRY_DEP,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_FRAMEWORK,
  TEMPLATE_REGISTRY_PATH,
};

