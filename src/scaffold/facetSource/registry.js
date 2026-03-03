const fs = require("fs-extra");
const path = require("node:path");

async function applyRegistryFacetSource(projectDir, options) {
  const registryConfig = {
    mode: "registry",
    chain: options.chain || "sepolia",
    registryUrl: options.registryUrl || "",
    facets: {},
    note: "TODO: populate from on-chain registry manifest.",
  };

  const target = path.join(projectDir, "compose.facets.json");
  await fs.writeJson(target, registryConfig, { spaces: 2 });
}

module.exports = {
  applyRegistryFacetSource,
};
