import { Button, Loader, Modal } from '@mantine/core'
import { Room } from '@prisma/client'
import {
  IconCaretLeft,
  IconCaretRight,
  IconDotsCircleHorizontal,
  IconEdit,
  IconEyeCheck,
  IconHeart,
  IconHeartBroken,
  IconX,
} from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  B,
  Bb,
  Bl,
  Bt,
  CHoverDiv,
  Cbb,
  Center_Div,
  StyledImage,
} from 'components/styledComponent'
import { ROOMS_QUERY_KEY, WISHLIST_QUERY_KEY } from 'constants/querykey'
import { CATEGORY_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { format } from 'date-fns'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'
import { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const room: Room = await fetch(
    `${process.env.NEXTAUTH_URL}/api/room/get-Room?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items)
  return {
    props: {
      ...room,
    },
  }
}

export default function RoomIndex(props: Room) {
  const [carousel, setCarousel] = useState(false)
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  //increase views
  const { mutate: increaseViews } = useMutation<
    unknown,
    unknown,
    Pick<Room, 'id' | 'views'>,
    any
  >(
    (items) =>
      fetch('/api/room/update-Room-views', {
        method: 'POST',
        body: JSON.stringify(items),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([ROOMS_QUERY_KEY])
      },
    }
  )
  //increase views
  useEffect(() => {
    increaseViews({ id: props.id, views: props.views + 1 })
  }, [])

  //todo status가 0일 때만 페이지를 그리도록 해야함 -> 나머지는 rooms/[id] 페이지 자체가 존재하면 안 됨

  // get Wished
  const { data: wished } = useQuery(
    [`/api/room/get-Room-wished?id=${props.id}`],
    () =>
      fetch(`/api/room/get-Room-wished?id=${props.id}`)
        .then((res) => res.json())
        .then((data) => data.items)
  )

  // get isWished
  const { data: wishlist, isLoading } = useQuery([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const isWished =
    wishlist != null && props.id != null
      ? wishlist.includes(String(props.id))
      : false

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
        await queryClient.cancelQueries({
          queryKey: [`/api/room/get-Room-wished?id=${roomId}`],
        })
        queryClient.setQueryData<number>(
          [`/api/room/get-Room-wished?id=${roomId}`],
          (old) => (old ? (wished ? old - 1 : old + 1) : 1)
        )

        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([
          `/api/room/get-Room-wished?id=${props.id}`,
        ])
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
      },
    }
  )

  //delete Room
  const { mutate: deleteRoom } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/room/delete-Room', {
        method: 'POST',
        body: JSON.stringify(id),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onSuccess: async () => {
        router.push('/upload?isManagePage=true')
      },
    }
  )
  const validate = (type: 'delete') => {
    if (type === 'delete') {
      deleteRoom(props.id)
    }
  }

  return (
    <>
      <Cbb className="m-5 pb-3 text-xs font-light text-zinc-600">
        <div className="text-lg relative">
          {props.title}
          <div className="absolute left-0 top-12 text-xs">
            게시일: {format(new Date(props.updatedAt), 'yyyy/MM/dd')}
          </div>
        </div>
        <div className="ml-auto flex">
          {props.userId === session?.user.id ? (
            <div className="flex relative">
              <Center_Div
                style={{ width: '160px' }}
                className="absolute bottom-10 left-44"
              >
                <CHoverDiv onClick={() => updateWishlist(props.id)}>
                  {isLoading ? (
                    <>
                      <IconHeart
                        color="red"
                        fill="red"
                        size={18}
                        stroke={1.25}
                        className="mr-1"
                      />
                      <Loader size={15} />
                    </>
                  ) : isWished ? (
                    <>
                      <IconHeart
                        color="red"
                        fill="red"
                        size={18}
                        stroke={1.25}
                        className="mr-1"
                      />
                      관심목록에 추가 됨
                    </>
                  ) : (
                    <>
                      <IconHeartBroken
                        color="gray"
                        size={18}
                        stroke={1.25}
                        className="mr-1"
                      />
                      관심목록에 추가
                    </>
                  )}
                </CHoverDiv>
              </Center_Div>
              <Center_Div
                onClick={() =>
                  increaseViews({ id: props.id, views: props.views + 1 })
                }
                className="p-2"
                style={{ width: '60px' }}
              >
                <IconEyeCheck size={18} stroke={1} />
                {props.views + 1}
              </Center_Div>
              <Center_Div className="p-2 mr-1" style={{ width: '60px' }}>
                <IconHeart color="red" fill="red" size={18} stroke={1} />
                {wished}
              </Center_Div>
              <CHoverDiv
                onClick={() => router.push(`/rooms/${props.id}/edit`)}
                className="p-2 bg-blue-400 text-white font-normal"
                style={{ width: '120px' }}
              >
                <IconEdit size={18} stroke={1} />
                수정하기
              </CHoverDiv>
              <CHoverDiv
                onClick={() => validate('delete')}
                className="p-2 bg-red-500 text-white font-normal"
                style={{ width: '120px' }}
              >
                <IconX size={18} stroke={1} />
                매물삭제
              </CHoverDiv>
            </div>
          ) : (
            <>
              <Center_Div style={{ width: '60px' }}>
                <IconEyeCheck size={18} stroke={1} />
                {props.views + 1}
              </Center_Div>
              {session && (
                <Center_Div style={{ width: '160px' }}>
                  <CHoverDiv onClick={() => updateWishlist(props.id)}>
                    {isWished ? (
                      <>
                        <IconHeart
                          color="red"
                          fill="red"
                          size={18}
                          stroke={1.25}
                          className="mr-1"
                        />
                        관심목록에 추가 됨
                      </>
                    ) : (
                      <>
                        <IconHeartBroken
                          color="gray"
                          size={18}
                          stroke={1.25}
                          className="mr-1"
                        />
                        관심목록에 추가
                      </>
                    )}
                  </CHoverDiv>
                </Center_Div>
              )}
            </>
          )}
        </div>
      </Cbb>
      <div>
        <Modal
          opened={carousel}
          onClose={() => setCarousel(false)}
          withCloseButton={false}
          centered
          size={700}
        >
          <Carousel
            adaptiveHeight={true}
            wrapAround
            defaultControlsConfig={{
              nextButtonText: (
                <IconCaretRight color="black" size={30} stroke={1.5} />
              ),
              nextButtonStyle: { background: 'rgba(0,0,0,0)' },
              prevButtonText: (
                <IconCaretLeft color="black" size={30} stroke={1.5} />
              ),
              prevButtonStyle: { background: 'rgba(0,0,0,0)' },
            }}
          >
            {props.images.split(',').map((image, idx) => (
              <div
                key={idx}
                className="relative"
                style={{ width: '700px', height: '500px' }}
              >
                <Image src={image} alt="carousel" key={idx} fill />
              </div>
            ))}
          </Carousel>
        </Modal>
        <Center_Div className="space-x-3">
          <div>
            <StyledImage
              style={{ width: '490px', height: '380px', margin: '5px' }}
            >
              <Image
                onClick={() => setCarousel(true)}
                className="styled"
                src={props.images.split(',')[0]}
                alt={'thumbnail'}
                fill
              />
            </StyledImage>
            <div className="grid grid-cols-2 grid-rows-2">
              {props.images.split(',').map(
                (image, idx) =>
                  idx > 0 &&
                  idx < 5 && (
                    <StyledImage
                      key={idx}
                      className="relative"
                      style={{
                        width: '240px',
                        height: '190px',
                        margin: '5px',
                      }}
                    >
                      <Image
                        onClick={() => setCarousel(true)}
                        className="styled"
                        src={image}
                        alt="image"
                        fill
                      />
                    </StyledImage>
                  )
              )}
            </div>
            {props.images.split(',').length > 5 && (
              <Center_Div className="text-xs text-zinc-500">
                <Button
                  onClick={() => setCarousel(true)}
                  variant="subtle"
                  color={'gray'}
                  leftIcon={
                    <IconDotsCircleHorizontal size={18} stroke={1.25} />
                  }
                >
                  모든 사진 보기
                </Button>
              </Center_Div>
            )}
          </div>
          <div>
            <B className="flex-col" style={{ width: '480px' }}>
              <div className="flex font-bold p-3">
                <span>매물 정보</span>
              </div>
              <Bt className="flex flex-col w-full text-xs">
                <div className="flex w-full items-center">
                  <span className="w-32 flex justify-center">매물 종류</span>
                  <Bl className="p-3">
                    {CATEGORY_MAP[Number(props.categoryId)]}
                  </Bl>
                </div>
              </Bt>
              <Bt className="flex font-bold p-3">
                <span>위치 정보</span>
              </Bt>
              <Bt className="flex flex-col w-full text-xs">
                <Bb className="flex w-full items-center">
                  <span className="w-32 flex justify-center">주소</span>
                  <Bl className="p-3">{props.address}</Bl>
                </Bb>
                <div className="flex w-full items-center">
                  <span className="w-32 flex justify-center">상세 주소</span>
                  <Bl className="p-3">{props.detailAddress}</Bl>
                </div>
              </Bt>
              <Bt className="flex font-bold p-3">
                <span>거래 정보</span>
              </Bt>
              <Bt className="flex flex-col w-full text-xs">
                <Bb className="flex w-full items-center">
                  <span className="w-32 flex justify-center">거래 종류</span>
                  <Bl className="p-3">{YEAR_MONTH_MAP[Number(props.ym)]}</Bl>
                </Bb>
                <div className="flex w-full items-center">
                  <span className="w-32 flex justify-center">가격</span>
                  <Bl className="p-3">
                    {props.ym === '0'
                      ? `${props.price} 만원`
                      : `${props.deposit} / ${props.price} 만원`}
                  </Bl>
                </div>
              </Bt>
              <Bt className="flex font-bold p-3">
                <span>기본 정보</span>
              </Bt>
              <Bt className="flex flex-col w-full text-xs">
                <div className="flex w-full items-center">
                  <span className="w-32 flex justify-center">건물 크기</span>
                  <Bl className="p-3">{props.area}평</Bl>
                </div>
              </Bt>
              <Bt className="flex font-bold p-3">
                <span>상세 설명</span>
              </Bt>
              <Bt className="flex flex-col w-full text-xs">
                <div
                  className="flex w-full p-7"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {props.description}
                </div>
              </Bt>
            </B>
          </div>
        </Center_Div>
      </div>
    </>
  )
}
