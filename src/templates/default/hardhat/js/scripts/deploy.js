import hre from "hardhat";

async function main() {
  await hre.run("compile");
  const CounterFacet = await hre.artifacts.readArtifact("CounterFacet");
  console.log("CounterFacet artifact loaded:", CounterFacet.contractName);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
