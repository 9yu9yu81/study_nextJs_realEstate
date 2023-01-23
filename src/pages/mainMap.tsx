import { Room } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { CenteringDiv } from 'components/styledComponent'
import { ROOMS_QUERY_KEY } from 'constants/querykey'
import { useEffect, useState } from 'react'

export default function Map() {
  // get All Rooms data
  const { data: rooms } = useQuery<{ rooms: Room[] }, unknown, Room[]>(
    [ROOMS_QUERY_KEY],
    () =>
      fetch(ROOMS_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  )
  const [markers, setMarkers] = useState<any>([])

  const onLoadKakaoMap = () => {
    kakao.maps.load(() => {
      // 주소-좌표 반환 객체를 생성
      const geocoder = new kakao.maps.services.Geocoder()

      //initial map (전주시청)
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(35.824171, 127.14805),
        level: 6,
      }
      const map = new kakao.maps.Map(container, options)

      // 마커 클러스터러를 생성
      var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 4, // 클러스터 할 최소 지도 레벨
        disableClickZoom: true,
      })

      //마커 추가
      function addMarker(position: any) {
        // 마커를 생성
        var marker = new kakao.maps.Marker({
          position: position,
        })
        // 생성된 마커를 배열에 추가
        markers.push(marker)
        // 생성된 마커를 클러스터러에 추가
        clusterer.addMarker(marker)
      }

      //make marker (addr -> coords)
      const addrMarker = (address?: string) => {
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            addMarker(new kakao.maps.LatLng(result[0].y, result[0].x))
          }
        })
      }

      rooms?.map((room) => addrMarker(room.address))
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  })

  return (
    <>
      <CenteringDiv>
        <div id="map" style={{ width: '100vw', height: '92vh' }}></div>
      </CenteringDiv>
    </>
  )
}
