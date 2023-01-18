import { Card, Input, Loader } from '@mantine/core'
import { Room } from '@prisma/client'
import { IconEye, IconHeart, IconSearch } from '@tabler/icons'
import { useQuery } from '@tanstack/react-query'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import {
  B,
  Bb,
  CBstyled,
  CHoverDiv,
  CenteringDiv,
  StyledImage,
} from 'components/styledComponent'
import { HOME_TAKE, ROOM_CATEGORY_MAP, ROOM_YM_MAP } from 'constants/const'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function home() {
  const router = useRouter()
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
          <div className="grid grid-cols-3 mt-5">
            {rooms &&
              rooms.map((room, idx) => (
                <B key={idx} className="m-2 p-1 rounded-md">
                  <CBstyled className="m-2">{room.title}</CBstyled>
                  <CenteringDiv className="relative">
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
                    <CHoverDiv className="absolute right-5 top-5">
                      <IconHeart
                        onClick={() => {}}
                        size={24}
                        color={'red'}
                        fill={'red'}
                      />
                      <IconEye onClick={() => {}} size={24} />
                      {room.views}
                    </CHoverDiv>
                  </CenteringDiv>
                  <CenteringDiv
                    className="font-light text-zinc-600 text-xs
              "
                  ></CenteringDiv>
                  <div className="p-2 flex flex-col space-y-1">
                    <CBstyled>{room.address}</CBstyled>
                    <div className="grid grid-cols-2 space-x-2">
                      <CBstyled>{ROOM_YM_MAP[Number(room.ym)]}</CBstyled>
                      <CBstyled>
                        {ROOM_CATEGORY_MAP[Number(room.categoryId)]}
                      </CBstyled>
                    </div>
                    <div className="grid grid-cols-2 space-x-2">
                      <CBstyled>
                        {room.ym === '0'
                          ? `${room.price}만원`
                          : `${room.deposit} / ${room.price}만원`}
                      </CBstyled>
                      <CBstyled>{room.area}평</CBstyled>
                    </div>
                  </div>
                </B>
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
