import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
  mainColor,
  subColor_Dark,
  subColor_light,
} from 'components/styledComponent'
import { CATEGORY_MAP, FILTERS, YEAR_MONTH_MAP } from 'constants/const'
import {
  IconArrowDown,
  IconHeart,
  IconSearch,
  IconSortDescending,
  IconX,
} from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Home_Input, Home_Search_Div } from 'pages'
import { Loader, Menu } from '@mantine/core'
import CustomPagination from 'components/CustomPagination'
import { menuStyle } from 'pages/mainMap'

export default function Rooms() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const ROOM_TAKE = 9
  const [activePage, setActivePage] = useState<number>(1)
  const [category, setCategory] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  const [filter, setFilter] = useState<string>(FILTERS[0].value)
  const [keyword, setKeyword] = useState<string>(String(router.query.keyword))
  const [search, setSearch] = useState<string>(String(router.query.keyword))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const handleEnterKeypress = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      setSearch(keyword)
      router.replace(`/rooms?keyword=${keyword}`, `/rooms?keyword=${keyword}`, {
        shallow: true,
      })
    }
  }

  const [map, setMap] = useState<kakao.maps.Map | undefined>()
  const [s, setS] = useState<number>(0)
  const [w, setW] = useState<number>(0)
  const [n, setN] = useState<number>(0)
  const [e, setE] = useState<number>(0)
  const [overlay, setOverlay] = useState<{
    id: number | undefined
    isOpened: boolean
  }>({
    id: undefined,
    isOpened: false,
  })
  const [center, setCenter] = useState<{
    lat: number
    lng: number
  }>({ lat: 35.824171, lng: 127.14805 })

  const ROOMS_QUERY_KEY = `/api/room/get-Rooms-Take?keyword=&category_id=${category}&sType_id=${ym}&orderBy=${filter}&s=${s}&w=${w}&n=${n}&e=${e}&take=${ROOM_TAKE}&skip=${
    (activePage - 1) * ROOM_TAKE
  }`
  const { data: rooms, isLoading: roomsLoading } = useQuery<
    { rooms: RoomAllData[] },
    unknown,
    RoomAllData[]
  >([ROOMS_QUERY_KEY], () =>
    fetch(ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const ROOMS_TOTAL_QUERY_KEY = `/api/room/get-Rooms-Total?keyword=&category_id=${category}&sType_id=${ym}&orderBy=${filter}&s=${s}&w=${w}&n=${n}&e=${e}`
  const { data: total } = useQuery<{ total: number }, unknown, number>(
    [ROOMS_TOTAL_QUERY_KEY],
    () =>
      fetch(ROOMS_TOTAL_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => (data.items === 0 ? 1 : data.items)),
    {
      onSuccess: async () => {
        setActivePage(1)
      },
    }
  )

  const ROOMS_ON_MAP_QUERY_KEY = `/api/room/get-Rooms-OnMap?keyword=&category_id=${category}&sType_id=${ym}&orderBy=${filter}`
  const { data: markers } = useQuery<
    { markers: RoomAllData[] },
    unknown,
    RoomAllData[]
  >([ROOMS_ON_MAP_QUERY_KEY], () =>
    fetch(ROOMS_ON_MAP_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const WISHLISTS_QUERY_KEY = '/api/wishlist/get-Wishlists-Id'
  const { data: wishlists } = useQuery<
    { wishlists: number[] },
    unknown,
    number[]
  >([WISHLISTS_QUERY_KEY], () =>
    fetch(WISHLISTS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  useEffect(() => {
    if (!rooms || !search || !map) return

    const ps = new kakao.maps.services.Places()

    ps.keywordSearch(search, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setOverlay({ id: undefined, isOpened: false })
        setCenter({ lat: Number(data[0].y), lng: Number(data[0].x) }) //가장 연관된 keyword 주소를 센터로
        map.setLevel(5)
      }
    })
  }, [search, map, rooms])

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
      onSuccess: async () => {
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
    setTimeout(() => {
      setCenter({ lat: room_lat, lng: room_lng })
      setOverlay({ id: room_id, isOpened: true })
    }, 100)
  }

  const onIdle = (e: kakao.maps.Map) => {
    setS(e.getBounds().getSouthWest().getLat())
    setW(e.getBounds().getSouthWest().getLng())
    setN(e.getBounds().getNorthEast().getLat())
    setE(e.getBounds().getNorthEast().getLng())
    setSearch('')
  }

  return (
    <Rooms_Container>
      <Map
        onCreate={setMap}
        level={6}
        center={{ lat: center.lat, lng: center.lng }}
        style={{
          width: '1000px',
          height: '600px',
          margin: '30px 0 30px 0',
        }}
        disableDoubleClick
        isPanto={true}
        onDragStart={() => setOverlay({ id: undefined, isOpened: false })}
        onZoomStart={() => setOverlay({ id: undefined, isOpened: false })}
        onIdle={(e) => onIdle(e)}
        onTileLoaded={(e) => onIdle(e)}
      >
        <ZoomControl />
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={4} // 클러스터 할 최소 지도 레벨
        >
          {markers?.map((room) => (
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
        {markers?.map((room) => (
          <div key={`Overlay-${room.id}`}>
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
                      sizes="200px"
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
                              : router.push('/login')
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
          </div>
        ))}
      </Map>
      <Room_Menu_div>
        {(filter === 'expensive' || filter === 'cheap') && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '10px',
              fontSize: '13px',
              color: `${subColor_Dark}`,
            }}
          >
            전세 매물은 제외된 리스트입니다.
          </div>
        )}
        <Home_Search_Div style={{ minWidth: '350px' }}>
          <IconSearch size={18} />
          <Home_Input
            style={{ fontSize: '16px' }}
            value={keyword === 'undefined' ? '' : keyword}
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
            <Menu.Item
              style={menuStyle(category, 0)}
              value={'0'}
              onClick={() => setCategory('0')}
            >
              <Center_Div>전체</Center_Div>
            </Menu.Item>
            {CATEGORY_MAP.map((cat, idx) => (
              <Menu.Item
                key={`${cat}-${idx}`}
                value={idx}
                onClick={() => setCategory(String(idx + 1))}
                style={menuStyle(category, idx + 1)}
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
            <Menu.Item
              style={menuStyle(ym, 0)}
              value={0}
              onClick={() => setYm('0')}
            >
              <Center_Div>전체</Center_Div>
            </Menu.Item>
            {YEAR_MONTH_MAP.map((item, idx) => (
              <Menu.Item
                style={menuStyle(ym, idx + 1)}
                key={`${item}-${idx}`}
                value={idx}
                onClick={() => setYm(String(idx + 1))}
              >
                <Center_Div>{item}</Center_Div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <div style={{ marginLeft: 'auto' }} />
        <Menu width={160}>
          <Menu.Target>
            <Hover_Menu>
              정렬 기준
              <IconSortDescending size={15} />
            </Hover_Menu>
          </Menu.Target>
          <Menu.Dropdown>
            {FILTERS.map((item, idx) => (
              <Menu.Item
                style={menuStyle(filter, item.value)}
                key={`${item.label}-${idx}`}
                value={item.value}
                onClick={() => setFilter(item.value)}
              >
                <Center_Div>{item.label}</Center_Div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Room_Menu_div>
      <Grid_Container>
        {roomsLoading ? (
          <Center_Div style={{ width: '1000px', padding: '100px' }}>
            <Loader color="dark" />
          </Center_Div>
        ) : rooms && rooms.length !== 0 ? (
          rooms.map(
            (room) =>
              map
                ?.getBounds()
                .contain(new kakao.maps.LatLng(room.lat, room.lng)) && (
                <div key={`${room}-${room.id}`}>
                  <Center_Div>
                    <StyledImage
                      style={{
                        width: '300px',
                        height: '225px',
                      }}
                    >
                      <Image
                        sizes="300px"
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
                              : router.push('/login')
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
              )
          )
        ) : (
          <Center_Div style={{ width: '1000px', margin: '100px 0 100px 0' }}>
            현재 지도에 등록된 매물이 없습니다.
          </Center_Div>
        )}
      </Grid_Container>
      {total && (
        <Center_Div style={{ margin: '30px 0 30px 0' }}>
          <CustomPagination
            page={activePage}
            onChange={setActivePage}
            total={total === 0 ? 1 : Math.ceil(total / ROOM_TAKE)}
          />
        </Center_Div>
      )}
    </Rooms_Container>
  )
}

const Rooms_Container = styled.div`
  font-size: 17px;
`
const Room_Menu_div = styled(Center2_Div)`
  position: relative;
  column-gap: 60px;
  margin: 30px 0 30px 0;
`

export const Overlay_Container = styled(Center_Div)`
  border: 0.5px solid black;
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
    top: 0px;
    right: -16px;
    z-index: 1;
    background-color: ${mainColor};
    color: ${subColor_light};
    border: 0.5px solid black;
    border-left: none;
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

export const Hover_Menu = styled.div`
  border-bottom: solid 0.5px ${mainColor};
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
    border-bottom: solid 1px ${mainColor};
  }
  padding: 3px 3px 3px 5px;
  font-size: 16px;
  min-width: 100px;
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