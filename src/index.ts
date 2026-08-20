/**
 * Ultra Slash host plugin: `/steer`, `/new`, `/skill`, `/docs`, plus
 * user-defined `/name` aliases of `/steer`.
 *
 * `/steer` and the aliases queue through `agent.steer()` and do not cancel
 * the live turn. `/new` only acknowledges on the host; the browser half
 * switches the visible session.
 *
 * Conflicts are handled by yielding, never by throwing: a leftover
 * ultra-slash install or `dsh-workbench-plugin`'s embedded copy may already
 * own the commands and the `/ultra-slash` HTTP prefix. This plugin skips the
 * contested registration and lets the owner serve it, so the harness always
 * boots. The shared `$DSH_HOME/ultra-slash/commands.json` store is never
 * touched on a yield.
 *
 * @module deepseek-harness-ultra-slash
 */

import type { Context } from '@deepseek-ai/cordis'
import { PLUGIN_NAME } from './command.ts'
import { HTTP_PREFIX, registerUltraSlashHttp } from './http.ts'
import {
  applyCommands,
  createCommandHub,
  loadHubFromDisk,
  yieldHttpPrefixConflict,
  type CommandHub,
  type HubContext,
} from './register.ts'

export const name = PLUGIN_NAME
export const inject = ['commands']

export { COMMAND_NAME, PLUGIN_NAME, executeSteer } from './command.ts'
export type { CommandHub }

/** The webServer route error when the same prefix is registered twice. */
function isDuplicateRoute(error: unknown): boolean {
  return error instanceof Error && /duplicate (exact|prefix|upgrade) route/.test(error.message)
}

/**
 * Register the settings JSON API, standing down when the prefix is already
 * owned (workbench's embedded ultra-slash or a leftover install). The owner's
 * handler serves the same shared store, so the settings page keeps working.
 */
function registerHttpTolerant(
  server: { register(route: { kind: 'prefix'; path: string; handler: (req: unknown, res: unknown) => void | Promise<void> }): () => void },
  hub: CommandHub,
): () => void {
  try {
    return registerUltraSlashHttp(server, hub)
  } catch (error: unknown) {
    if (isDuplicateRoute(error)) {
      yieldHttpPrefixConflict(HTTP_PREFIX)
      return () => {}
    }
    throw error
  }
}

/** Register slash commands and, when the web server is present, the settings API. */
export function apply(ctx: Context): void {
  const host = ctx as unknown as HubContext
  const hub = createCommandHub(host)
  // Register builtins AFTER the hub exists so /skill and /docs read the
  // persisted per-command default prompts at invocation time.
  applyCommands(host, () => hub.defaults())
  void loadHubFromDisk(hub)

  const injectServices = (ctx as Context & {
    inject?: (deps: string[], callback: (host: Context) => void) => void
  }).inject
  if (typeof injectServices !== 'function') return
  injectServices.call(ctx, ['webServer'], (host) => {
    host.effect(() => {
      const server = host.get('webServer') as
        | { register: Parameters<typeof registerHttpTolerant>[0]['register'] }
        | undefined
      if (server === undefined || typeof server.register !== 'function') return () => {}
      return registerHttpTolerant(server, hub)
    }, `${PLUGIN_NAME}: http`)
  })
}
