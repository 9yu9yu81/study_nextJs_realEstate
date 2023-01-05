import Head from 'next/head'
import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Myspot</title>
          <meta name="description" content="My Spot direct transaction" />
        </Head>
        <div className="relative">
          <Header />
          <div className="m-5 mt-20">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}
