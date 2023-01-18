import { Card, Input, Loader } from '@mantine/core'
import { Room } from '@prisma/client'
import {
  IconEye,
  IconHeart,
  IconHeartBroken,
  IconHeartbeat,
  IconSearch,
} from '@tabler/icons'
import { useQuery } from '@tanstack/react-query'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import {
  Bb,
  CBbstyled,
  CenteringDiv,
  Cstyled,
  StyledImage,
} from 'components/styledComponent'
import { HOME_TAKE, ROOM_CATEGORY_MAP, ROOM_YM_MAP } from 'constants/const'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function home() {
  const [category, setCategory] = useState('-1')
  const [ym, setYm] = useState('-1')

  //get six recomended Room
  const { data: rooms, isLoading } = useQuery<
    { rooms: Room[] },
    unknown,
    Room[]
  >(
    [
      `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed`,
    ],
    () =>
      fetch(
        `api/room/get-Rooms-page?skip=0&take=${HOME_TAKE}&category=${category}&ym=${ym}&orderBy=mostViewed`
      )
        .then((res) => res.json())
        .then((data) => data.items)
  )
  useEffect(() => {
    fetch('/api/room/update-Rooms-status')
      .then((res) => res.json())
      .then((data) => data.items)
  }, [])
  return (
    <div className="text-zinc-600 mt-20">
      <Bb className="h-72 flex mb-10">
        <div className="p-10 w-full space-y-5">
          <div className="h-16 text-3xl font-bold ">어떤 스팟을 찾으세요?</div>
          <Input icon={<IconSearch />} placeholder="지역을 입력하세요" />
        </div>
      </Bb>
      <div>
        <div className="font-semibold mr-auto text-xl p-3">추천 스팟</div>
        <div className="grid grid-cols-3 rounded-md p-2 m-2 items-center border">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="지역을 입력하세요"
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
                    <CenteringDiv>
                      <StyledImage
                        onClick={() => {}}
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
                    </CenteringDiv>
                    <div className="p-3 w-full">
                      <div className="flex">
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
