import { Room } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Center_Div } from 'components/styledComponent'
import { ROOMS_QUERY_KEY } from 'constants/querykey'
import { useEffect, useRef, useState } from 'react'

export default function Maptest() {
  // get All Rooms data
  const { data: rooms } = useQuery<{ rooms: Room[] }, unknown, Room[]>(
    [ROOMS_QUERY_KEY],
    () =>
      fetch(ROOMS_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  )
  //marker 객체를 저장할 객체(room id 를 key 로)
  const [markers] = useState<any>({})
  const [clusterRoomIds, setClusterRoomIds] = useState<number[] | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<any | null>(null)
  const onLoadKakaoMap = () => {
    kakao.maps.load(() => {
      // 주소-좌표 반환 객체를 생성
      const geocoder = new kakao.maps.services.Geocoder()

      //initial map (전주시청)
      const container = mapRef.current
      const options = {
        center: new kakao.maps.LatLng(35.824171, 127.14805),
        level: 6,
      }
      const map = container && new kakao.maps.Map(container, options)

      // 마커 클러스터러를 생성
      const clusterer =
        map &&
        new kakao.maps.MarkerClusterer({
          map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
          averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel: 4, // 클러스터 할 최소 지도 레벨
          disableClickZoom: true,
        })

      //마커 추가 함수
      const addMarker = (position: any, id: number) => {
        // 마커를 생성
        const marker = new kakao.maps.Marker({
          position: position,
        })
        // 생성된 마커를 배열에 추가 (room id 를 key로)
        markers[id] = marker
        // 생성된 마커를 클러스터러에 추가
        clusterer?.addMarker(markers[id])

        // 생성된 마커에 커스텀 오버레이 적용
        var customOverlay = new kakao.maps.CustomOverlay({
          clickable: true,
          position: marker.getPosition(),
        })
        //생성된 마커에 클릭 이벤트 적용
        kakao.maps.event.addListener(marker, 'click', function () {
          console.log(id)
          customOverlay.setMap(map)
        })

        var content = document.createElement('div')
        content.className = 'overlay'
        content.innerHTML = `${id}`

        var closeBtn = document.createElement('button')
        closeBtn.innerHTML = '닫기'
        closeBtn.onclick = function () {
          customOverlay.setMap(null)
        }
        content.appendChild(closeBtn)
      }

      //주소 변환 함수 -> 마커 생성
      const addrMarker = (id: number, address: string) => {
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            addMarker(new kakao.maps.LatLng(result[0].y, result[0].x), id)
          }
        })
      }
      //
      rooms?.map((room) => addrMarker(room.id, room.address))

      clusterer &&
        kakao.maps.event.addListener(
          clusterer,
          'clusterclick',
          function (cluster: any) {
            setClusterRoomIds([])
            for (const roomId in markers) {
              for (var i = 0; i < cluster._markers.length; i++) {
                markers[roomId] === cluster._markers[i] &&
                  rooms?.map(
                    (room) =>
                      Number(roomId) === room.id &&
                      clusterRoomIds?.push(room.id)
                  )
              }
            }
            console.log(clusterRoomIds)
          }
        )
    })
  }

  useEffect(() => {
    onLoadKakaoMap()
  }, [rooms])

  return (
    <>
      <Center_Div>
        <div
          id="map"
          ref={mapRef}
          style={{ width: '100vw', height: '92vh' }}
        ></div>
        <button ref={overlayRef}>hi</button>
      </Center_Div>
    </>
  )
}
