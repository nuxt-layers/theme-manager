# Plan

> **In short:** Theme Manager's planned and proposed work, and its status. Reasoning stays in the documents each item belongs to.

| Item | Status | What |
| --- | --- | --- |
| Trivial composition | Open | Meet ADR-0012 (see [Resources](RESOURCES.md)): a bundled PostgreSQL store, caller and access defaults, and `examples/minimal-host`, so a host no longer writes its own store and policy ([host contract](CONTRACT.md)) |
| Mode controller | Proposed | A layer-owned light, dark and system mode, described below |
| Storage register | Implemented; maintain | Keep the [Storage Register](STORAGE-REGISTER.md) aligned with implementation; record proposed mode storage only when implemented |
| Public composition and request isolation | Review | Design the public one-call composition API and evaluate module-scoped repository, caller and authorisation providers for safe request/tenant isolation before implementation |
| Headless and internationalised presentation | Review | Define `presentation: false`, route/asset suppression and the message catalogue and override contract |
| Persistence correctness | Review | Decide concurrency, atomic updates, tenant isolation, lifecycle and retention semantics before a built-in PostgreSQL adapter is specified |
| Creation ownership and access | Review | Replace or justify static public creation-owner settings; check authorisation, ownership and permission risk across multi-user/group cases |
| SSR and first-paint behaviour | Review | Validate selected-theme restoration, authenticated request context, hydration and light/dark/system mode handling before approving the mode-controller proposal |
| Accessible theme publication | Review | Decide whether invalid-contrast themes may be saved as drafts and what checks or approvals prevent inaccessible themes being published or shared |
| Optional preference consent | Review | Define the host-controlled storage/consent boundary for the non-essential `active-theme-id` cookie before changing selection persistence |
| Contract and supporting documentation | Review | After design decisions, reconcile `CONTRACT.md`, `docs/contract.md` and `docs/persistence.md` against implemented public behaviour, not unimplemented targets |

## Design review order

Review public composition and request isolation first; then persistence, ownership/access, SSR and mode policy, presentation/i18n, accessibility and privacy. These are findings for architectural decision, **not authorised source changes**. Documentation describes the current behaviour until approved work is implemented and validated. A compliant `examples/minimal-host` is acceptance evidence for composition, not a substitute for the public contract.

## Mode controller (proposed)

Today the host sets `html.dark` and handles first paint ([Presentation](docs/presentation.md#light-and-dark)). The proposal would move that into the layer:

| Piece | Where | Would do |
| --- | --- | --- |
| Mode cookie | Layer runtime, beside `active-theme-id` | Store `light`, `dark` or `system` (default `system`) |
| Server render | Layer server plugin | Render `<html class="dark">` for `dark`, no class for `light` |
| Head script | Layer `app.head` | Read `prefers-color-scheme` and update the class before first paint |

With JavaScript disabled, `system` would fall back to light; covering that would mean repeating the dark mappings under `prefers-color-scheme`.
