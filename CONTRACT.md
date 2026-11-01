# Theme Manager Host Contract

> **In short:** the public integration surface of the current development `master`. This contract is intended to be self-contained (ADR-0012 §6); accepted architecture governs discrepancies, and implementation is evidence of actual behaviour.

Theme Manager is the **only authority** for the effective theme and its token vocabulary (ADR-0009). Other layers' screens, `ui` and the host consume that vocabulary; none of them defines, validates or applies a theme of its own.

**Current integration blocker:** the implementation does not yet meet ADR-0012: it ships no PostgreSQL store, no standard `resolveCaller`/`decide` composition, and no `examples/minimal-host`. The existing repository and access providers are implemented in internal server utilities, not in the package's declared public exports. A complete, architecture-compliant host integration cannot presently be specified without relying on private implementation. Do not treat those internal providers as an accepted public composition interface.

## Install

```json
"@nuxt4-layers/theme-manager": "github:nuxt-layers/theme-manager#master"
```

`extends: ['@nuxt4-layers/theme-manager']` in `nuxt.config.ts`; refresh the lockfile whenever accepted upstream `master` advances, then use `--frozen-lockfile` in CI. The package scope is still `@nuxt4-layers` in the current implementation; this is not the repository organisation name. Node.js 22 or later. The package is `private: true` (no npm release) and runs no install scripts, so it needs no `allowBuilds` entry. **Composition is currently blocked:** no supported, public, single-call host integration exists. The implemented `provideThemeRepository`, `provideThemeActorContext` and `provideThemeAuthorization` are internal server utilities, not package exports. Do not import, auto-import or depend on them from a consuming application. The documented ports below describe present implementation behaviour, not an approved host integration API. The bundled default theme still renders without those integrations; stored-theme management does not.

## Settings

**Development test mode:** a local consumer can set server-only `runtimeConfig.themeManager.mode = 'test'` to enable the existing management screens and HTTP endpoints with an in-process test store, a seeded editable template (`theme-test-template`) and an unrestricted test actor (`theme-test-admin`). No IAM layer or database is required. The store resets when the server process restarts. This mode is rejected when `NODE_ENV=production`; do not expose its unauthenticated APIs on a public development server. The mode defaults to `iam`, retaining existing provider-based integration. This mode is a development fixture, not the final standalone-production integration.


| Setting | Default | Does |
|---|---|---|
| `themeManager.creationTemplateId` (`NUXT_PUBLIC_THEME_MANAGER_CREATION_TEMPLATE_ID`) | `''` | Id of a stored theme, readable by the creator, that *Create* copies. Unset, the editor refuses to create |
| `themeManager.creationOwnerType` (`NUXT_PUBLIC_THEME_MANAGER_CREATION_OWNER_TYPE`) | `''` | `user`, `group` or `organisation`: the owner type of every new theme |
| `themeManager.creationOwnerId` (`NUXT_PUBLIC_THEME_MANAGER_CREATION_OWNER_ID`) | `''` | Opaque owner identifier of every new theme; the creator must match it (*You will hit this*) |
| `active-theme-id` cookie | None | The browser's selected theme: one year, `path=/`, `SameSite=Lax`. Written by Theme Manager when a theme is used, cleared on any failure |

All three settings are under `runtimeConfig.public`. There are no secrets.

**Storage and consent:** The selection cookie is **not essential to core rendering**: without it, the bundled default theme remains available, but the browser does not remember the selected theme. The current implementation writes the cookie on activation, so disabling it may require an implementation correction. Theme Manager writes the client-readable first-party `active-theme-id` cookie containing a selected theme identifier, with 365-day maximum age, `path=/` and `SameSite=Lax`; it does not explicitly set `Secure` or `HttpOnly`. Activation sets it and fallback/default selection clears it. The host must assess applicable consent or exemption rules before enabling persistent preferences, and supply required notice/consent controls. Stored theme JSON currently uses a host-supplied `ThemeRepository` without a built-in retention or erasure policy; the host must assess personal-data classification, access isolation and deletion obligations. No other Theme Manager-owned durable browser storage has been identified in the inspected code. The detailed factual inventory is maintained in `STORAGE-REGISTER.md`; all host obligations needed for integration are stated here.

## Host passes

| Need | Shared shape (ADR-0012 §2) | Today |
|---|---|---|
| Database | A `pg` pool, Theme Manager's own schema | Not taken. The host writes a store: `ThemeRepository { findById(id), list(), save(json), delete(id) }`, exchanging JSON only, and registers it with `provideThemeRepository({ getThemeRepository })`. Store at least the theme id and the canonical theme JSON; never a projection that becomes a second definition. Translate provider errors in the adapter. Without it: only the default theme, no create or edit, and `/api/themes*` answers `503` |
| Caller | `resolveCaller(event)` | The host writes `ThemeActorContextProvider { getActorContext(): Promise<{ actorId: string \| null, groupIds, organisationIds }> }`, mapped from its signed-in person; `actorId: null` for a visitor. Register with `provideThemeActorContext` |
| Access | `decide(caller, action, resource)` | The host writes `ThemeAuthorizationService { isAllowed({ actor, action, resource }): Promise<boolean> }`, failing closed (a throw fails the request with `500`). `resource` is `{ resourceType: 'theme', resourceId, ownership, visibility }`. Register with `provideThemeAuthorization`. It is the policy for *Permissions* and *Theme visibility* |
| Mail, Events, Scheduled work, Clock | | Not needed: Theme Manager sends nothing, publishes no events and runs no tasks |
| Assets | Not a shared shape | A theme may name assets by `{ assetId, mediaType? }`; storing and serving the files is the host's |

Without the actor provider and the authorisation service every `/api/themes*` call fails closed (`500`), including reading a stored theme for the runtime, so selected themes fall back to the default.

## Client and server functions

| Surface | Inputs and outputs |
|---|---|
| `useThemeRuntime()` (client) | `effectiveTheme`, `activeTheme`, `activeThemeName`, `selectedThemeId`, `error`; `activate(runtimeTheme)`, `useDefault()`, `preview(runtimeTheme)`, `clearPreview()`, `failToDefault(reason)` |
| `useThemeManagement()` (client) | `listThemes()` → `ThemeSummary[]`; `loadTheme(id)` → validated `ThemeDefinition`; `createTheme`, `updateTheme`, `deleteTheme`; `previewTheme`, `stopPreview` |
| `GET /api/theme-manager/capabilities` | `{ storage: boolean }`; screens offer only what can work |
| `GET /api/themes` | The `ThemeSummary[]` the caller may `theme.read`; others are left out |
| `GET /api/themes/:id` | The theme, or `404` when missing **or** not readable |
| `POST /api/themes`, `PUT /api/themes/:id` | Canonical theme JSON request body, at most 256 KiB; success response `{ success: true, id: string }` |
| `DELETE /api/themes/:id` | No request body; success response `{ success: true, id: string }` |
| `/contracts` | `parseThemeDefinition`, `parsePersistedTheme`, `serializeThemeDefinition`, `summarizeTheme`, `themeDefinitionToRuntime`, `createThemeApplication`, the types above, `THEME_MODES` |

Errors are Nitro errors with a status: `400` invalid theme or body, `403` not authorised or a system theme, `404` not found or not readable, `409` the id exists, `413` body over 256 KiB, `503` no store, `500` anything else, including missing actor or authorisation providers.

## Permissions

Theme Manager asks the host's `isAllowed` about these actions. The current implementation declares no risk level for them; the host's policy sets it. Self-service themes are usually low risk, while `theme.share` to `organisation` or `public` and `theme.publish` deserve an administrator.

| Action | Asked when | Effect |
|---|---|---|
| `theme.read` | Listing, loading, resolving the selected theme | Refused: hidden from the list, `404`, and the runtime falls back to the default |
| `theme.create` | `POST` | Also requires the actor to own the new theme |
| `theme.edit` | `PUT` | Ownership can never change through an edit |
| `theme.delete` | `DELETE` | |
| `theme.publish` | Creating a `published` theme, or moving one to `published` | |
| `theme.share` | Creating a theme whose visibility is not `private`, or changing visibility | |
| `theme.use`, `theme.assign`, `theme.import`, `theme.export` | Declared, not asked by the current implementation | Selecting a theme is only the cookie and `theme.read`; there is no assignment, import or export endpoint |

## Screens

Theme Manager's own management screens, drawn with its vocabulary:

| Page | Does |
|---|---|
| `/theme-manager` | Theme library: list, *Use*, *Create*, *Edit*, *Delete* (system themes: *Use* only) |
| `/theme-manager/:id`, `/theme-manager/new` | Editor: draft with light and dark preview, contrast badges, optional *Apply to the whole app while editing*; nothing is stored until *Save* |

The current implementation has no message catalogue (wording is built in, en-GB) and no `presentation: false`, page-path or page-switch setting. The host decides exposure: guard the routes with its own route middleware, or remove them in its `pages:extend` hook. The HTTP operations stay protected by the policy either way.

**Vocabulary for every layer's screens** (`SemanticPresentationTheme` v1): classes of the form `<utility>-<family>-<role>-<state>`, chosen by meaning, never by the colour they show today.

- Families: `fill` (`bg-fill-*`), `pen` (`text-pen-*`), `edge` (`border-edge-*`), and effects (shadow utilities: elevation, never state).
- Roles: `base`, `primary`, `secondary`, `tertiary`, `accent`, `muted`, `floor`, `input`, `link`, `success`, `info`, `warning`, `error`, `notification`.
- States: required `default`, `hover`, `active`, `selected`, `visited`, `disabled`; also `focus`, `pressed`, `on`, `error`, `loading`, `shadow`.
- Fill, Pen and Edge of one surface share a role and state; a cross-role pairing is deliberate, never a fix for contrast. Mode is resolved by Theme Manager and never named in a class.

**`presentation.css`**: `@nuxt4-layers/theme-manager/presentation.css` is the public stylesheet (default theme, semantic API, Tailwind vocabulary), with light values on `:root` and dark on `html.dark`. The layer already adds it to Nuxt's `css`, together with its own pages as Tailwind sources. A host that builds its own Tailwind entry can import `presentation.css` there before other layers' stylesheets, once; it never imports `assets/css/layer.css`, `theme-default.css`, `theme-api.css` or any other path.

**Contrast (WCAG 2.2 AA, light and dark)**: Pen on its own Fill at least 4.5:1 (3:1 for large text), meaningful Edges 3:1, the focus ring 3:1 against every page layer, in every state but `disabled`. The default theme is held to this by Theme Manager's tests, and the editor shows a badge for every pairing in both modes. The current implementation does **not** refuse to save a theme that fails a pairing: the host reviews themes before publishing or sharing them.

**Theme visibility**: each theme has `ownership` (`system`, `user`, `group`, `organisation`, with an opaque `ownerId`), `visibility` (`private`, `group`, `organisation`, `shared`, `public`, `system`) and `lifecycle` (`draft`, `published`, `archived`). Theme Manager passes them to the policy; the host's `isAllowed` decides what each means. For a public seasonal theme, store it `published` with visibility `public`, and let the policy allow `theme.read` to every actor, `actorId: null` included; when the season ends, archive it and let the policy refuse reading archived themes, so readers fall back to the default.

**Effective theme and preferences**: the effective theme is, in order, the editor's whole-app preview, then the selected theme (the `active-theme-id` cookie, loaded through `GET /api/themes/:id`, validated and applied as `--ui-*` values by Theme Manager's client plugin), then the bundled default `theme-manager-default`. Any failure to load, validate or apply clears the selection and shows the default. The selection is per browser; a person's preferred theme across devices is the host's to store, and it hands the id to Theme Manager by setting the cookie. The current implementation has no site-wide default other than the bundled one: to show a seasonal theme to every visitor without a selection, the host sets the cookie itself. Light, dark or system mode is the host's: it sets `html.dark` and handles first paint.

## Headless surface

A screen the host or another layer draws itself must still:

- style only with the vocabulary above, never `--ui-*` or `--api-*` variables, hard-coded colours or private stylesheets;
- never apply, store or switch a theme itself: select through `useThemeRuntime()`, preview through `useThemeManagement()`, and let Theme Manager validate and apply;
- treat every theme from a store, import or request as untrusted until `parseThemeDefinition` or `parsePersistedTheme` accepts it;
- show a missing and a refused theme alike (both are `404`);
- decide nothing: every management action is decided again on the server by the host's policy;
- send the management pages with `X-Frame-Options: DENY`, `frame-ancestors 'none'` and `Cache-Control: no-store` (Theme Manager does not set them);
- meet WCAG 2.2 AA in light and dark mode: visible focus distinct from hover, forced colours and reduced motion respected.

## You will hit this

- Theme ids are `^[a-z0-9-]{1,64}$`; the editor makes `theme-<uuid>`. `ownerId` is opaque, at most 256 characters, and required unless the owner is `system`.
- System themes (the default and any `ownerType` or `visibility` of `system`) ship with a release and are never created, edited or deleted: `403`.
- Creating needs `theme.create` **and** the actor to own the theme (`actorId`, a `groupIds` or an `organisationIds` entry equal to `ownerId`). The current implementation takes the owner from the three creation settings, so every new theme has the same owner.
- `getActorContext()` takes no argument: the provider reads the current request itself, for example through Nitro's `useEvent()` with `nitro.experimental.asyncContext`.
- Saving stamps vocabulary version `2`; older stored themes are completed from the default on read. Older development builds may refuse themes written with a newer vocabulary; preserve backups before updating.
- Without a store the HTTP operations answer `503`; there is no in-memory or file fallback. Without the policy they fail closed.
- Rendering never depends on a store round trip: the default theme is always available.

Development integration follows current accepted `master`, not historical release tags.
