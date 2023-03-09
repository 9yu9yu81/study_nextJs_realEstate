import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MarkerClusterer,
  ZoomControl,
} from 'react-kakao-maps-sdk'
import { RoomAllData } from './[id]'
import styled from '@emotion/styled'
import Image from 'next/image'
import {
  Center2_Div,
  Center_Div,
  StyledImage,
  subColor_light,
} from 'components/styledComponent'
import { CATEGORY_MAP, FILTERS, YEAR_MONTH_MAP } from 'constants/const'
import {
  IconArrowDown,
  IconCheckbox,
  IconHeart,
  IconSearch,
  IconSortDescending,
  IconX,
} from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Home_Input, Home_Search_Div } from 'pages'
import { Loader, Menu } from '@mantine/core'

export default function Rooms() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [category, setCategory] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  const [filter, setFilter] = useState<string>(FILTERS[0].value)
  const [keyword, setKeyword] = useState<string>(String(router.query.keyword))
  const [search, setSearch] = useState<string>(String(router.query.keyword))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const handleEnterKeypress = (e: React.KeyboardEvent) => {
    //enter 검색
    if (e.key == 'Enter') {
      setSearch(keyword)
      router.replace(`/rooms?keyword=${keyword}`, `/rooms?keyword=${keyword}`, {
        shallow: true,
      })
    }
  }

  const [map, setMap] = useState<any>()
  const [bound, setBound] = useState<{
    sw: { lat: number; lng: number }
    ne: { lat: number; lng: number }
  }>()
  const [level, setLevel] = useState<number>(6)
  const [overlay, setOverlay] = useState<{
    id: number | undefined
    isOpened: boolean
  }>({
    id: undefined,
    isOpened: false,
  })
  const [isPanto, setIsPanto] = useState<boolean>(false)
  const [center, setCenter] = useState<{
    lat: number
    lng: number
  }>({ lat: 35.824171, lng: 127.14805 })

  const ROOMS_QUERY_KEY = `api/room/get-Rooms?keyword=&category_id=${category}&sType_id=${ym}&orderBy=${filter}`
  const WISHLISTS_QUERY_KEY = 'api/wishlist/get-Wishlists-Id'
  const { data: rooms, isLoading } = useQuery<
    { rooms: RoomAllData[] },
    unknown,
    RoomAllData[]
  >([ROOMS_QUERY_KEY], () =>
    fetch(ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  useEffect(() => {
    if (!map) return
    if (!search) return
    kakao.maps.load(() => {
      const ps = new kakao.maps.services.Places()
      const bounds = new kakao.maps.LatLngBounds()

      ps.keywordSearch(search, (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          const b = new kakao.maps.LatLngBounds()
          setCenter({ lat: Number(data[0].y), lng: Number(data[0].x) }) //가장 연관된 keyword 주소를 센터로
        }
      })
    })
    console.log(bound)
  }, [search, map])

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
    return 'gray'
  }

  const openOverlay = (room_id: number, room_lat: number, room_lng: number) => {
    setIsPanto(true)
    setCenter({ lat: room_lat, lng: room_lng })
    setOverlay({ id: room_id, isOpened: true })
  }

  return (
    <Rooms_Container>
      <Map
        onCreate={setMap}
        center={{ lat: center.lat, lng: center.lng }}
        level={level}
        style={{
          width: '1000px',
          height: '600px',
          margin: '30px 0 30px 0',
        }}
        disableDoubleClick
        isPanto={isPanto}
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
              onClick={() => openOverlay(room.id, room.lat, room.lng)}
              clickable={true}
            />
          ))}
        </MarkerClusterer>
        {rooms?.map((room) => (
          <>
            {overlay.id === room.id && overlay.isOpened && (
              <CustomOverlayMap
                zIndex={1}
                position={{
                  lat: room.lat,
                  lng: room.lng,
                }}
                xAnchor={0.5}
                yAnchor={1.16}
              >
                <Overlay_Container>
                  <StyledImage
                    style={{
                      width: '200px',
                      height: '150px',
                    }}
                  >
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
                    <IconX size={14} stroke={2} />
                  </div>
                  <div className="wrapper">
                    <div className="name">
                      <div
                        style={{
                          width: '190px',
                        }}
                      >
                        {room.name}
                      </div>
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
              </CustomOverlayMap>
            )}
          </>
        ))}
      </Map>
      <Room_Menu_div>
        <Home_Search_Div style={{ width: '350px' }}>
          <IconSearch size={18} />
          <Home_Input
            style={{ fontSize: '16px' }}
            value={keyword}
            onChange={handleChange}
            placeholder="주소나 건물명을 입력하세요"
            onKeyUp={handleEnterKeypress}
          />
        </Home_Search_Div>
        <Menu width={160}>
          <Menu.Target>
            <Hover_Menu>
              매물 종류
              <IconArrowDown size={15} />
            </Hover_Menu>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item value={'0'} onClick={() => setCategory('0')}>
              <Center_Div>전체</Center_Div>
            </Menu.Item>
            {CATEGORY_MAP.map((cat, idx) => (
              <Menu.Item
                key={`${cat}-${idx}`}
                value={idx}
                onClick={() => setCategory(String(idx + 1))}
              >
                <Center_Div>{cat}</Center_Div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Menu width={160}>
          <Menu.Target>
            <Hover_Menu>
              전세/월세
              <IconArrowDown size={15} />
            </Hover_Menu>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item value={0} onClick={() => setYm('0')}>
              <Center_Div>전체</Center_Div>
            </Menu.Item>
            {YEAR_MONTH_MAP.map((cat, idx) => (
              <Menu.Item
                key={`${cat}-${idx}`}
                value={idx}
                onClick={() => setYm(String(idx + 1))}
              >
                <Center_Div>{cat}</Center_Div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Menu width={160}>
          <Menu.Target>
            <Hover_Menu>
              세부 사항
              <IconCheckbox size={15} />
            </Hover_Menu>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>checkbox modal</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu width={160}>
          <Menu.Target>
            <Hover_Menu>
              정렬 기준
              <IconSortDescending size={15} />
            </Hover_Menu>
          </Menu.Target>
          <Menu.Dropdown>
            {FILTERS.map((filter, idx) => (
              <Menu.Item
                key={`${filter}-${idx}`}
                value={filter.value}
                onClick={() => setFilter(filter.value)}
              >
                <Center_Div>{filter.label}</Center_Div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Room_Menu_div>
      <Grid_Container>
        {isLoading ? (
          <Center_Div style={{ width: '1000px', margin: '100px 0 100px 0' }}>
            <Loader color="dark" />
          </Center_Div>
        ) : rooms ? (
          rooms.map((room, idx) => (
            // (room.lat > bounds)
            <div key={`${room}-${idx}`}>
              <Center_Div>
                <StyledImage
                  style={{
                    width: '300px',
                    height: '225px',
                  }}
                >
                  <Image
                    className="styled"
                    src={room.images.split(',')[0]}
                    alt={'thumbnail'}
                    fill
                    onClick={() => router.push(`rooms/${room.id}`)}
                  />
                </StyledImage>
              </Center_Div>
              <div className="description">
                <div className="name">
                  {room.name} {room.area}평
                  <div className="heart">
                    <IconHeart
                      size={26}
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
                <div>{room.title}</div>
              </div>
            </div>
          ))
        ) : (
          <Center_Div>등록된 매물이 없습니다.</Center_Div>
        )}
      </Grid_Container>
    </Rooms_Container>
  )
}
const Rooms_Container = styled.div`
  font-size: 17px;
`
const Room_Menu_div = styled(Center2_Div)`
  column-gap: 60px;
  margin: 30px 0 30px 0;
`

const Overlay_Container = styled(Center_Div)`
  border: 1px solid black;
  background-color: ${subColor_light};
  flex-flow: column;
  width: 220px;
  height: 255px;
  font-size: 15px;
  .wrapper {
    width: 220px;
    padding: 15px 15px 0 15px;
  }
  .x {
    position: absolute;
    top: 1px;
    right: -16px;
    z-index: 1;
    background-color: white;
    border-radius: 2px;
    padding: 1px;
    box-shadow: 0px 0px 1px 0.4px gray inset;
  }
  .name {
    display: flex;
    font-size: 15px;
    font-weight: 600;
  }
  .main {
    font-size: 16px;
    font-weight: 700;
  }
  .btn {
    :hover {
      cursor: pointer;
    }
  }
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Hover_Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
    border-bottom: solid 1px black;
  }
  padding: 3px 3px 3px 5px;
  font-size: 16px;
`
const Grid_Container = styled.div`
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 50px;
  grid-column-gap: 30px;
  * {
    font-size: 15px;
  }
  .main {
    display: flex;
    font-size: 20px;
    font-weight: 700;
    align-items: center;
  }
  .heart {
    margin-left: auto;
    :hover {
      cursor: pointer;
    }
  }
  .description {
    margin: 10px 7px 0 7px;
  }
  .name {
    font-size: 16px;
    display: flex;
  }
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
