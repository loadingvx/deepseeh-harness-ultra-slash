import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import * as plugin from '../src/index.ts'
import { apply, executeSteer } from '../src/index.ts'
import { withConflictSink, type YieldedConflict } from '../src/register.ts'
import type { SteerAgent, SteerCommandDefinition, SteerInvocation } from '../src/types.ts'

function agent(status: SteerAgent['status'], steer: SteerAgent['steer'] = vi.fn()): SteerAgent {
  return { status, steer }
}

function invocation(
  rawInput: string,
  options: {
    status?: SteerAgent['status']
    steer?: SteerAgent['steer']
    signal?: AbortSignal
  } = {},
): { invocation: SteerInvocation; steer: SteerAgent['steer'] } {
  const steer = options.steer ?? vi.fn()
  return {
    steer,
    invocation: {
      agent: agent(options.status ?? 'running', steer),
      rawInput,
      signal: options.signal ?? new AbortController().signal,
    },
  }
}

describe('plugin exports', () => {
  it('declares a commands-injected host plugin with no default export', () => {
    expect(plugin.name).toBe('deepseek-harness-ultra-slash')
    expect(plugin.inject).toEqual(['commands'])
    expect('default' in plugin).toBe(false)
  })
})

describe('executeSteer', () => {
  it('does not call steer or cancel when the suffix is empty', () => {
    const { invocation: call, steer } = invocation('   ')
    const result = executeSteer(call)
    expect(result.kind).toBe('error')
    expect(result.text).toContain('用法：/steer')
    expect(steer).not.toHaveBeenCalled()
  })

  it('does not queue when the UI aborted first', () => {
    const controller = new AbortController()
    controller.abort()
    const { invocation: call, steer } = invocation('改方向', { signal: controller.signal })
    expect(executeSteer(call)).toEqual({
      kind: 'error',
      text: '引导已取消，没有注入给模型。',
    })
    expect(steer).not.toHaveBeenCalled()
  })

  it('queues waking next-step input without touching cancel', () => {
    const { invocation: call, steer } = invocation('  先不要改代码  ', { status: 'running' })
    const result = executeSteer(call)
    expect(result.kind).toBe('success')
    expect(result.text).toContain('不会被打断')
    expect(result.text).toContain('先不要改代码')
    expect(steer).toHaveBeenCalledTimes(1)
    const message = vi.mocked(steer).mock.calls[0]?.[0]
    expect(message).toMatchObject({
      role: 'user',
      source: { kind: 'user' },
      content: [{ type: 'text', text: '先不要改代码' }],
    })
    expect(message?.id).toEqual(expect.any(String))
    expect(call.agent).not.toHaveProperty('cancel')
  })

  it('says a new step will start when the agent is idle', () => {
    const { invocation: call } = invocation('继续', { status: 'idle' })
    const result = executeSteer(call)
    expect(result.kind).toBe('success')
    expect(result.text).toContain('即将开始下一步')
  })

  it('reports a steer failure and does not pretend the text was queued', () => {
    const steer = vi.fn(() => {
      throw new Error('agent disposed')
    })
    const { invocation: call } = invocation('转向', { steer })
    const result = executeSteer(call)
    expect(result.kind).toBe('error')
    expect(result.text).toContain('agent disposed')
    expect(result.text).toContain('没有被打断')
  })

  it('queues each call independently so repeated /steer is safe', () => {
    const steer = vi.fn()
    const first = invocation('第一句', { steer, status: 'running' })
    const second = invocation('第二句', { steer, status: 'running' })
    expect(executeSteer(first.invocation).kind).toBe('success')
    expect(executeSteer(second.invocation).kind).toBe('success')
    expect(steer).toHaveBeenCalledTimes(2)
    expect(vi.mocked(steer).mock.calls[0]?.[0].content[0]?.text).toBe('第一句')
    expect(vi.mocked(steer).mock.calls[1]?.[0].content[0]?.text).toBe('第二句')
  })
})

describe('apply()', () => {
  it('registers shipped commands and removes them on dispose', async () => {
    const home = await mkdtemp(join(tmpdir(), 'ultra-slash-apply-'))
    vi.stubEnv('DSH_HOME', home)
    const registered: SteerCommandDefinition[] = []
    const disposers: Array<() => void> = []
    const ctx = {
      get() { return undefined },
      commands: {
        register(definition: SteerCommandDefinition) {
          registered.push(definition)
          const dispose = (): void => {
            const index = registered.indexOf(definition)
            if (index >= 0) registered.splice(index, 1)
          }
          disposers.push(dispose)
          return dispose
        },
      },
    }
    apply(ctx as unknown as Context)
    expect(registered.map((row) => row.name)).toEqual(['steer', 'new', 'skill', 'docs'])
    expect(registered[0]?.description).toBe('Inject guidance into the next model step without interrupting the turn')
    expect(registered[0]?.input).toEqual({ hint: '<guidance>' })

    const steer = vi.fn()
    const result = registered[0]?.handler({
      agent: agent('running', steer),
      rawInput: '只看 diff',
      signal: new AbortController().signal,
    })
    expect(result?.kind).toBe('success')
    expect(steer).toHaveBeenCalledTimes(1)

    while (disposers.length > 0) disposers.pop()?.()
    expect(registered).toHaveLength(0)
    vi.unstubAllEnvs()
  })
  it('stands down for the /ultra-slash HTTP prefix when the webServer already owns it', async () => {
    const home = await mkdtemp(join(tmpdir(), 'ultra-slash-http-yield-'))
    vi.stubEnv('DSH_HOME', home)
    const registered: SteerCommandDefinition[] = []
    const ctx = {
      get() { return undefined },
      commands: {
        register(definition: SteerCommandDefinition) {
          registered.push(definition)
          return () => {}
        },
      },
      effect() { return () => {} },
      inject: (_deps: string[], callback: (host: {
        effect(fn: () => unknown): () => void
        get(name: string): unknown
      }) => void) => {
        // The workbench already registered the same prefix; webServer throws
        // like the real implementation on the second registration.
        const host = {
          effect: (fn: () => unknown) => {
            fn()
            return () => {}
          },
          get(name: string) {
            if (name !== 'webServer') return undefined
            return {
              register() {
                throw new Error('webserver: duplicate prefix route \"/ultra-slash\"')
              },
            }
          },
        }
        callback(host)
      },
    } as unknown as Context
    const conflicts: YieldedConflict[] = []
    const restore = withConflictSink((conflict) => conflicts.push(conflict))
    try {
      expect(() => apply(ctx)).not.toThrow()
    } finally {
      restore()
    }
    expect(conflicts.some((c) => c.resource === 'http-prefix' && c.path === '/ultra-slash')).toBe(true)
    vi.unstubAllEnvs()
  })
})
