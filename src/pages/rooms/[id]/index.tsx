//todo 각각의 방 보여주는 페이지 layout 생각해보기
//todo  image -> carousel?
import { Button, Modal } from '@mantine/core'
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
import {
  B,
  Bb,
  Bl,
  Bt,
  CHoverDiv,
  CenteringDiv,
  StyledImage,
} from 'components/styledComponent'
import { ROOM_CATEGORY_MAP, ROOM_YM_MAP } from 'constants/upload'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Carousel from 'nuka-carousel'
import { useState } from 'react'

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
  const [isWished, setIsWished] = useState(false)

  //todo 조회수 증가하게 하고 DB에 업데이트 되게끔 만들기
  //todo 수정, 삭제가능하게 구현
  //todo 방에 하트 버튼 -> wishlist에 추가 (로그인 필요)

  //todo userId == session.user.id 일때 보여지는 layout이 따로 존재
  //todo 그 게시물을 올린 작성자가 아니라면 수정하기, 매물삭제 등의 ui가 조금 다르게 만들어보기
  return (
    <>
      <CenteringDiv className="m-5 pb-3 text-xs font-light text-zinc-600 border-b">
        <div className="text-xl">{props.title}</div>
        <div className="ml-auto flex">
          {props.userId === session?.user.id ? (
            <>
              <CenteringDiv className="p-2" style={{ width: '80px' }}>
                <IconEyeCheck size={18} stroke={1} />
                {props.views}
              </CenteringDiv>
              <CenteringDiv className="p-2" style={{ width: '80px' }}>
                <IconHeart color="red" size={18} stroke={1} />
                {props.views}
              </CenteringDiv>
              <CenteringDiv
                className="p-2 bg-blue-400 text-white font-normal"
                style={{ width: '140px' }}
              >
                <IconEdit size={18} stroke={1} />
                수정하기
              </CenteringDiv>
              <CenteringDiv
                className="p-2 bg-red-500 text-white font-normal"
                style={{ width: '140px' }}
              >
                <IconX size={18} stroke={1} />
                매물삭제
              </CenteringDiv>
            </>
          ) : (
            <>
              <CenteringDiv style={{ width: '60px' }}>
                <IconEyeCheck size={18} stroke={1} />
                {props.views}
              </CenteringDiv>
              <CenteringDiv style={{ width: '160px' }}>
                {isWished ? (
                  <CHoverDiv onClick={() => setIsWished(false)}>
                    <IconHeart color="red" fill="red" size={18} stroke={1.25} />
                    관심목록에 추가 됨
                  </CHoverDiv>
                ) : (
                  <CHoverDiv onClick={() => setIsWished(true)}>
                    <IconHeartBroken color="red" size={18} stroke={1.25} />
                    관심목록에 추가
                  </CHoverDiv>
                )}
              </CenteringDiv>
            </>
          )}
        </div>
      </CenteringDiv>
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
                className="relative"
                style={{ width: '700px', height: '500px' }}
              >
                <Image src={image} alt="carousel" key={idx} fill />
              </div>
            ))}
          </Carousel>
        </Modal>
        <CenteringDiv className="space-x-3">
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
                (image, i) =>
                  i > 0 &&
                  i < 5 && (
                    <StyledImage
                      key={i}
                      className="relative"
                      style={{ width: '240px', height: '190px', margin: '5px' }}
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
              <CenteringDiv className="text-xs text-zinc-500">
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
              </CenteringDiv>
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
                    {ROOM_CATEGORY_MAP[Number(props.category)]}
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
                  <Bl className="p-3">{ROOM_YM_MAP[Number(props.ym)]}</Bl>
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
        </CenteringDiv>
      </div>
    </>
  )
}

