import { Card, Input, Loader } from '@mantine/core'
import { Room } from '@prisma/client'
import {
  IconEye,
  IconHeart,
  IconHeartBroken,
  IconHeartbeat,
  IconSearch,
} from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import {
  Bb,
  CBbstyled,
  CHoverDiv,
  CenteringDiv,
  Cstyled,
  StyledImage,
} from 'components/styledComponent'
import { HOME_TAKE, ROOM_CATEGORY_MAP, ROOM_YM_MAP } from 'constants/const'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { WISHLIST_QUERY_KEY } from 'constants/querykey'
import useDebounce from 'hooks/useDebounce'

//todo myspot analytics 에 어떤 내용 들어갈지도 생각 해봐야함

export default function Rooms() {
  //change expired room status
  useEffect(() => {
    fetch('/api/room/update-Rooms-status')
      .then((res) => res.json())
      .then((data) => data.items)
  }, [])

  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const router = useRouter()
  const [category, setCategory] = useState<string>('-1')
  const [ym, setYm] = useState<string>('-1')
  //추천 스팟에서 검색어 값을 받는 state
  const [keyword, setKeyword] = useState<string>('')
  //검색어가 변경되었을 때 작동
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const debouncedKeyword = useDebounce<string>(keyword)

  //메인 검색어
  const [mainKeyword, setMainKeyword] = useState<string>('')
  //메인 검색어가 변경되었을 때 작동
  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainKeyword(e.target.value)
  }

  //get HOME_TAKE recomended Room (HOME_TAKE 수 만큼 방을 받아온다)
  const { data: rooms, isLoading } = useQuery<
    { rooms: Room[] },
    unknown,
    Room[]
  >(
    [
      `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`
      )
        .then((res) => res.json())
        .then((data) => data.items)
  )

  // get Wishlist (해당 유저의 관심 매물들)
  const { data: wishlist, isLoading: wishLoading } = useQuery(
    [WISHLIST_QUERY_KEY],
    () =>
      fetch(WISHLIST_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  )
  // 매물들이 해당 유저의 관심 매물인지 확인
  const isWished = (id: number) =>
    wishlist != null && id != null ? wishlist.includes(String(id)) : false

  // update wishlist
  const { mutate: updateWishlist } = useMutation<unknown, unknown, number, any>(
    (roomId) =>
      fetch('/api/wishlist/update-Wishlist', {
        method: 'POST',
        body: JSON.stringify(roomId),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (roomId) => {
        await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] })
        const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY])

        //wishlist
        queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(roomId))
              ? old.filter((id) => id !== String(roomId))
              : old.concat(String(roomId))
            : []
        )

        //wished
        queryClient.setQueryData<Room[]>(
          [
            `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`,
          ],
          (olds) =>
            olds
              ? olds.map((old) =>
                  old.id === roomId
                    ? isWished(roomId)
                      ? { ...old, wished: old.wished - 1 }
                      : { ...old, wished: old.wished + 1 }
                    : { ...old }
                )
              : undefined
        )
        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
        queryClient.invalidateQueries([
          `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed&contains=${debouncedKeyword}`,
        ])
      },
    }
  )

  return (
    <div className="text-zinc-600 mt-20">
      <Bb className="h-72 flex mb-10">
        <div className="p-10 w-full space-y-5">
          <div className="h-16 text-3xl font-bold ">어떤 스팟을 찾으세요?</div>
          <Input
            icon={<IconSearch />}
            value={mainKeyword}
            onChange={handleMainChange}
            placeholder="지역을 입력하세요"
          />
        </div>
      </Bb>
      <div>
        <div className="font-semibold mr-auto text-xl p-3">추천 스팟</div>
        <div className="grid grid-cols-3 rounded-md p-2 m-2 items-center border">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="지역을 입력하세요"
            value={keyword}
            onChange={handleChange}
          />
          <div className="ml-12">
            <CustomSegmentedControl
              value={category}
              onChange={setCategory}
              data={[
                {
                  label: '전체',
                  value: '-1',
                },
                ...ROOM_CATEGORY_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                })),
              ]}
            />
          </div>
          <div className="ml-20">
            <CustomSegmentedControl
              value={ym}
              onChange={setYm}
              data={[
                {
                  label: '전체',
                  value: '-1',
                },
                ...ROOM_YM_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                })),
              ]}
            />
          </div>
        </div>
        {isLoading ? (
          <CenteringDiv className="m-40">
            <Loader />
          </CenteringDiv>
        ) : (
          <div className="flex flex-col space-y-3 mt-3 text-sm font-light text-zinc-500">
            {rooms &&
              rooms.map((room, idx) => (
                <div className="border-b p-3" key={idx}>
                  <div className="flex">
                    <CenteringDiv className="relative">
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
                    </CenteringDiv>
                    <div className="p-3 w-full">
                      <div className="flex mb-1">
                        {room.title}
                        <CenteringDiv className="ml-auto text-xs">
                          <IconEye size={15} />
                          {room.views}
                          <IconHeart size={15} className="ml-1" />
                          {room.wished}
                        </CenteringDiv>
                      </div>
                      <div className="flex space-x-3">
                        <CBbstyled>매물 정보</CBbstyled>
                        <Cstyled>-</Cstyled>
                        <CBbstyled>
                          매물 종류 :{' '}
                          {ROOM_CATEGORY_MAP[Number(room.categoryId)]}
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
              ))}
          </div>
        )}
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
    </div>
  )
}
