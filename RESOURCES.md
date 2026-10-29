# Resources

> **In short:** every document outside this repository that its documents rely on, with why and where. This is the only place external links and pins appear, apart from the host contract's own release pin. Other documents name an entry here instead of linking out.

## Relied on

Architecture rules are pinned to `nuxt-layers/architecture-rules` commit `c65a1ea`.

| Entry | What and why | Link |
| --- | --- | --- |
| Layer standard | What a layer is, its repository layout, documentation, manifest (`capability.json`), tests and versioning | [layer standard](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/layer-standard.md) |
| Presentation rules | Ecosystem rules for semantic tokens, language, accessibility and modes that Theme Manager's vocabulary serves | [presentation](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/presentation.md) |
| ADR-0002 | Composition-supplied persistence and capability-owned schemas: why the host supplies the store | [ADR-0002](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0002-composition-supplied-persistence-and-capability-owned-schemas.md) |
| ADR-0004 | Documentation placement: what lives here and how other repositories' documents are named | [ADR-0004](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0004-documentation-placement.md) |
| ADR-0008 | Independent layer delivery: Git-backed, pinned consumption and semantic versioning | [ADR-0008](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0008-independent-layer-delivery.md) |
| ADR-0009 | Headless capability layers: Theme Manager as the only theme authority, and the vocabulary every layer's screens use | [ADR-0009](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0009-headless-capability-layers.md#theme-manager) |
| ADR-0010 | Documentation style: the rules these documents and the Markdown check follow | [ADR-0010](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0010-documentation-style.md) |
| ADR-0012 | Trivial composition: the shared host shapes and the one-page host contract (§6) | [ADR-0012](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/docs/decisions/ADR-0012-trivial-composition.md#6-a-one-page-host-contract) |
| AI-driven development | How the ecosystem's AI-driven, specification-led method works, which governs contributions here | [contributing](https://github.com/nuxt-layers/architecture-rules/blob/c65a1ea76085f756140d6b28f41708e62883dfac/CONTRIBUTING.md) |
| Contributor Covenant | The code of conduct the [Code of Conduct](CODE_OF_CONDUCT.md) adapts, version 2.1 | [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct.html) |
| Platform test harness | The independent consumer that composes Theme Manager through its public boundary ([Persistence](docs/persistence.md)). Its pin is not yet recorded | `steve-r-lewis/platform-test-harness` |

## For the record

Earlier documents this repository has replaced or removed, at `nuxt-layers/theme-manager` commit `5efaef7`.

| Entry | What and why | Link |
| --- | --- | --- |
| Migration record TM-0 to TM-10 | The completed migration programme: audits, target architecture, staged implementation and legacy retirement. Historical, not current contract | [migration archive](https://github.com/nuxt-layers/theme-manager/tree/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/archive/migration) |
| Legacy Theme Manager | The immutable evidence baseline the migration record was checked against, commit `8847e6b`; never modified by it | [legacy-theme-manager](https://github.com/nuxt4-layers/legacy-theme-manager/tree/8847e6b1d8ebbca83f00d17b0cddb18522219c6e) |
| Upgrade guide to v0.2.1 | The v0.1.0 to v0.2.1 upgrade sequence and checklist | [upgrade guide](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/upgrading-to-v0.2.1.md) |
| Contract documents | The three documents [the contract](docs/contract.md) replaced | [public contract](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/contracts.md), [composition contract](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/composition-contract.md), [consumer contract](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/semantic-presentation-consumer-contract.md) |
| Guides before renaming | The guides now named [Presentation](docs/presentation.md), [States](docs/states.md) and [Persistence](docs/persistence.md) | [presentation guide](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/semantic-presentation-guide.md), [interactive state guide](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/interactive-state-design-guide.md), [persistence guide](https://github.com/nuxt-layers/theme-manager/blob/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/persistence-integration-guide.md) |
