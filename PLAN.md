# Plan

> **In short:** Theme Manager's planned and proposed work, and its status. Reasoning stays in the documents each item belongs to.

| Item | Status | What |
| --- | --- | --- |
| Trivial composition | Open | Meet ADR-0012 (see [Resources](RESOURCES.md)): a bundled PostgreSQL store, caller and access defaults, and `examples/minimal-host`, so a host no longer writes its own store and policy ([host contract](CONTRACT.md)) |
| Mode controller | Proposed | A layer-owned light, dark and system mode, described below |

## Mode controller (proposed)

Today the host sets `html.dark` and handles first paint ([Presentation](docs/presentation.md#light-and-dark)). The proposal would move that into the layer:

| Piece | Where | Would do |
| --- | --- | --- |
| Mode cookie | Layer runtime, beside `active-theme-id` | Store `light`, `dark` or `system` (default `system`) |
| Server render | Layer server plugin | Render `<html class="dark">` for `dark`, no class for `light` |
| Head script | Layer `app.head` | Read `prefers-color-scheme` and update the class before first paint |

With JavaScript disabled, `system` would fall back to light; covering that would mean repeating the dark mappings under `prefers-color-scheme`.
