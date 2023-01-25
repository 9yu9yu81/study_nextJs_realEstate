import { Room } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { ROOMS_QUERY_KEY } from 'constants/querykey'
import { useEffect, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

export default function mainMap() {
  const [level, setLevel] = useState<number>(6)
  const [coords, setCoords] = useState<any>({})

  const { data: rooms } = useQuery<{ rooms: Room[] }, unknown, Room[]>(
    [ROOMS_QUERY_KEY],
    () =>
      fetch(ROOMS_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  )
  const onLoadKakaoMap = () => {
    kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder()

      const addrConverter = (address: string, id: number) => {
        // 주소로 좌표를 검색
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            coords[id] = { x: result[0].x, y: result[0].y }
          }
        })
      }

      rooms?.map((room) => addrConverter(room.address, room.id))
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  })
  return (
    <Map
      center={{ lat: 35.824171, lng: 127.14805 }}
      level={level}
      style={{ width: '100%', height: '100vh' }}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: '#000' }}>Hello World!</div>
      </MapMarker>
    </Map>
  )
}
