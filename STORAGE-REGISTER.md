# Storage Register

> **In short:** the storage Theme Manager currently creates or asks the host to provide, including cookie purpose, lifetime and privacy implications. Proposed mechanisms are not implemented.

## Browser storage

| Key | Mechanism and owner | Purpose and data | Essential for core operation? | Lifetime and scope | Security and consent-relevant facts |
| --- | --- | --- | --- | --- | --- |
| `active-theme-id` | First-party cookie, Theme Manager (`app/composables/useThemeRuntime.ts`) | Stores the selected theme's opaque identifier, not the full theme or user identity; allows selected theme restoration | **No.** The bundled default theme works without it; disabling persistence loses the selected-theme preference between visits. Current code writes it on activation; preventing its use may require an implementation change | `maxAge: 31536000` seconds (365 days); `path: /`; domain not explicitly set (host-only by default) | `SameSite=Lax`; `Secure` and `HttpOnly` not explicitly configured. Client JavaScript reads/writes the cookie. Functional preference; whether consent is required depends on jurisdiction and exemption conditions, to be determined by the host |

No other persistent browser-storage key was identified in the inspected Theme Manager runtime/editor code. Nuxt `useState` keeps effective, preview and error state in application memory; it is not a separate durable browser store. The host or framework may create other cookies, which are not Theme Manager-owned and must be inventoried by their actual owners.

**Lifecycle:** the cookie is set when a theme is activated and cleared on default selection or failed restoration. The selected identifier is sent in HTTP requests under normal browser cookie rules. An inaccessible or invalid theme falls back to the bundled default.

## Server-side persistence

| Mechanism | Responsibility | Data | Retention and controls |
| --- | --- | --- | --- |
| `ThemeRepository` port | Current implementation expects a host-supplied adapter; Theme Manager supplies no built-in store | Canonical serialised `ThemeDefinition` JSON: identity, name, description, versions, timestamps when supplied, ownership, visibility, lifecycle, presentation settings, colour modes and asset references | No expiry, erasure schedule, encryption, tenant isolation or database schema is implemented by this port. The host's adapter and policy currently determine these. This is an ADR-0012 compliance gap, not an approved long-term architecture |

Theme ownership identifiers may relate to people, groups or organisations, so the host must assess personal-data classification and implement retention, erasure and access controls appropriate to the deployed use. Referenced assets are identifiers; the actual files are not stored by Theme Manager.

## Planned, not implemented

The proposed light/dark/system mode cookie in `PLAN.md` does **not** currently exist. Its name, attributes, exact lifetime and consent assessment must be recorded if and when it is implemented.

## Composition and consent

Theme Manager supplies storage facts, not a consent service. The consuming application determines applicable law, notice and consent requirements, including any exemption, withdrawal and changes in purpose. Where consent is necessary, the application must prevent activation until valid consent. This register is not a legal compliance determination.

For the independently usable host integration details, see `CONTRACT.md`.
