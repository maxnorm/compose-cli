const pkg = require("../../package.json");

const HELP_TEXT = `
Compose CLI v${pkg.version}

Scaffolds Diamond-based projects using the Compose Library

Usage:
  compose init [options]
  compose list-templates
  compose --version | -v
  compose update

Options:
  --name <project-name>
  --template <template-id>
  --framework <foundry|hardhat>
  --language <javascript|typescript>
  --help

For more information about the Compose, see: https://compose.diamonds/
`;

module.exports = {
  HELP_TEXT,
};