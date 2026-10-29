# Presentation

> **In short:** consumers style by **meaning**, not by the colour a token shows today. This guide sets the grammar for choosing and pairing Theme Manager's colour and effect tokens, the order in which meaning, palette and accessibility are judged, and how the stylesheet is built.

Consumers MUST use the public Tailwind vocabulary from `@nuxt4-layers/theme-manager/presentation.css`, never the private `--ui-*` or `--api-*` variables. [States](states.md) defines the full state vocabulary and the component procedures built on it.

## The grammar

A colour token has four dimensions:

```text
family + role + state + resolved presentation mode
```

Consumers write it as:

```text
<utility>-<family>-<role>-<state>
```

For example `bg-fill-primary-default`, `text-pen-primary-default` and `border-edge-primary-default`. Theme Manager resolves the mode (light or dark), so a class never names it.

### Families

| Family | Means | Tailwind utility |
| --- | --- | --- |
| Fill | Surface or background | `bg-fill-*` |
| Pen | Foreground text or icon | `text-pen-*` |
| Edge | Border, outline or visible boundary | `border-edge-*` |
| Effects | Depth or emphasis: box, inset, drop and text shadows | Shadow utilities |

A family names a purpose; a component need not use every family.

### Roles

The roles are `base`, `primary`, `secondary`, `tertiary`, `accent`, `muted`, `floor`, `input`, `link`, `success`, `info`, `warning`, `error` and `notification`. Choose a role because it describes the meaning. **Never choose a token because its current colour looks right.**

### States

The runtime validator requires six states for each colour role it receives: `default`, `hover`, `active`, `selected`, `visited` and `disabled`. The palette also defines `focus`, `pressed`, `on`, `error`, `loading` and `shadow`; the runtime accepts and applies them when valid, but does not require them. [States](states.md) gives each one's meaning.

A state describes the component's actual state. When a component changes state, its families normally move together rather than mixing unrelated states.

## Pairing

Judge meaning **before** contrast. When Fill, Pen and Edge describe one surface or control, start from the same role and state:

```html
<button class="border border-edge-primary-default bg-fill-primary-default text-pen-primary-default">
  Save
</button>
```

```html
<div class="border border-edge-error-default bg-fill-error-default text-pen-error-default">
  The Theme could not be saved.
</div>
```

A cross-role pairing is allowed only when the component's meaning needs it, and MUST be deliberate: passing a contrast check never justifies one. This is wrong when the button is meant to be a primary surface:

```html
<button class="bg-fill-primary-default text-pen-base-default">
  Save
</button>
```

Use the primary Pen, and fix the primary palette if it falls short.

## Palette

A palette value must do more than pass a contrast threshold. It keeps each role recognisable, differs clearly from neighbouring roles and states, steps coherently through its states and behaves sensibly in light and dark modes.

Never pass contrast by flattening distinct roles into interchangeable greys when a role is meant to carry its own hue; adjust that role's value and keep its identity. The default Theme is the reference implementation. Other Themes may choose other values, but consuming UI keeps the semantic relationships.

## Accessibility

Accessibility is checked **on correctly composed meaning**; it never decides which token a component uses. The default Theme's regression tests hold:

- text (Pen on its Fill, every state but disabled): at least **4.5:1**;
- meaningful boundaries (Edge on its Fill, every state but disabled): at least **3:1**, with extra margin where practical;
- disabled controls: exempt from the normal contrast threshold.

These checks cannot prove every consumer's composition accessible. A component tests the **actual rendered** foreground, background, boundary and state indicator it produces. Large text, graphics and focus indicators are judged by their rendered purpose, not forced through an unrelated token-pair test.

Focus, hover, pressed and selected indicators stay perceivable where they are drawn. A same-role Edge on Fill check does not prove a focus ring is visible against every neighbouring surface.

## Shadows and effects

Shadows express depth, separation or emphasis. They are not a second Edge family and carry no blanket 3:1 requirement. A decorative shadow may stay decorative; when a shadow is the **only** cue for a boundary, focus, selection or other information, judge that indicator against the applicable requirement. Choose shadows by effect, never by hunting for a colour that improves contrast.

## Review order

1. **Meaning:** does each Fill, Pen, Edge and Effect token fit the component's meaning and state?
2. **Palette:** do the values keep role identity, state differences and light and dark coherence?
3. **Accessibility:** does the rendered combination meet the applicable WCAG requirement?
4. **Composition:** does it stay correct once composed with the consuming application?

Never reverse steps 1 and 3: swapping in an unrelated token to pass a contrast check makes the system semantically wrong.

## Defects

| Defect | Question | Fix in |
| --- | --- | --- |
| Meaning | Does the component use the wrong family, role or state? | The component |
| Palette | Do the right tokens resolve to poor or misleading values? | The Theme or default palette |
| Accessibility | Does correctly composed presentation fail a requirement? | Usually the palette or the indicator design, never the meaning |
| Composition | Does another stylesheet or framework override the vocabulary? | The presentation or composition boundary |

## Checklist

Before accepting a component or Theme change, confirm that:

- tokens were chosen by meaning, not appearance;
- Fill, Pen and Edge relationships are intentional;
- every effect has a stated purpose;
- light and dark modes keep each role's identity;
- rendered text and meaningful indicators meet their accessibility requirements;
- nothing bypasses the public vocabulary with private variables or hard-coded values.

## How the stylesheet is built

Three locked CSS files carry every token from source to utility; a fourth, generated from the first, lets a scoped element preview a Theme on its own.

| Step | File | Holds | Changed by |
| --- | --- | --- | --- |
| 1 | `assets/css/theme/theme-default.css` | Source `--ui-*` values, with `-light` / `-dark` suffixes where modes differ, in one `:root` block | Locked |
| 2 | `assets/css/theme/theme-api.css` | Stable `--api-*` names: light in `:root`, dark in `html.dark`, mode-free in a second `:root`; sets `color-scheme` | Locked |
| 3 | `assets/css/tailwindcss/tailwind-config.css` | `@theme inline`, mapping Tailwind namespaces to `--api-*`; literal breakpoints; plain `@keyframes` after the block | Locked |
| 4 | `assets/css/theme/theme-scope.css` | Step 2's mappings again on `[data-theme-scope="light" \| "dark"]`, so a scoped element (the editor preview) resolves `--api-*` from its own `--ui-*` values, in its own mode | Generated |

`tests/presentation-lock.test.ts` holds the hashes of steps 1 to 3. `scripts/generate-theme-api.mjs` derives the pipeline from step 1: it verifies steps 1 to 3 on every run but never rewrites them, and it writes step 4. `pnpm check` runs its `--check`, which fails when any file differs from its derivation.

| # | Rule |
| --- | --- |
| C1 | Hand-written CSS reads `--api-*` only, never `--ui-*`: `--ui-*` values have not been through mode selection. |
| C2 | Changing a locked file is a deliberate decision that updates the lock register in the same pull request. |
| C3 | Token names are lowercase segments joined by single hyphens. Tailwind's partner properties (`--text-sm--line-height`, `--font-mono--font-feature-settings`) appear only in `tailwind-config.css`. |
| C4 | `@keyframes` sit outside `@theme`: Tailwind drops theme keyframes it cannot see named in an `--animate-*` value, and ours are `var()` references. |
| C5 | Tailwind's default theme, including its colour palette, stays available underneath (`main.css` imports `tailwindcss` first). Components still use only the Theme's tokens. |
| C6 | Every new token gets an `@RUNTIME` note in `theme-default.css` stating whether a Theme can set it. |

### Light and dark

Dark mappings apply when `<html>` has the `dark` class, and `color-scheme` makes browser controls (scrollbars, inputs, pickers) follow the mode. Theme Manager does not set the class: the host chooses light, dark or system and handles first paint. The editor preview toggles a scoped container, never `<html>`. A layer-owned mode controller is a proposal in the [plan](../PLAN.md).
