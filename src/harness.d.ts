/**
 * Minimal Host types used by this plugin. The running DeepSeek Harness
 * profile supplies the real modules; these declarations keep local typecheck
 * and tests independent of a full harness install.
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { SteerCommandDefinition } from './types.ts'

declare module '@deepseek-ai/cordis' {
  export interface Context {
    get(name: string): unknown
    effect(fn: () => (() => void) | void, label?: string): void
    inject(deps: string[], callback: (ctx: Context) => void): void
    commands: {
      register(definition: SteerCommandDefinition): () => void
    }
    webServer?: {
      register(route: {
        kind: 'exact' | 'prefix'
        path: string
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
      }): () => void
    }
  }
}
