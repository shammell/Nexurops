import type { Session } from 'next-auth'

export interface Context {
  session: Session | null
}

export function createContext({ session }: { session: Session | null }): Context {
  return {
    session,
  }
}
