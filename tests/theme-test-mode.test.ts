import { describe, expect, it } from 'vitest'
import { createThemeService } from '../server/utils/theme-service'
import { TEST_THEME_TEMPLATE_ID, themeTestRepository } from '../server/utils/theme-test-mode'
import { createCanonicalThemeDefinition } from '../shared/canonical-theme'

describe('Theme Manager test-mode repository', () => {
  it('seeds an editable template', async () => {
    const template = await themeTestRepository.findById(TEST_THEME_TEMPLATE_ID)
    expect(template).toMatchObject({
      id: TEST_THEME_TEMPLATE_ID,
      ownership: { ownerType: 'user', ownerId: 'theme-test-admin' },
      lifecycle: 'draft',
    })
  })

  it('supports create, edit, read and delete using the existing service', async () => {
    const service = createThemeService(themeTestRepository)
    const id = 'test-mode-sample'
    const original = createCanonicalThemeDefinition({ id, ownerType: 'user', ownerId: 'theme-test-admin' })
    try {
      await service.create(original)
      expect((await service.find(id))?.id).toBe(id)
      await service.update(id, { ...original, name: 'Edited' })
      expect((await service.find(id))?.name).toBe('Edited')
    }
    finally {
      await themeTestRepository.delete(id)
    }
    expect(await service.find(id)).toBeNull()
  })
})
