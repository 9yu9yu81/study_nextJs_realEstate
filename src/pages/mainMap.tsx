import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { RoomAllData } from './rooms/[id]'

export default function mainMap() {
  const ROOMS_QUERY_KEY = `api/room/get-Rooms`
  const [level, setLevel] = useState<number>(6)
  const [coords, setCoords] = useState<any>({})

  const { data: rooms, isFetched } = useQuery<
    { rooms: RoomAllData[] },
    unknown,
    RoomAllData[]
  >([ROOMS_QUERY_KEY], () =>
    fetch(ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const onLoadKakaoMap = () => {
    kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder()

      const addrConverter = (address: string) => {
        // 주소로 좌표를 검색
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = { lat: result[0].x, lng: result[0].y }
            return coords
          }
        })
      }
    })
  }
  // useEffect(() => {
  //   onLoadKakaoMap()
  // })
  return (
    <Map
      center={{ lat: 35.824171, lng: 127.14805 }}
      level={level}
      style={{ width: '1000px', height: '500px' }}
    >
      {rooms?.map((room) => (
        <MapMarker position={{ lat: room.lat, lng: room.lng }}></MapMarker>
      ))}
    </Map>
  )
}
