import Head from 'next/head'
import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'
import { KAKAOMAP_KEY } from 'constants/googleAuth'

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
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP_KEY}&autoload=false&libraries=services`}
        />
        <div className="relative">
          <Header />
          <div className="flex justify-center">
            <div className="m-5 w-full" style={{ maxWidth: '1000px' }}>
              <Component {...pageProps} />
              <Footer />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}
