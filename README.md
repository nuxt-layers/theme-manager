# Theme Manager

> **In short:** a Nuxt Layer that defines, validates, applies and manages runtime-configurable semantic presentation themes. It is the one theme authority between Theme Definitions and every screen, which styles by meaning through Tailwind CSS rather than hard-coded colour, typography, spacing, radius or effect values.

> **AI-driven development.** This repository is part of Nuxt Layers, an experimental initiative in which AI does the principal architecture, development, testing, security assessment and documentation, under human direction. The project owner decides requirements, governance, acceptance and releases. Every contribution meets the same standards, whatever its origin. See [Contributing](CONTRIBUTING.md).

## What it owns

- Versioned Theme Definitions, runtime validation and a deterministic fallback.
- Semantic colour, typography, spacing, radius, effect and shadow, responsive and asset-reference values.
- Resolving, applying, selecting and switching the effective Theme at run time.
- A provider-neutral persistence contract and canonical JSON import and export.
- Theme ownership, visibility, sharing and lifecycle.
- Theme management workflows and optional management screens.

It does **not** own reusable application components, authentication, authorisation policy, application routing, database technology or asset storage.

| Capability | Provided or required |
| --- | --- |
| `ThemeManagement` | Provided |
| `SemanticPresentationTheme` | Provided |
| Any other capability | None required; the host supplies storage and policy through ports |

## Using it

The package is `@nuxt-layers/theme-manager`. During active development, a host follows the latest accepted `master`, composes the package with Nuxt `extends` and supplies what the [host contract](CONTRACT.md) asks; that page is all a host needs. The four declared package entry points and current integration blockers are recorded in the root [host contract](CONTRACT.md). Every other package path is private.

Installing the layer runs no install scripts, so a host needs no `allowBuilds` entry for it.

The presentation pipeline is:

```text
Theme Definition
      ↓
runtime --ui-* values
      ↓
Semantic Theme API
      ↓
Tailwind semantic vocabulary
      ↓
consuming UI
```

Screens style by meaning:

```html
<button class="border border-edge-primary-default bg-fill-primary-default text-pen-primary-default">
  Save
</button>
```

A bundled default Theme is always available. The selected Theme is restored from a cookie, validated and applied as `--ui-*` values; any failure falls back to the default. The stylesheet maps light values on `:root` and dark on `html.dark`; the host chooses the mode and handles first paint.

## Documents

| Document | Covers |
| --- | --- |
| [Host contract](CONTRACT.md) | The one page a host needs to compose Theme Manager |
| [Contract background](docs/contract.md) | Detailed historical/background interface notes; the root host contract is authoritative |
| [Presentation](docs/presentation.md) | Choosing and pairing tokens, accessibility review order and how the stylesheet is built |
| [States](docs/states.md) | The twelve interactive states, roles, palette and component procedures |
| [Persistence](docs/persistence.md) | Writing and registering a `ThemeRepository` adapter |
| [Theme Editor](docs/theme-editor.md) | What each editor tab edits, the preview, unsaved changes and accessibility |
| [Changelog](CHANGELOG.md) | Releases |
| [Storage register](STORAGE-REGISTER.md) | Actual stored data, cookie purpose, essentiality, lifetime and controls |
| [Plan](PLAN.md) | Planned and proposed work |
| [Resources](RESOURCES.md) | Verified architectural references |

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev:prepare
pnpm check
```

`pnpm dev:prepare` generates the Nuxt types in `.nuxt/`; run it after installing and whenever Nuxt configuration changes. It is deliberately not a `prepare` or `postinstall` script: hosts install the layer from GitHub, and such a script would run during their install for no benefit. `pnpm check` is the repository's quality gate, also run by CI with the Markdown check (`python3 scripts/check_markdown.py`).

The `playground/` is a local fixture. Release acceptance also needs integration verification from an independent consuming application.

## Contributing, security and licence

Read [Contributing](CONTRIBUTING.md) before contributing; participation follows the [Code of Conduct](CODE_OF_CONDUCT.md). Report suspected vulnerabilities as [Security](SECURITY.md) describes, never in a public issue. Theme Manager is licensed under the [MIT Licence](LICENSE).
