import Head from 'next/head'
import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { SessionProvider, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'
import { KAKAOMAP_KEY } from 'constants/googleAuth'
import { Loader } from '@mantine/core'
import { CenteringDiv } from 'components/styledComponent'

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
          <div className="flex justify-center">
            <div className="w-full" style={{ maxWidth: '1000px' }}>
              <Auth>
                <Component {...pageProps} />
              </Auth>
              <Footer />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}

function Auth({ children }: { children: any }) {
  const { status } = useSession()
  if (status === 'loading') {
    return (
      <CenteringDiv className="m-72">
        <Loader />
      </CenteringDiv>
    )
  }
  return children
}