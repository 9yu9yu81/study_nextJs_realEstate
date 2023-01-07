import { KAKAOMAP_KEY } from 'constants/googleAuth'
import Head from 'next/head'
import Script from 'next/script'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function Map() {
  const [level, setLevel] = useState(8) //지도레벨
  const mapRef = useRef<HTMLDivElement>(null) // 지도 ref

  const initMap = useCallback(() => {
    if (mapRef.current) {
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(37.5173319258532, 127.047377408384),
        level: level,
      })
    }
  }, [])

  useEffect(() => {
    if (window?.kakao) {
      initMap()
    }
  }, [initMap])
  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP_KEY}&autoload=false`}
        onLoad={() => kakao.maps.load(initMap)}
      />
      <Head>
        <link rel="preconnect" href="https://dapi.kakao.com" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
      </Head>
      <div className="flex justify-center items-center">
        <div
          id="map"
          className="border-solid border border-zinc-500"
          ref={mapRef}
          style={{
            width: '95vw',
            height: '90vh',
          }}
        ></div>
      </div>
    </>
  )
}
