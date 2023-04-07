import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultUser & {
      id: string
    }
  }
}

declare global {
  interface Window {
    daum: any
  }
}
