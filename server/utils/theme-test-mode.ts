import type { JsonValue, ThemeRepository } from '../../contracts'
import { createCanonicalThemeDefinition } from '../../shared/canonical-theme'
import { parsePersistedTheme, serializeThemeDefinition } from '../../shared/theme-definition'

export function isThemeTestMode(): boolean {
  // Unit tests import the repository outside Nuxt; no runtime config exists there.
  if (typeof useRuntimeConfig !== 'function') return false
  const mode = useRuntimeConfig().themeManager?.mode
  if (mode !== 'test') return false
  if (process.env.NODE_ENV === 'production') throw new Error('Theme Manager test mode is forbidden in production.')
  return true
}

export const TEST_THEME_ACTOR_ID = 'theme-test-admin'
export const TEST_THEME_TEMPLATE_ID = 'theme-test-template'

const themes = new Map<string, JsonValue>([
  [TEST_THEME_TEMPLATE_ID, serializeThemeDefinition(createCanonicalThemeDefinition({
    id: TEST_THEME_TEMPLATE_ID, name: 'Test Template', ownerType: 'user', ownerId: TEST_THEME_ACTOR_ID,
  }))],
])

export const themeTestRepository: ThemeRepository = {
  async findById(id) { return themes.get(id) ?? null },
  async list() { return [...themes.values()] },
  async save(value) { themes.set(parsePersistedTheme(value).id, structuredClone(value)) },
  async delete(id) { themes.delete(id) },
}
