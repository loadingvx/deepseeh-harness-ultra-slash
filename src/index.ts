/**
 * Ultra Slash host plugin: `/steer`, `/new`, `/skill`, `/docs`, plus
 * user-defined `/name` aliases of `/steer`.
 *
 * `/steer` and the aliases queue through `agent.steer()` and do not cancel
 * the live turn. `/new` only acknowledges on the host; the browser half
 * switches the visible session.
 *
 * @module deepseek-harness-ultra-slash
 */

import type { Context } from '@deepseek-ai/cordis'
import { PLUGIN_NAME } from './command.ts'
import { registerUltraSlashHttp } from './http.ts'
import {
  applyCommands,
  createCommandHub,
  loadHubFromDisk,
  type CommandHub,
} from './register.ts'

export const name = PLUGIN_NAME
export const inject = ['commands']

export { COMMAND_NAME, PLUGIN_NAME, executeSteer } from './command.ts'
export type { CommandHub }

/** Register slash commands and, when the web server is present, the settings API. */
export function apply(ctx: Context): void {
  applyCommands(ctx)
  const hub = createCommandHub(ctx)
  void loadHubFromDisk(hub)

  const injectServices = (ctx as Context & {
    inject?: (deps: string[], callback: (host: Context) => void) => void
  }).inject
  if (typeof injectServices !== 'function') return
  injectServices.call(ctx, ['webServer'], (host) => {
    host.effect(() => {
      const server = host.get('webServer') as
        | { register: Parameters<typeof registerUltraSlashHttp>[0]['register'] }
        | undefined
      if (server === undefined || typeof server.register !== 'function') return () => {}
      return registerUltraSlashHttp(server, hub)
    }, `${PLUGIN_NAME}: http`)
  })
}
