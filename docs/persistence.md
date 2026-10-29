# Persistence

> **In short:** how a host stores Themes by supplying a `ThemeRepository` adapter, without Theme Manager owning a database, ORM, storage service or provider SDK, and without creating a second Theme authority.

## Who owns what

| Theme Manager owns | The host owns |
| --- | --- |
| Theme Definition schema and meaning | Database or provider choice |
| Runtime and semantic validation | Database schema and migrations |
| Canonical JSON serialisation | Provider credentials and connectivity |
| The `ThemeRepository` contract | The concrete repository adapter |
| Effective Theme resolution | Which person or group uses which Theme |
| The bundled default fallback | Authentication and authorisation |
| Import and export meaning | Infrastructure monitoring and backup |

A store is optional: rendering always works from the bundled default Theme.

## The contract

Import the types from the contract entry point:

```ts
import type {
  JsonValue,
  ThemeRepository
} from '@nuxt4-layers/theme-manager/contracts'
```

The contract is deliberately small:

```ts
interface ThemeRepository {
  findById(id: string): Promise<JsonValue | null>
  list(): Promise<readonly JsonValue[]>
  save(serializedTheme: JsonValue): Promise<void>
  delete(id: string): Promise<void>
}
```

A repository exchanges JSON-compatible values and never decides whether a value is a valid Theme. Theme Manager serialises before storing, and parses, validates and normalises everything read back before it becomes trusted Theme data.

## A minimal adapter

Any storage technology can sit behind the port:

```ts
import type {
  JsonValue,
  ThemeRepository
} from '@nuxt4-layers/theme-manager/contracts'

export function createThemeRepository(store: {
  get(id: string): Promise<JsonValue | null>
  all(): Promise<readonly JsonValue[]>
  put(id: string, value: JsonValue): Promise<void>
  remove(id: string): Promise<void>
}): ThemeRepository {
  return {
    findById: id => store.get(id),
    list: () => store.all(),

    async save(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError('Theme repository expected a serialized Theme Definition object.')
      }

      const id = value.id
      if (typeof id !== 'string' || !id) {
        throw new TypeError('Theme repository expected a Theme Definition id.')
      }

      await store.put(id, value)
    },

    delete: id => store.remove(id)
  }
}
```

The adapter checks only the storage key it needs. It never repeats Theme validation, which stays with Theme Manager.

## Registering it

Register the adapter in a Nitro plugin in the host:

```ts
export default defineNitroPlugin(() => {
  const repository = createThemeRepository(myStore)

  provideThemeRepository({
    getThemeRepository: () => repository
  })
})
```

The Theme Manager layer supplies `provideThemeRepository` to the composed Nitro application. Register the adapter before storage-backed Theme operations are exposed. Without it, Theme Manager fails explicitly rather than inventing storage.

## Database adapters

A PostgreSQL, Supabase or other database adapter keeps provider types and SDK objects on the host's side of the boundary. A relational table needs at least:

```text
theme_id       stable Theme identifier / primary key
theme_json     canonical serialised Theme JSON
created_at     infrastructure metadata, if required
updated_at     infrastructure metadata, if required
```

Extra indexed columns may be copied out for querying, but they never become an alternative Theme Definition: the canonical stored value stays the versioned Theme JSON that Theme Manager accepts.

Migrations, row-level security, connection pooling, encryption, backup, tenancy and credentials belong to the host and its infrastructure.

A Supabase adapter, for example, has this shape:

```text
Theme Manager
    │ ThemeRepository
    ▼
Host SupabaseThemeRepository
    │
    ▼
Supabase client / PostgreSQL
```

Never import the Supabase SDK into Theme Manager, and never expose Supabase row or client types through `ThemeRepository`.

## Identity, ownership and selection

Theme Definitions carry ownership metadata, but Theme Manager neither authenticates people nor owns identity. The host maps its signed-in person to Theme Manager's opaque actor context and supplies the authorisation policy separately. Database ownership constraints and row-level access controls reinforce that policy; they never replace Theme Manager's authorisation boundary.

A person's preferred Theme is application state, which the host may store itself. Theme Manager still validates and applies whichever Theme is resolved.

## Run time and fallback

A valid first presentation never needs storage:

```text
application starts
      │
      ▼
bundled Default Theme
      │
      ├── no stored selection / repository unavailable / invalid Theme
      │        └── the default stays available
      │
      └── stored Theme resolved
                 │
                 ▼
         parse and validate
                 │
                 ▼
         apply runtime --ui-* values
                 │
                 ▼
       Theme API → Tailwind → UI
```

Never make rendering depend on a database round trip just to obtain a valid Theme.

## Trust and failure

Treat every value a repository returns as untrusted, even from your own database, and never skip Theme Manager's parsing or validation because a row was validated before.

Translate provider failures in the adapter: SDK exceptions and database objects never become undocumented Theme Manager contracts. A production adapter also weighs request and payload limits, transactions, concurrent updates, audit and observability.

## Import and export

Import, export and storage share one Theme authority but serve different workflows. Importing JSON does not make it trusted, and exporting a Theme does not expose how it is stored. Use Theme Manager's canonical serialisation and validation rather than a parallel format.

## Verifying it

Integration-test the exact Theme Manager version with the real repository, Identity and Authorisation adapters and presentation consumers. The *Platform test harness* entry in [Resources](../RESOURCES.md) is an independent consumer that does this: it implements `ThemeRepository`, registers it with `provideThemeRepository`, and composes actor-context and authorisation adapters outside Theme Manager. Its Theme repository is in memory, so it shows the composition pattern, not a production database adapter; its PostgreSQL integration belongs to the Authentication layer, not to Theme Manager.

See also the [contract](contract.md) and [Presentation](presentation.md).
