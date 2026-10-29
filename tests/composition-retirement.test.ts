import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const read = (path: string) => readFileSync(resolve(root, path), 'utf8')

describe('TM-10 composition and legacy-retirement gate', () => {
  const pkg = JSON.parse(read('package.json')) as {
    exports: Record<string, string>
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const capability = JSON.parse(read('capability.json')) as {
    requires: unknown[]
    publicExports: string[]
  }
  const resources = read('RESOURCES.md')
  const composition = read('docs/contract.md')

  it('records the TM-0 through TM-10 migration and its legacy evidence at immutable commits', () => {
    expect(resources).toContain('nuxt-layers/theme-manager/tree/5efaef7b557278c160c663c31d1efd69f8e9d7a4/docs/archive/migration')
    expect(resources).toContain('nuxt4-layers/legacy-theme-manager/tree/8847e6b1d8ebbca83f00d17b0cddb18522219c6e')
  })

  it('does not depend on legacy, UI, Authentication, Identity or Authorization packages', () => {
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies }
    const names = Object.keys(dependencies)
    expect(names.some(name => /legacy-theme-manager/i.test(name))).toBe(false)
    expect(names).not.toContain('@nuxt4-layers/ui')
    expect(names).not.toContain('@nuxt4-layers/authentication')
    expect(names).not.toContain('@nuxt4-layers/identity')
    expect(names).not.toContain('@nuxt4-layers/authorization')
    expect(capability.requires).toEqual([])
  })

  it('keeps the deliberate public package surface aligned with capability metadata', () => {
    expect(Object.keys(pkg.exports)).toEqual([
      '.',
      './contracts',
      './capability',
      './presentation.css',
    ])
    expect(capability.publicExports).toEqual(Object.keys(pkg.exports))
  })

  it('makes the host application the composition root with pinned consumption', () => {
    expect(composition).toContain('host Nuxt application is the composition root')
    expect(composition).toContain('pinned Git-backed dependency')
    expect(composition).toContain('lockfile records the exact resolved revision')
    expect(composition).toContain('Supplies a `ThemeRepository` adapter')
    expect(composition).toContain('Supplies `ThemeActorContextProvider` and `ThemeAuthorizationService`')
  })
})
