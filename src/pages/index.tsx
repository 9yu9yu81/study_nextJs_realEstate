import { Card, Loader } from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconSearch,
} from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Center2_Div,
  Center_Div,
  StyledImage,
  mainColor,
  subColor_medium,
} from 'components/styledComponent'
import { CATEGORY_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useDebounce from 'hooks/useDebounce'
import styled from '@emotion/styled'
import { ManagedRoom } from './upload'
import Carousel from 'nuka-carousel'

//todo myspot analytics 에 어떤 내용 들어갈지도 생각 해봐야함

export default function Home() {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const router = useRouter()

  const [category, setCategory] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  const [keyword, setKeyword] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value) //검색어가 변경되었을 때 작동
  }
  const debouncedKeyword = useDebounce<string>(keyword)

  const handleEnterKeypress = (e: React.KeyboardEvent) => {
    //enter 검색
    if (e.key == 'Enter') {
      router.push(`/rooms?keyword=${keyword}`)
    }
  }
  const HOME_TAKE = 9
  const HOME_ROOMS_QUERY_KEY = `api/room/get-RecommendRooms`
  // const HOME_ROOMS_QUERY_KEY = `api/room/get-Rooms-take?skip=0&take=${HOME_TAKE}&category_id=${category}&sType_id=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`
  const { data: rooms, isLoading } = useQuery<
    { rooms: ManagedRoom[] },
    unknown,
    ManagedRoom[]
  >([HOME_ROOMS_QUERY_KEY], () =>
    fetch(HOME_ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  // get Wishlist (해당 유저의 관심 매물들)
  // const { data: wishlist, isLoading: wishLoading } = useQuery(
  //   [WISHLIST_QUERY_KEY],
  //   () =>
  //     fetch(WISHLIST_QUERY_KEY)
  //       .then((res) => res.json())
  //       .then((data) => data.items)
  // )
  // 매물들이 해당 유저의 관심 매물인지 확인
  // const isWished = (id: number) =>
  //   wishlist != null && id != null ? wishlist.includes(String(id)) : false

  // update wishlist
  // const { mutate: updateWishlist } = useMutation<unknown, unknown, number, any>(
  //   (roomId) =>
  //     fetch('/api/wishlist/update-Wishlist', {
  //       method: 'POST',
  //       body: JSON.stringify(roomId),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => res.items),
  //   {
  //     onMutate: async (roomId) => {
  //       await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] })
  //       const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY])

  //       queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
  //         old
  //           ? old.includes(String(roomId))
  //             ? old.filter((id) => id !== String(roomId))
  //             : old.concat(String(roomId))
  //           : []
  //       )

  //       queryClient.setQueryData<Room[]>(
  //         [
  //           `api/room/get-Rooms-take?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`,
  //         ],
  //         (olds) =>
  //           olds
  //             ? olds.map((old) =>
  //                 old.id === roomId
  //                   ? isWished(roomId)
  //                     ? { ...old, wished: old.wished - 1 }
  //                     : { ...old, wished: old.wished + 1 }
  //                   : { ...old }
  //               )
  //             : undefined
  //       )
  //       return previous
  //     },
  //     onError: (__, _, context) => {
  //       queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
  //     },
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
  //       queryClient.invalidateQueries([
  //         `api/room/get-Rooms-take?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`,
  //       ])
  //     },
  //   }
  // )

  return (
    <Home_Container>
      <div className="sector" style={{ padding: '140px 60px 160px 60px' }}>
        <div style={{ fontSize: '40px', fontWeight: '700' }}>
          어떤 스팟을 찾으세요?
        </div>
        <Home_Search_Div>
          <IconSearch size={21} />
          <Home_Input
            style={{ fontSize: '18px' }}
            // value={mainKeyword}
            // onChange={handleMainChange}
            placeholder="지역을 입력하세요"
            // onKeyUp={handleEnterKeypress}
          />
        </Home_Search_Div>
      </div>
      <div className="sector" style={{ padding: '10px 0 20px 0' }}>
        <Home_Recommend_Div>
          <div style={{ fontSize: '22px', fontWeight: '300', margin: '20px' }}>
            추천스팟
          </div>
          <Carousel
            slidesToShow={3}
            slidesToScroll={3}
            renderCenterLeftControls={({ previousDisabled, previousSlide }) => (
              <button onClick={previousSlide} disabled={previousDisabled}>
                <IconChevronLeft
                  color="black"
                  size={35}
                  stroke={2}
                  style={{ position: 'absolute', left: '-30', top: '100' }}
                />
              </button>
            )}
            renderCenterRightControls={({ nextDisabled, nextSlide }) => (
              <button onClick={nextSlide} disabled={nextDisabled}>
                <IconChevronRight
                  color="black"
                  size={35}
                  stroke={2}
                  style={{ position: 'absolute', right: '-30', top: '100' }}
                />
              </button>
            )}
          >
            {rooms &&
              rooms.map((room, idx) => (
                <div key={idx} style={{ height: '400px' }}>
                  <Center_Div>
                    <StyledImage
                      onClick={() => router.push(`/rooms/${room.id}`)}
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
                      />
                    </StyledImage>
                  </Center_Div>
                  <div>div</div>
                </div>
              ))}
          </Carousel>
        </Home_Recommend_Div>
        <div>
          {/* {rooms &&
            rooms.map((room, idx) => (
              <div className="border-b p-3" key={idx}>
                <div className="flex">
                  <Center_Div className="relative">
                    <StyledImage
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      style={{
                        width: '280px',
                        height: '210px',
                        margin: '10px',
                      }}
                    >
                      <Image
                        className="styled"
                        src={room.images.split(',')[0]}
                        alt={'thumbnail'}
                        fill
                      />
                    </StyledImage>
                    {session ? (
                        <CHoverDiv className="absolute left-4 top-4">
                          {wishLoading ? (
                            <Loader size={15} />
                          ) : isWished(room.id) ? (
                            <IconHeart
                              onClick={() => {
                                updateWishlist(room.id)
                              }}
                              size={25}
                              color={'red'}
                              fill={'red'}
                            />
                          ) : (
                            <IconHeartBroken
                              onClick={() => {
                                updateWishlist(room.id)
                              }}
                              size={25}
                              stroke={1.5}
                            />
                          )}
                        </CHoverDiv>
                      ) : (
                        <>
                          <CHoverDiv>
                            <IconHeartbeat
                              onClick={() => {
                                router.push('/auth/login')
                              }}
                              size={25}
                              stroke={1.5}
                              className="absolute left-4 top-4"
                            />
                          </CHoverDiv>
                        </>
                      )}
                  </Center_Div>
                  <div className="p-3 w-full">
                    <div className="flex mb-1">
                      {room.title}
                      <Center_Div className="ml-auto text-xs">
                        <IconEye size={15} />
                        {room.views}
                        <IconHeart size={15} className="ml-1" />
                        {room.wished}
                      </Center_Div>
                    </div>
                    <div className="flex space-x-3">
                      <CBbstyled>매물 정보</CBbstyled>
                      <Cstyled>-</Cstyled>
                      <CBbstyled>
                        매물 종류 : {CATEGORY_MAP[Number(room.categoryId)]}
                      </CBbstyled>
                    </div>
                    <div className="flex space-x-3">
                      <CBbstyled>위치 정보</CBbstyled>
                      <Cstyled>-</Cstyled>
                      <CBbstyled>주소 : {room.address} </CBbstyled>
                      <CBbstyled>상세 : {room.detailAddress} </CBbstyled>
                    </div>
                    <div className="flex space-x-3">
                      <CBbstyled>거래 정보</CBbstyled>
                      <Cstyled>-</Cstyled>
                      {room.ym === '0' ? (
                        <>
                          <CBbstyled>전세 : {room.price} 만원</CBbstyled>
                        </>
                      ) : (
                        <>
                          <CBbstyled>보증금 : {room.deposit} 만원</CBbstyled>
                          <CBbstyled>월세 : {room.price} 만원</CBbstyled>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <CBbstyled>기본 정보</CBbstyled>
                      <Cstyled>-</Cstyled>
                      <CBbstyled>크기 : {room.area} 평 </CBbstyled>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
        </div>
      </div>
      <div className="h-60 flex bg-zinc-100 mt-24">
        <div className="p-5 w-full">
          <span className="text-sm">MySpot Analytics</span>
          <div className="grid grid-cols-3 h-40 space-x-5 mt-4">
            <Card shadow="sm" p="lg" radius="xs" withBorder>
              <Card.Section></Card.Section>
            </Card>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section></Card.Section>
            </Card>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section></Card.Section>
            </Card>
          </div>
        </div>
      </div>
    </Home_Container>
  )
}

const Home_Container = styled.div`
  * {
    color: ${mainColor};
  }
  width: 1000px;
  .sector {
    border-bottom: solid 0.5px black;
  }
`
const Home_Input = styled.input`
  :focus {
    outline: none !important;
  }
  margin: 0 10px 0 10px;
  width: 100%;
`

const Home_Search_Div = styled(Center2_Div)`
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  border: 0.5px solid ${subColor_medium};
  padding: 10px;
  margin: 30px 0 0 0;
`

const Home_Recommend_Div = styled.div``
