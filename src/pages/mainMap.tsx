import { Room } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { CenteringDiv } from 'components/styledComponent'
import { ROOMS_QUERY_KEY } from 'constants/querykey'
import { useEffect } from 'react'

export default function Map() {
  // get All Rooms data
  const { data: rooms } = useQuery<{ rooms: Room[] }, unknown, Room[]>(
    [ROOMS_QUERY_KEY],
    () =>
      fetch(ROOMS_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  )

  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder() // 주소-좌표 반환 객체를 생성

      //make marker
      const addrMarker = (address?: string) => {
        // addr => coords
        geocoder.addressSearch(address, (result: any, status: any) => {
          console.log(address)
          if (status === window.kakao.maps.services.Status.OK) {
            //if searching -> success
            var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            // -> make marker
            new window.kakao.maps.Marker({
              map: map,
              position: coords,
            })
          }
        })
      }

      //print
      rooms?.map((room) => addrMarker(room.address))

      //print default position
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(35.824171, 127.14805),
        level: 6,
      }
      const map = new window.kakao.maps.Map(container, options)
      //print default position marker
      new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(35.824171, 127.14805),
      })
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  }, [])

  return (
    <>
      <CenteringDiv>
        <div
          id="map"
          className=" border border-zinc-500"
          style={{
            width: '100vw',
            height: '90vh',
          }}
        ></div>
      </CenteringDiv>
    </>
  )
}
