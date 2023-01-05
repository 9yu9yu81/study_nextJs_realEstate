import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from 'lib/prismadb'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'constants/googleAuth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 1 * 24 * 60 * 60,
  },

  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id
      return Promise.resolve(session)
    },
  },
}
export default NextAuth(authOptions)
