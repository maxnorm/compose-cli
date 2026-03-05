# Compose CLI

`@perfect-abstractions/compose-cli` scaffolds Compose-based facet diamond projects.

## Install

```bash
npm install -g @perfect-abstractions/compose-cli
```

## Commands

```bash
compose init
compose list-templates
compose --version
compose update
```

### Non-interactive examples

```bash
compose init --name my-foundry-app --template default --framework foundry --yes
compose init --name my-hardhat-js --template default --framework hardhat --language javascript --skip-install --yes
compose init --name my-hardhat-ts --template default --framework hardhat --language typescript --install-deps --yes
```

## Notes on `@perfect-abstractions/compose`

Hardhat scaffolds inject `@perfect-abstractions/compose` as the dependency name now.  
If package installation fails before publication, the scaffold is still generated and you can retry install later.

Reference branch for package prep:

- <https://github.com/maxnorm/Compose/tree/prep-release>

## Scaffold variants

- `default-foundry`
- `default-hardhat-js`
- `default-hardhat-ts`

## Development

```bash
npm install
npm run check
```

## Docs

- `docs/DESIGN.md`
- `docs/TEMPLATE_AUTHORING.md`
- `docs/RELEASE.md`
- `docs/FUTURE.md`
