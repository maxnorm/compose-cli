const { loadTemplateConfig } = require("../scaffold/templateLoader");
const { logger } = require("../utils/logger");

async function runListTemplatesCommand() {
  const config = await loadTemplateConfig();

  config.templates.forEach((template) => {
    logger.plain(`${template.id} - ${template.name}`);
    template.variants.forEach((variant) => {
      logger.plain(
        `  - ${variant.id} [framework=${variant.framework}${variant.language ? ` language=${variant.language}` : ""}]`
      );
    });
  });
}

module.exports = {
  runListTemplatesCommand,
};
