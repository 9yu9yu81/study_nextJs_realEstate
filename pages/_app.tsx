import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Myspot</title>
        <meta name="description" content="My Spot direct transaction" />
      </Head>
      <div>
        <Component {...pageProps} />
      </div>
    </>
  )
}
