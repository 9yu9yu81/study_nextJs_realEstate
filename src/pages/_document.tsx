import { KAKAOMAP_KEY } from 'constants/googleAuth'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP_KEY}&autoload=false&libraries=services,clusterer,drawing`}
        />
        <Script
          strategy="beforeInteractive"
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
