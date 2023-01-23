import { useEffect } from 'react'
import { CenteringDiv } from './styledComponent'

export default function Map({
  width,
  height,
  address,
  level,
}: {
  width: string
  height: string
  address?: string
  level?: number
}) {
  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder() // 주소-좌표 반환 객체를 생성

      const addrMarker = (address: string) => {
        // 주소로 좌표를 검색
        geocoder.addressSearch(address, (result: any, status: any) => {
          console.log(address)
          if (status === window.kakao.maps.services.Status.OK) {
            // 정상적으로 검색이 완료됐으면
            var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            // 지도를 생성
            const container = document.getElementById('map')
            const options = {
              center: coords,
              level: level ? level : 3,
            }
            const map = new window.kakao.maps.Map(container, options)
            // 결과값으로 받은 위치를 마커로 표시
            new window.kakao.maps.Marker({
              map: map,
              position: coords,
            })
          } else {
            // 정상적으로 좌표가 검색이 안 될 경우 디폴트 좌표로 검색
            const container = document.getElementById('map')
            const options = {
              center: new window.kakao.maps.LatLng(35.824171, 127.14805),
              level: 6,
            }
            // 지도를 생성
            const map = new window.kakao.maps.Map(container, options)
          }
        })
      }

      addrMarker(address)
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  }, [address])

  return (
    <>
      <CenteringDiv>
        <div
          id="map"
          className=" border border-zinc-500"
          style={{
            width: width,
            height: height,
          }}
        ></div>
      </CenteringDiv>
    </>
  )
}
