# Changelog

> **In short:** each Theme Manager release and major change, newest first. GitHub source tags are not npm releases: the package stays `private: true`.

## Unreleased

### Changed

- Documentation aligned with the architecture rules' documentation style and placement: an *In short* opens every document, external links and pins moved to `RESOURCES.md`, plans to `PLAN.md`, and versions and status kept to this changelog and `CONTRACT.md`.
- The public, composition and consumer contract documents merged into `docs/contract.md`; the guides renamed `docs/presentation.md`, `docs/states.md` and `docs/persistence.md`.
- A Markdown check (`scripts/check_markdown.py`) added to CI.

### Removed

- The TM-0 to TM-10 migration record and the v0.1.0 to v0.2.1 upgrade guide. For the record, their last versions are listed in `RESOURCES.md`.

## [0.2.2] — 2026-10-24

A patch release with no contract change: the public exports, capability metadata, token vocabulary (version `2`) and stored Theme format are unchanged from `v0.2.1`.

### Changed

- Installing the layer from GitHub no longer runs any script. The `prepare` script (`nuxt prepare`) is renamed `dev:prepare`, so hosts no longer need to allow it in `allowBuilds`; its output (`.nuxt/`) was never part of the package. Contributors run `pnpm dev:prepare` after `pnpm install`.
- The repository uses pnpm 12.5.1 (`packageManager`, CI and `pnpm-lock.yaml`), with `minimumReleaseAge: 1440` set in `pnpm-workspace.yaml`.

## [0.2.1] — 2026-10-08

Supersedes the withdrawn `v0.2.0` GitHub Release, whose Git tag remains. The functional change baseline is `v0.1.0`.

### Added

- A much expanded Theme Editor, with controls for colours, typography, spacing, radii, borders, shadows, effects and motion; accessible confirmation dialogs; and scoped light and dark previews.
- A generated scoped presentation stylesheet for previews, beside a checked and hash-locked three-stage presentation pipeline.
- A layer-owned Tailwind source-discovery stylesheet for the management screens, separate from the public presentation stylesheet export.
- Shared utilities for colour pairing and contrast, CSS value parsing, token catalogues and references, type scales, motion and shadow shapes.
- Storage availability reporting through `GET /api/theme-manager/capabilities`, and tests for missing storage, scoped presentation, token validation and versioning.
- Completing the vocabulary when a stored Theme is read, and stamping its schema version when it is written.

### Changed

- The semantic colour and non-colour vocabulary and its default palette are extensively revised, which may change generated utility names, Theme appearance and the expected token set.
- Theme management uses a fuller editor and preview workflow; system Themes stay read-only.
- The runtime applies validated `--ui-*` values; the selection is restored from `active-theme-id`, and an invalid or unavailable selection falls back to the bundled default.
- Storage is explicitly optional: without a host repository the default Theme stays available, and storage-backed HTTP operations answer `503` rather than using an implicit store.
- The token vocabulary version is `2`.

### Breaking changes

- **Presentation vocabulary:** consumers that use old token names, rely on old CSS values or reach into internal stylesheet paths must audit their usages against the current presentation guide and contract; there is no one-to-one renaming table.
- **Stored Theme vocabulary:** older numeric schema versions are read and completed from the bundled default. A saved Theme is stamped with schema version `2`, and older releases refuse it, so test stored Theme round trips and plan rollback.
- **Management storage:** hosts that need Theme create, edit and delete must provide a `ThemeRepository`; without one those operations answer `503`. Host actor and authorisation services stay required for protected operations.
- **CSS composition:** import the public `presentation.css` export when importing the stylesheet explicitly. Never import the internal `assets/css/layer.css`, or add the public stylesheet twice when layer composition already includes it.
- **Mode:** the layer supplies no light, dark or system controller or first-paint script; hosts that switch modes manage `html.dark` and first paint themselves.

## [0.2.0] — 2026-10-08 (withdrawn GitHub pre-release)

The GitHub Release was published and then deleted. Its Git tag remains as history and is never repointed or reused. Its changes are carried forward into `v0.2.1`.

## [0.1.0]

The first tagged pre-1.0 source baseline.
