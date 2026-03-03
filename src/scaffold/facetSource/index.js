const { applyLocalFacetSource } = require("./local");
const { applyRegistryFacetSource } = require("./registry");

async function applyFacetSource(projectDir, options) {
  const source = options.facetSource || "local";

  if (source === "local") {
    await applyLocalFacetSource(projectDir, options);
    return;
  }

  if (source === "registry") {
    await applyRegistryFacetSource(projectDir, options);
    return;
  }

  throw new Error(`Unknown facet source: ${source}`);
}

module.exports = {
  applyFacetSource,
};
