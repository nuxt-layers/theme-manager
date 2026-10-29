# Contributing to Theme Manager

> **In short:** how to work on Theme Manager: read the contract first, keep changes small and inside the capability's boundaries, prove them with `pnpm check` and the Markdown check, and propose them through a pull request.

Theme Manager follows the ecosystem's AI-driven development method and architecture rules (see [Resources](RESOURCES.md)). Contributions improve the capability without moving responsibilities into it from hosts or other capabilities.

## Before contributing

Read, in order: the [README](README.md), [the contract](docs/contract.md) and [Presentation](docs/presentation.md). For a suspected vulnerability, follow [Security](SECURITY.md) instead of opening a public issue.

## Development environment

Use the Node.js version in `engines` and the pnpm version in `packageManager`, both in `package.json`.

```sh
pnpm install
pnpm dev:prepare
pnpm check
python3 scripts/check_markdown.py
```

`pnpm dev:prepare` generates the Nuxt types that `pnpm check` needs. `pnpm check` runs the type check, the tests and the stylesheet pipeline check, and is the minimum local gate before a pull request. The Markdown check enforces the documentation rules below.

## Workflow

1. Branch from `master`; keep each change narrow, without unrelated formatting, dependency or documentation churn.
2. Propose it through a pull request, never by changing `master` directly. Explain the problem, the intended behaviour, any architectural or compatibility effect, and how it was verified.
3. Add or update tests when behaviour or a public contract changes, and update the documents when a contract, integration requirement or semantic rule changes.
4. Merge only when every required CI check passes.

## Boundaries

Theme Manager owns Theme meaning and the semantic presentation vocabulary. It does not own reusable application UI, Authentication, Identity, Authorisation policy, application routing, database technology or asset storage.

- Preserve the dependency direction and public package surface set by [the contract](docs/contract.md); never couple Theme Manager to a particular consuming UI or its source layout.
- Treat stored or imported Theme data as untrusted until validated; new external inputs fail safely behind the existing validation boundary.
- Treat documented exports and contracts as public. Breaking changes are recorded even before 1.0; undocumented paths stay private and never become accidental contracts.
- Add a dependency only when the existing stack cannot reasonably do the job, and explain new runtime dependencies in the pull request. Never add a dependency on a UI, Authentication, Identity or Authorisation package where the host boundary is the intended design.

## Presentation changes

Choose tokens by meaning, never by their current colour, and review in the order [Presentation](docs/presentation.md#review-order) sets: meaning, palette, accessibility, composition. Never swap in an unrelated token just to pass a contrast check.

## Documentation

Documents follow ADR-0010 and ADR-0004 (see [Resources](RESOURCES.md)):

- every document opens with a one-line *In short*, in plain British English, and states each rule once;
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md` and `CODE_OF_CONDUCT.md` hold no versions, status, plans or external links;
- versions and release status live in `CHANGELOG.md` and `CONTRACT.md`, plans in `PLAN.md`;
- external links appear only in `RESOURCES.md`, pinned to a tag or commit; a removed document leaves no pointer file, only a pinned entry there.

## Licence and conduct

By contributing you agree your contribution is licensed under the repository's [MIT Licence](LICENSE). Participation follows the [Code of Conduct](CODE_OF_CONDUCT.md).
