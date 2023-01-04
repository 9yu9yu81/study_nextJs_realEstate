import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from 'lib/prismadb'
import * as GoogleAuth from 'constants/googleAuth'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GoogleAuth.GOOGLE_CLIENT_ID,
      clientSecret: GoogleAuth.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
