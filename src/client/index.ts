/**
 * Browser half: ultra-slash `/` group, `/new` session switch, and the
 * settings page for custom `/steer` aliases.
 */
import { createElement as h } from 'react'
import { PLUGIN_NAME } from '../command.ts'
import { LOCALE_NS, en, zh } from '../locales.ts'
import {
  findCommandSource,
  installCommandSourceFilter,
  patchSlashMenuGroupTitle,
  PLUGIN_SLASH_DIVIDER_CSS,
  PLUGIN_SLASH_NAMES,
  PLUGIN_SLASH_ORDER,
  PLUGIN_SLASH_SOURCE,
  pluginSlashCandidates,
  type LocaleRegistry,
  type SlashTriggerService,
} from '../slash-menu.ts'
import { createCatalogCache } from './catalog-api.ts'
import { installNewSessionBridge, startNewSession } from './new-session.ts'
import { SettingsSection } from './SettingsSection.tsx'

const DIVIDER_STYLE_ID = `${PLUGIN_NAME}-divider`

export const name = PLUGIN_NAME
export const inject = ['inputTriggers', 'locale', 'slots']

interface LocaleFace extends LocaleRegistry {
  bind?: (ns: string) => (key: string, vars?: Record<string, string | number>) => string
  register: (ns: string, localeOrDicts: unknown, dict?: unknown) => unknown
  subscribe?: (listener: () => void) => () => void
  getSnapshot?: () => { active?: string }
}

interface SlotsFace {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: unknown): unknown
}

interface UltraSlashClientContext {
  effect(fn: () => (() => void) | void, label?: string): void
  get(name: string): unknown
  inputTriggers?: SlashTriggerService
  locale?: LocaleFace
  slots?: SlotsFace
}

function injectDividerStyle(): () => void {
  if (typeof document === 'undefined') return () => {}
  if (document.getElementById(DIVIDER_STYLE_ID) !== null) return () => {}
  const tag = document.createElement('style')
  tag.id = DIVIDER_STYLE_ID
  tag.textContent = PLUGIN_SLASH_DIVIDER_CSS
  document.head.appendChild(tag)
  return () => {
    tag.remove()
  }
}

function resolveLocale(ctx: UltraSlashClientContext): LocaleFace | undefined {
  const fromField = ctx.locale
  if (fromField !== undefined && typeof fromField.bind === 'function') return fromField
  const fromGet = ctx.get('locale')
  if (fromGet !== null && typeof fromGet === 'object' && 'bind' in fromGet) {
    return fromGet as LocaleFace
  }
  return undefined
}

function bindMenuTranslate(locale: LocaleFace | undefined): (key: string, vars?: Record<string, string | number>) => string {
  if (locale?.bind !== undefined) return locale.bind(LOCALE_NS)
  return (key, vars) => {
    const template = zh[key as keyof typeof zh] ?? key
    if (vars === undefined) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      Object.hasOwn(vars, name) ? String(vars[name]) : match)
  }
}

function resolveTriggerService(ctx: UltraSlashClientContext): SlashTriggerService | undefined {
  const fromField = ctx.inputTriggers
  if (fromField !== undefined && typeof fromField.registerSource === 'function') return fromField
  const fromGet = ctx.get('inputTriggers')
  if (fromGet !== null && typeof fromGet === 'object' && 'registerSource' in fromGet) {
    return fromGet as SlashTriggerService
  }
  return undefined
}

function resolveSlots(ctx: UltraSlashClientContext): SlotsFace | undefined {
  if (ctx.slots !== undefined && typeof ctx.slots.inject === 'function') return ctx.slots
  const fromGet = ctx.get('slots')
  if (fromGet !== null && typeof fromGet === 'object' && 'inject' in fromGet) {
    return fromGet as SlotsFace
  }
  return undefined
}

function syncHiddenNames(
  hidden: Set<string>,
  customNames: readonly string[],
): void {
  hidden.clear()
  for (const name of PLUGIN_SLASH_NAMES) hidden.add(name)
  for (const name of customNames) hidden.add(name)
}

/** Register the ultra-slash group, /new bridge, and settings section. */
export function apply(ctx: UltraSlashClientContext): void {
  const inputTriggers = resolveTriggerService(ctx)
  if (inputTriggers === undefined) return

  const locale = resolveLocale(ctx)
  const cache = createCatalogCache()
  const hiddenNames = new Set(PLUGIN_SLASH_NAMES)
  void cache.refresh().then((result) => {
    if (result.ok) syncHiddenNames(hiddenNames, result.commands.map((command) => command.name))
  })
  ctx.effect(() => cache.subscribe(() => {
    syncHiddenNames(hiddenNames, cache.list().map((command) => command.name))
  }), `${PLUGIN_NAME}: hidden names`)

  ctx.effect(() => {
    if (locale === undefined) return () => {}
    const undoTitle = patchSlashMenuGroupTitle(locale)
    const undoDicts = typeof locale.register === 'function'
      ? locale.register(LOCALE_NS, { zh, en })
      : undefined
    return () => {
      if (typeof undoDicts === 'function') undoDicts()
      undoTitle()
    }
  }, `${PLUGIN_NAME}: locale`)

  ctx.effect(() => injectDividerStyle(), `${PLUGIN_NAME}: slash divider`)

  ctx.effect(() => {
    const t = bindMenuTranslate(locale)
    const source = {
      trigger: '/' as const,
      name: PLUGIN_SLASH_SOURCE,
      order: PLUGIN_SLASH_ORDER,
      candidates: (
        _session: unknown,
        req: { query: string; position: 'leading' | 'inline'; signal: AbortSignal },
      ) => Promise.resolve(pluginSlashCandidates(
        req.query,
        req.position === 'leading',
        t,
        cache.list(),
      )),
      onPick: (pick: unknown) => {
        const command = findCommandSource(inputTriggers)
        if (command !== undefined) return command.onPick(pick)
        const candidate = (pick as { candidate?: { name?: string } } | null)?.candidate
        const commandName = typeof candidate?.name === 'string' ? candidate.name : ''
        if (commandName === '') return undefined
        return { text: `/${commandName} ` }
      },
    }
    const unregister = inputTriggers.registerSource(source)
    return () => {
      unregister()
    }
  }, `${PLUGIN_NAME}: ultra-slash source`)

  ctx.effect(
    () => installCommandSourceFilter(inputTriggers, hiddenNames),
    `${PLUGIN_NAME}: hide plugin names from 命令`,
  )

  ctx.effect(
    () => installNewSessionBridge(inputTriggers, () => {
      startNewSession((name) => ctx.get(name))
    }),
    `${PLUGIN_NAME}: /new session`,
  )

  const slots = resolveSlots(ctx)
  if (slots !== undefined) {
    ctx.effect(() => {
      const t = bindMenuTranslate(locale)
      slots.inject('settings.section', () => slots.register({
        name: 'settings.section',
        id: 'ultra-slash',
        order: 28,
        label: () => t('settings.nav'),
        locale: LOCALE_NS,
      }, () => h(SettingsSection, {
        t,
        locale: locale?.getSnapshot?.()?.active === 'en' ? 'en' : 'zh',
        cache,
      })))
      return () => {}
    }, `${PLUGIN_NAME}: settings`)
  }
}
