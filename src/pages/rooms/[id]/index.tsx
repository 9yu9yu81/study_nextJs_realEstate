import styled from '@emotion/styled'
import { Flex, Loader, Modal, RingProgress } from '@mantine/core'
import {
  AddressInfo,
  BasicInfo,
  MoreInfo,
  Room,
  SaleInfo,
} from '@prisma/client'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsCircleHorizontal,
  IconEdit,
  IconHeart,
  IconHeartBroken,
  IconX,
} from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Center2_Div,
  StyledImage,
  mainColor,
  subColor_Dark,
  subColor_light,
  subColor_lighter,
  subColor_medium,
} from 'components/styledComponent'
import { CATEGORY_MAP, MAINTENENCE_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { format } from 'date-fns'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'
import { Upload_Btn_Outline } from 'pages/upload'
import { useEffect, useState } from 'react'

const carouselConfig = {
  nextButtonText: <IconChevronRight color="black" size={40} stroke={1.5} />,
  nextButtonStyle: { background: 'rgba(0,0,0,0)' },
  prevButtonText: <IconChevronLeft color="black" size={40} stroke={1.5} />,
  prevButtonStyle: { background: 'rgba(0,0,0,0)' },
}

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

type RoomAllData = Room &
  Omit<SaleInfo, 'id' | 'room_id' | 'type_id'> & { sType_id: number } & Omit<
    BasicInfo,
    'id' | 'room_id'
  > &
  Omit<AddressInfo, 'id' | 'room_id'> &
  Omit<MoreInfo, 'id' | 'room_id'>

export default function RoomIndex(room: RoomAllData) {
  const [modal, setModal] = useState<boolean>(false)
  const [imgIndex, setImgIndex] = useState<number>(0)
  const mList: number[] = [] //관리비 항목
  const noMList: number[] = [] //관리비 제외 항목
  for (let i = 0; i < MAINTENENCE_MAP.length; i++) {
    //관리비 항목 나누기
    room.maintenance_ids?.split(',').includes(String(i + 1))
      ? mList.push(i)
      : noMList.push(i)
  }
  const showMList = (list: number[]) => {
    //관리 항목 보여주기
    return list.map((m, idx) => (
      <span key={m} style={{ color: `${subColor_Dark}` }}>
        {MAINTENENCE_MAP[Number(m)]}
        {idx < list.length - 1 && ', '}
      </span>
    ))
  }
  const optionList: string[] | undefined = room.option_ids?.split(',')
  const openModal = (idx: number) => {
    setModal(true)
    setImgIndex(idx)
  }

  const queryClient = useQueryClient()
  const router = useRouter()
  const ROOM_QUERY_KEY = `/api/room/get-Room?id=${room.id}`
  //increase views
  // const { mutate: increaseViews } = useMutation<
  //   unknown,
  //   unknown,
  //   Pick<Room, 'id' | 'views'>,
  //   any
  // >(
  //   (items) =>
  //     fetch('/api/room/update-Room-views', {
  //       method: 'POST',
  //       body: JSON.stringify(items),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => res.items),
  //   {
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries([ROOM_QUERY_KEY])
  //     },
  //   }
  // )

  //increase views
  // useEffect(() => {
  //   increaseViews({ id: props.room.id, views: props.room.views + 1 })
  // }, [])

  // get Wished
  // const { data: wished } = useQuery(
  //   [`/api/room/get-Room-wished?id=${props.id}`],
  //   () =>
  //     fetch(`/api/room/get-Room-wished?id=${props.id}`)
  //       .then((res) => res.json())
  //       .then((data) => data.items)
  // )

  // get isWished
  // const { data: wishlist, isLoading } = useQuery([WISHLIST_QUERY_KEY], () =>
  //   fetch(WISHLIST_QUERY_KEY)
  //     .then((res) => res.json())
  //     .then((data) => data.items)
  // )

  // const isWished =
  //   wishlist != null && props.id != null
  //     ? wishlist.includes(String(props.id))
  //     : false

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

  //       //wishlist
  //       queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
  //         old
  //           ? old.includes(String(roomId))
  //             ? old.filter((id) => id !== String(roomId))
  //             : old.concat(String(roomId))
  //           : []
  //       )

  //       //wished
  //       await queryClient.cancelQueries({
  //         queryKey: [`/api/room/get-Room-wished?id=${roomId}`],
  //       })
  //       queryClient.setQueryData<number>(
  //         [`/api/room/get-Room-wished?id=${roomId}`],
  //         (old) => (old ? (wished ? old - 1 : old + 1) : 1)
  //       )

  //       return previous
  //     },
  //     onError: (__, _, context) => {
  //       queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
  //     },
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries([
  //         `/api/room/get-Room-wished?id=${props.id}`,
  //       ])
  //       queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
  //     },
  //   }
  // )

  //delete Room
  // const { mutate: deleteRoom } = useMutation<unknown, unknown, number, any>(
  //   (id) =>
  //     fetch('/api/room/delete-Room', {
  //       method: 'POST',
  //       body: JSON.stringify(id),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => res.items),
  //   {
  //     onSuccess: async () => {
  //       router.push('/upload?isManagePage=true')
  //     },
  //   }
  // )
  // const validate = (type: 'delete') => {
  //   if (type === 'delete') {
  //     deleteRoom(props.id)
  //   }
  // }

  return (
    <Info_Div>
      <Img_Wrapper>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          withCloseButton={false}
          centered
          size={1000}
        >
          <Carousel
            slideIndex={imgIndex}
            wrapAround
            defaultControlsConfig={carouselConfig}
          >
            {room.images.split(',').map((img, idx) => (
              <div
                key={idx}
                className="relative"
                style={{ width: '1000px', height: '750px' }}
              >
                <Image src={img} alt="carousel" key={idx} fill />
              </div>
            ))}
          </Carousel>
        </Modal>
        <Carousel
          wrapAround
          slidesToShow={2}
          cellAlign="center"
          defaultControlsConfig={carouselConfig}
        >
          {room.images.split(',').map((image, idx) => (
            <StyledImage1 key={idx} onClick={() => openModal(idx)}>
              <Image
                className="styled"
                alt="img1"
                src={room.images.split(',')[idx]}
                fill
              />
            </StyledImage1>
          ))}
        </Carousel>
        <Img_Btn onClick={() => openModal(0)}>사진 크게 보기</Img_Btn>
      </Img_Wrapper>
      <Info_Div1_Col>
        <Info_Div_Title>가격정보</Info_Div_Title>
        <Info_Div1_B>
          <Info_Div_SubTitle>
            {room.sType_id === 1 ? <div>전세</div> : <div>월세</div>}
          </Info_Div_SubTitle>
          {room.sType_id === 1 ? (
            <Info_Div2>{room.deposit}</Info_Div2>
          ) : (
            <Info_Div2>
              {room.deposit}/{room.fee}
            </Info_Div2>
          )}
        </Info_Div1_B>
        <Info_Div1_B>
          <Info_Div_SubTitle>관리비</Info_Div_SubTitle>
          {room.maintenance_fee === 0 ? (
            <Info_Div2>관리비 없음</Info_Div2>
          ) : (
            <div>
              <Info_Div2_B>
                <div>매월 {room.maintenance_fee} 만원</div>
                <div>{showMList(mList)}</div>
              </Info_Div2_B>
              <Info_Div2>
                별도 금액으로 부과되는 항목
                <div>{showMList(noMList)}</div>
              </Info_Div2>
            </div>
          )}
        </Info_Div1_B>
        {room.parking && (
          <Info_Div1_B>
            <Info_Div_SubTitle>주차비</Info_Div_SubTitle>
            <Info_Div2>{room.parking_fee} 만원</Info_Div2>
          </Info_Div1_B>
        )}
        <Info_Div1_B>
          <Info_Div_SubTitle>
            한달 <br />
            예상 주거비용
          </Info_Div_SubTitle>
          <Info_Div2>
            <div>
              {room.parking_fee + room.maintenance_fee + room.fee} 만원 + α
            </div>
            <div style={{ color: `${subColor_Dark}` }}>
              ( 월세 + 관리비 + 주차비 )
            </div>
            <div style={{ color: `${subColor_medium}`, fontSize: '15px' }}>
              별도 금액으로 부과되는 항목 제외
            </div>
          </Info_Div2>
        </Info_Div1_B>
      </Info_Div1_Col>
      <Info_Div1_Col>
        <Info_Div_Title>상세정보</Info_Div_Title>
        <Info_Div1_B>
          <Info_Div_SubTitle>방종류</Info_Div_SubTitle>
          <Info_Div2>{CATEGORY_MAP[room.category_id - 1]}</Info_Div2>
        </Info_Div1_B>
        <Info_Div1_B>
          <Info_Div_SubTitle>해당층/건물층</Info_Div_SubTitle>
          <Info_Div2>
            {room.floor}층 / {room.total_floor}층
          </Info_Div2>
        </Info_Div1_B>
        <Info_Div1_B>
          <Info_Div_SubTitle>공급면적</Info_Div_SubTitle>
          <Info_Div2>{room.supply_area} 평</Info_Div2>
        </Info_Div1_B>
        <Info_Div1_B>
          <Info_Div_SubTitle>전용면적</Info_Div_SubTitle>
          <Info_Div2>{room.area} 평</Info_Div2>
        </Info_Div1_B>
      </Info_Div1_Col>
    </Info_Div>
  )
}
const Img_Wrapper = styled.div`
  width: 1000px;
  margin: 30px 0 30px 0;
  position: relative;
`
const StyledImage1 = styled(StyledImage)`
  width: 492px;
  height: 369px;
  display: flex;
  margin-right: 8px;
`
const Img_Btn = styled(Upload_Btn_Outline)`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: ${subColor_lighter};
`

const Info_Div = styled.div`
  margin: 30px 0 30px 0;
  * {
    color: ${mainColor};
    font-size: 16px;
  }
`
const Info_Div1 = styled.div`
  width: 700px;
  display: flex;
`
const Info_Div1_Col = styled(Info_Div1)`
  flex-flow: column;
  margin: 60px 0 60px 0;
`
const Info_Div1_B = styled(Info_Div1)`
  border-bottom: 1px solid ${subColor_light};
  padding: 15px 0 15px 0;
`
const Info_Div2 = styled.div`
  display: flex;
  width: 550px;
  flex-flow: column;
  * {
    line-height: 180%;
  }
`
const Info_Div2_B = styled(Info_Div2)`
  border-bottom: 1px solid ${subColor_light};
  padding: 0 0 15px 0;
  margin: 0 0 15px 0;
`
const Info_Div_Title = styled(Center2_Div)`
  font-weight: 700;
  font-size: 25px;
  margin: 0 0 20px 0;
`
const Info_Div_SubTitle = styled(Info_Div_Title)`
  width: 150px;
  margin-bottom: auto;
  font-size: 17px;
`
