import Head from 'next/head'
import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { scheduleJob } from 'node-schedule'
import { useRouter } from 'next/router'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })
  scheduleJob('0 0 * * *', function () {
    fetch(`${process.env.NEXTAUTH_URL}/api/room/update-ExpiredRooms`)
      .then((res) => res.json())
      .then((data) => data.items)
  })
  const router = useRouter()
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Myspot</title>
          <meta name="description" content="My Spot direct transaction" />
        </Head>
        {router.pathname === '/mainMap' ? (
          <div>
            <Component {...pageProps} />
          </div>
        ) : (
          <>
            <Header />
            <div className="flex justify-center">
              <div style={{ maxWidth: '1000px', width: '100%' }}>
                <Component {...pageProps} />
                <Footer />
              </div>
            </div>
          </>
        )}
      </QueryClientProvider>
    </SessionProvider>
  )
}

// function Auth({ children }: { children: any }) {
//   const { status } = useSession()
//   if (status === 'loading') {
//     return (
//       <Center_Div className="m-72">
//         <Loader />
//       </Center_Div>
//     )
//   }
//   return children
// }