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

  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_CLIENT_ID: string
      NEXT_PUBLIC_KAKAOMAP_APPKEY: string
    }
  }
}
