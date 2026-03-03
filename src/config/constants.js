const path = require("node:path");

const COMPOSE_NPM_PACKAGE = "@perfect-abstractions/compose";
const COMPOSE_PREP_RELEASE_URL = "https://github.com/maxnorm/Compose/tree/prep-release";
const DEFAULT_TEMPLATE_ID = "default";
const DEFAULT_FRAMEWORK = "foundry";
const DEFAULT_FACET_SOURCE = "local";
const TEMPLATE_REGISTRY_PATH = path.join(__dirname, "templates.json");

module.exports = {
  COMPOSE_NPM_PACKAGE,
  COMPOSE_PREP_RELEASE_URL,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_FRAMEWORK,
  DEFAULT_FACET_SOURCE,
  TEMPLATE_REGISTRY_PATH,
};
