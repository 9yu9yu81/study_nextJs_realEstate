import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session extends Session {
    user: NextAuth & {
      id: string
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_CLIENT_ID: string
      KAKAOMAP_KEY: string
    }
  }
}
