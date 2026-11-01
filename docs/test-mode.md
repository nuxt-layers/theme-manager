# Theme Manager test mode

> **In short:** independently exercise existing Theme Manager screens and management APIs without installing IAM or configuring a database.

Test mode is an **explicit development-only** facility. It uses the same HTTP handlers and management services as the existing IAM composition.

In a local Nuxt consumer, add:

```ts
export default defineNuxtConfig({
  extends: ['@nuxt4-layers/theme-manager'],
  runtimeConfig: {
    themeManager: { mode: 'test' },
  },
})
```

Visit `/theme-manager`, choose **Create Theme**, edit and save, then select, edit and delete the resulting theme. The test mode starts with an editable `theme-test-template`, provides a single test actor (`theme-test-admin`) and an in-memory store. All test actions are permitted; real IAM is **not** consulted. The store resets on process restart and is not a durable database.

Test mode must **only be used on an isolated local development server**. Its management endpoints are not authenticated. It throws when activated with `NODE_ENV=production`. Never enable it in a publicly exposed development environment.

Without `runtimeConfig.themeManager.mode='test'`, the existing host-supplied repository and IAM behaviour remains unchanged.

This is the first increment towards four independently specified modes (`static`, `standalone`, `iam`, `test`). The other modes are not implemented by this PR.
