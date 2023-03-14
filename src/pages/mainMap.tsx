import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  Map,
  MapMarker,
  MarkerClusterer,
  ZoomControl,
} from 'react-kakao-maps-sdk'
import { RoomAllData } from './rooms/[id]'
import styled from '@emotion/styled'
import Image from 'next/image'
import { StyledImage } from 'components/styledComponent'
import { CATEGORY_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { IconHeart, IconX } from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function mainMap() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const ROOMS_QUERY_KEY = `api/room/get-Rooms-Take`
  const WISHLISTS_QUERY_KEY = 'api/wishlist/get-Wishlists-Id'

  const [level, setLevel] = useState<number>(6)
  const [overlay, setOverlay] = useState<{
    id: number | undefined
    isOpened: boolean
  }>({
    id: undefined,
    isOpened: false,
  })

  const { data: rooms } = useQuery<
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

  const { data: wishlists } = useQuery<
    { wishlists: number[] },
    unknown,
    number[]
  >([WISHLISTS_QUERY_KEY], () =>
    fetch(WISHLISTS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const { mutate: updateIsWished } = useMutation<unknown, unknown, number, any>(
    (room_id) =>
      fetch('/api/wishlist/update-IsWished', {
        method: 'POST',
        body: JSON.stringify(room_id),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (room_id) => {
        await queryClient.cancelQueries({
          queryKey: [WISHLISTS_QUERY_KEY],
        })
        const previous = queryClient.getQueryData([WISHLISTS_QUERY_KEY])

        queryClient.setQueryData<number[]>([WISHLISTS_QUERY_KEY], (old) =>
          old
            ? wishlists?.includes(room_id)
              ? old.filter((o) => o !== room_id)
              : old.concat(room_id)
            : undefined
        )
        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLISTS_QUERY_KEY], context.previous)
      },
      onSuccess: async (room_id) => {
        queryClient.invalidateQueries([WISHLISTS_QUERY_KEY])
      },
    }
  )

  function heartCheck(
    room_id: number,
    { type }: { type: string }
  ): string | undefined {
    if (status === 'authenticated') {
      if (wishlists?.includes(room_id)) {
        return 'red'
      }
    }
    if (type === 'fill') {
      return 'white'
    }
    return 'grey'
  }

  return (
    <Map
      center={{ lat: 35.824171, lng: 127.14805 }}
      level={level}
      style={{ width: '1000px', height: '500px', margin: '30px 0 30px 0' }}
      disableDoubleClick
    >
      <ZoomControl />
      <MarkerClusterer
        averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel={4} // 클러스터 할 최소 지도 레벨
      >
        {rooms?.map((room) => (
          <MapMarker
            key={`${room.lat}-${room.lng}`}
            position={{
              lat: room.lat,
              lng: room.lng,
            }}
            onClick={() => setOverlay({ id: room.id, isOpened: true })}
            clickable={true}
          >
            {overlay.id === room.id && overlay.isOpened && (
              <Overlay_Container>
                <StyledImage style={{ width: '220px', height: '165px' }}>
                  <Image
                    className="styled"
                    src={room.images.split(',')[0]}
                    fill
                    alt={`${room.name}`}
                    onClick={() => router.push(`rooms/${room.id}`)}
                  />
                </StyledImage>
                <div
                  className="btn x"
                  onClick={() => setOverlay({ id: room.id, isOpened: false })}
                >
                  <IconX size={18} stroke={2} />
                </div>
                <div className="wrapper">
                  <div className="name">
                    {room.name}
                    <div className="btn" style={{ marginLeft: 'auto' }}>
                      <IconHeart
                        size={22}
                        stroke={1.5}
                        color={heartCheck(room.id, { type: 'color' })}
                        fill={heartCheck(room.id, { type: 'fill' })}
                        onClick={() =>
                          status === 'authenticated'
                            ? updateIsWished(room.id)
                            : router.push('auth/login')
                        }
                      />
                    </div>
                  </div>
                  <div className="main">
                    {CATEGORY_MAP[room.category_id - 1]}{' '}
                    {YEAR_MONTH_MAP[room.sType_id - 1]} {room.deposit}
                    {room.sType_id !== 1 && '/' + room.fee}
                  </div>
                  <div>{room.doro}</div>
                </div>
              </Overlay_Container>
            )}
          </MapMarker>
        ))}
      </MarkerClusterer>
    </Map>
  )
}

const Overlay_Container = styled.div`
  width: 220px;
  height: 245px;
  font-size: 15px;
  .wrapper {
    padding: 5px;
  }
  .x {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 1;
    background-color: white;
    border-radius: 2px;
    padding: 1px;
    box-shadow: 0px 0px 2px 0.5px gray inset;
  }
  .name {
    display: flex;
    font-size: 16px;
    font-weight: 600;
  }
  .main {
    display: flex;
    font-weight: 700;
    align-items: center;
  }
  .btn {
    :hover {
      cursor: pointer;
    }
  }
  .heart div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
