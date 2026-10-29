# Theme Manager Contract

> **In short:** the full public contract behind the one-page [host contract](../CONTRACT.md): what Theme Manager provides, what the host supplies, the dependency direction and what a compatible consumer may rely on. Undocumented paths are private.

## Public surface

Theme Manager is a foundation capability. Consumers MUST NOT depend on undocumented implementation paths; all other source paths stay private unless promoted through an explicit, versioned contract.

| Entry point | Is |
| --- | --- |
| `@nuxt4-layers/theme-manager` | The Nuxt Layer, composed with Nuxt `extends` |
| `@nuxt4-layers/theme-manager/contracts` | The TypeScript contract: types, parsers, serialisers and runtime helpers |
| `@nuxt4-layers/theme-manager/capability` | Machine-readable capability metadata (`capability.json`) |
| `@nuxt4-layers/theme-manager/presentation.css` | The semantic presentation stylesheet |

The layer also adds an internal stylesheet that registers its own management pages for Tailwind source discovery. It is not a public export.

## Provided capabilities

| Capability | Contract version | Covers |
| --- | --- | --- |
| `ThemeManagement` | `1` | Themes, their validation, persistence port, management actions and screens |
| `SemanticPresentationTheme` | `1` | The presentation vocabulary every screen styles with |

Theme Manager requires no other capability merely to load as a Nuxt Layer. Machine-readable `requires` declarations MUST list only actual required or optional capability dependencies and MUST agree with this document. Tailwind CSS is a package dependency, not a capability requirement.

## Theme data

The contract defines types for Theme identity and metadata, ownership (opaque external identity references), visibility, lifecycle, presentation families and modes, semantic asset references, Theme summaries and Theme action names. The presentation grammar and the runtime Theme Definition schema sit behind this boundary: consumers use the declared contracts, never inferences from internal code.

### Theme versions

A Theme carries two versions:

- **`version`** is the Theme's own version. A system Theme, the built-in default included, ships in the package, so its `version` is the Theme Manager release (`THEME_MANAGER_VERSION`). It changes only by upgrading the layer and is never editable through the management screens.
- **`schemaVersion`** is the token vocabulary the Theme was built against (`THEME_VOCABULARY_VERSION`). A release raises it when it adds, renames or removes tokens.

When a stored Theme is read, tokens it lacks take the default Theme's values, so stored Themes keep working after an upgrade; its own `version` and `schemaVersion` are kept until it is next saved. Saving writes the complete current vocabulary and stamps the current `schemaVersion`. A stored Theme whose `schemaVersion` is newer than this release, or unreadable, is refused as invalid, because this release cannot know its tokens. `ThemeSummary` includes `version`.

## Composition

The host Nuxt application is the composition root. Theme Manager stays a bounded foundation capability and never becomes an application shell.

Install Theme Manager through the package manager and compose the package root with Nuxt `extends`. During early development a pinned Git-backed dependency is permitted; production never follows a moving default branch, and the host's lockfile records the exact resolved revision.

| The host | Theme Manager |
| --- | --- |
| Selects a compatible Theme Manager version | Owns Theme Definitions and their validation |
| Composes Theme Manager and presentation consumers as peer capabilities | Owns the canonical stored representation |
| Supplies a `ThemeRepository` adapter when Themes are stored (see [Stand-alone operation](#stand-alone-operation)) | Owns the effective Theme at run time |
| Supplies `ThemeActorContextProvider` and `ThemeAuthorizationService` for exposed management operations | Owns semantic presentation values and their Tailwind projection |
| Supplies its own route and navigation policy where the default management screens do not fit | Owns the management workflows and Theme action names |
| Supplies asset storage when Themes reference assets | Fails closed at management boundaries when required providers are absent |
| Supplies the creation template and owner settings | |
| Integration-tests the composed application | |

### Dependency direction

The graph is acyclic. Arrows show contract flow, not package dependencies:

```text
Identity ───────────────┐
                       │ actor context
                       ▼
                  Theme Manager ── semantic presentation ──► UI
                       │
                       │ authorisation request
                       ▼
                 Authorisation

The composition root connects ports and infrastructure adapters.
```

Theme Manager has no package dependency on UI, Identity, Authentication, Authorisation, a database or an asset provider. It MUST NOT import a UI capability, its components, source paths or token definitions.

### Stand-alone operation

Rendering works from the bundled default Theme without storage, Identity or Authorisation.

Without a repository adapter, the Theme Library offers only the default and nothing can be created, edited or saved. `GET /api/theme-manager/capabilities` reports `{ "storage": false }`, the pages hide creating and editing, and the Theme HTTP operations answer `503` (*Theme storage is not configured*). There is no implicit in-memory or file store.

System Themes (the built-in default and any `ownerType: 'system'` Theme) ship with a release and are never editable through the management screens or HTTP operations, with or without storage.

Stored Themes need a host-supplied repository adapter; [Persistence](persistence.md) shows how to write one. Management HTTP operations need the actor-context and authorisation providers and fail closed without them. The management screens are optional: the host decides whether their routes are exposed and where they appear.

### Failure boundaries

Expected composition failures:

- no repository provider when storage is requested;
- no actor or authorisation provider when management operations are exposed;
- invalid or untrusted stored Theme JSON;
- a refused Theme action;
- an unresolved or invalid selected Theme, which falls back to the bundled default.

Adapters translate provider SDK exceptions; they never become undocumented Theme Manager contracts.

## Presentation consumers

UI and other presentation capabilities consume `SemanticPresentationTheme`. They never set up a competing effective-Theme authority or require Theme Manager to know their components or source layout.

Theme Manager owns the effective Theme and writes its raw `--ui-*` values through its Theme application engine. Those values reach consumers through Theme Manager's semantic API and Tailwind vocabulary. The public stylesheet packages:

```text
default raw Theme
      ↓
semantic Theme API
      ↓
Tailwind semantic vocabulary
```

It contains no UI component CSS and no source-scanning knowledge of any consuming repository.

A compatible consumer:

1. consumes only declared public Theme Manager surfaces;
2. treats semantic presentation vocabulary as the styling boundary;
3. does not depend on `assets/css/theme/theme-default.css`, `theme-api.css` or other private file paths;
4. does not mutate raw Theme state as a substitute for Theme Manager;
5. preserves accessibility constraints when presenting user-customisable values;
6. does not require Theme Manager to know component names or source layout.

[Presentation](presentation.md) sets out how to choose and pair the vocabulary.

## Compatibility

Theme Manager is pre-1.0 and its package is `private: true`, so the package name does not imply an npm release. Breaking changes to the public contract are still recorded in the [changelog](../CHANGELOG.md). Production hosts pin the exact integrated dependency set and test it before deployment.

## Verifying the composed system

A host tests its actual combination of:

- the pinned Theme Manager revision;
- its repository adapter;
- its Identity and Authorisation adapters;
- its UI or other presentation consumers;
- its route and navigation exposure;
- asset storage, where used.

Theme Manager's own tests prove its contract, not the host's adapters. Release acceptance also needs integration verification from an independent consuming application.

## Security

Theme Definitions and stored JSON crossing a trust boundary are untrusted until runtime validation succeeds; TypeScript types are not validation. The runtime validators and the import and application boundaries enforce this.
