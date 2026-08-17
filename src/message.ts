import type { SteerUserMessage } from './types.ts'

/** Build one user-role next-step message. Shape matches DSH `createUserMessage`. */
export function createSteerMessage(text: string): SteerUserMessage {
  const message: SteerUserMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: [{ type: 'text', text }],
    source: { kind: 'user' },
  }
  return Object.freeze(message)
}
