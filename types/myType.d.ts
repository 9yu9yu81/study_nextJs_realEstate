import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session extends Session {
    user: NextAuth & {
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
      GOOGLE_SECRET: string
      GOOGLE_ID: string
      NEXT_PUBLIC_KAKAOMAP_APPKEY: string
    }
  }
}
