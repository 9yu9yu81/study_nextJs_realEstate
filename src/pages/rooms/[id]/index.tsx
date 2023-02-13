import styled from '@emotion/styled'
import { Modal } from '@mantine/core'
import {
  AddressInfo,
  BasicInfo,
  MoreInfo,
  Room,
  SaleInfo,
} from '@prisma/client'
import { IconChevronLeft, IconChevronRight, IconHeart } from '@tabler/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import MapN from 'components/MapN'
import {
  Center2_Div,
  Center_Div,
  StyledImage,
  mainColor,
  subColor_Dark,
  subColor_light,
  subColor_lighter,
  subColor_medium,
} from 'components/styledComponent'
import {
  CATEGORY_MAP,
  HEAT_MAP,
  MAINTENENCE_MAP,
  OPTION_MAP,
  STRUCTURE_MAP,
  TYPE_MAP,
  YEAR_MONTH_MAP,
} from 'constants/const'
import { compareAsc, format } from 'date-fns'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Carousel from 'nuka-carousel'
import { Upload_Btn_Outline } from 'pages/upload'
import { useEffect, useState } from 'react'

const carouselConfig = {
  nextButtonText: <IconChevronRight color="black" size={40} stroke={2} />,
  nextButtonStyle: { background: 'rgba(0,0,0,0)' },
  prevButtonText: <IconChevronLeft color="black" size={40} stroke={2} />,
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
  const [cModal, setCModal] = useState<boolean>(false)
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
  const showOptionList = () => {
    return optionList?.map((item, idx) => (
      <Info_Div_Option key={idx}>
        <Image
          src={OPTION_MAP[Number(item) - 1].icon}
          alt={OPTION_MAP[Number(item) - 1].value}
          width={50}
          height={50}
        />
        {OPTION_MAP[Number(item) - 1].value}
      </Info_Div_Option>
    ))
  }
  const openModal = (idx: number) => {
    setModal(true)
    setImgIndex(idx)
  }
  const ROOM_QUERY_KEY = `/api/room/get-Room?id=${room.id}`

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
      // onMutate: async () => {
      //   await queryClient.cancelQueries([ROOM_QUERY_KEY])
      //   const previous = queryClient.getQueryData([ROOM_QUERY_KEY])
      //   if (previous) {
      //     queryClient.setQueryData<RoomAllData>([ROOM_QUERY_KEY], (old) =>
      //       old ? { ...old, views: room.views + 1 } : undefined
      //     )
      //   }
      //   return previous
      // },
      // onSuccess: async () => {
      //   queryClient.invalidateQueries([ROOM_QUERY_KEY])
      // },
    }
  )
  useEffect(() => {
    increaseViews({ id: room.id, views: room.views + 1 })
  }, [])

  const { data: wished } = useQuery(
    [`/api/room/get-Room-wished?id=${room.id}`],
    () =>
      fetch(`/api/room/get-Room-wished?id=${room.id}`)
        .then((res) => res.json())
        .then((data) => data.items)
  )

  // const { data: wishlist, isLoading } = useQuery([], () =>
  //   fetch()
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
      <div style={{ width: '1000px', display: 'flex' }}>
        <div style={{ display: 'flex', flexFlow: 'column' }}>
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
            {room.parking ? (
              <Info_Div1_B>
                <Info_Div_SubTitle>주차비</Info_Div_SubTitle>
                <Info_Div2>{room.parking_fee} 만원</Info_Div2>
              </Info_Div1_B>
            ) : (
              <></>
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
            <Info_Div1_B>
              <Info_Div_SubTitle>난방종류</Info_Div_SubTitle>
              <Info_Div2>{HEAT_MAP[room.heat_id - 1]}</Info_Div2>
            </Info_Div1_B>
            <Info_Div1_B>
              <Info_Div_SubTitle>주차</Info_Div_SubTitle>
              <Info_Div2>{room.parking ? '가능' : '불가능'}</Info_Div2>
            </Info_Div1_B>
            <Info_Div1_B>
              <Info_Div_SubTitle>엘리베이터</Info_Div_SubTitle>
              <Info_Div2>{room.elevator ? '있음' : '없음'}</Info_Div2>
            </Info_Div1_B>
            {room.structure_ids !== null && (
              <Info_Div1_B>
                <Info_Div_SubTitle>방 구조</Info_Div_SubTitle>
                <Info_Div2>
                  {room.structure_ids.split(',').map((item, idx) => (
                    <div key={idx}>{STRUCTURE_MAP[Number(item) - 1]}</div>
                  ))}
                </Info_Div2>
              </Info_Div1_B>
            )}
            <Info_Div1_B>
              <Info_Div_SubTitle>입주가능일</Info_Div_SubTitle>
              <Info_Div2>
                {compareAsc(new Date(room.move_in), new Date()) === -1
                  ? '즉시 입주 가능'
                  : format(new Date(room.move_in), 'yyyy년 MM월 dd일')}
              </Info_Div2>
            </Info_Div1_B>
            <Info_Div1_B>
              <Info_Div_SubTitle>건물유형</Info_Div_SubTitle>
              <Info_Div2>{TYPE_MAP[room.type_id - 1]}</Info_Div2>
            </Info_Div1_B>
            <Info_Div1_B>
              <Info_Div_SubTitle>최초등록일</Info_Div_SubTitle>
              <Info_Div2>
                {format(new Date(room.updatedAt), 'yyyy년 MM월 dd일')}
              </Info_Div2>
            </Info_Div1_B>
          </Info_Div1_Col>
          {room.option_ids && optionList && (
            <Info_Div1_Col>
              <Info_Div_Title>옵션</Info_Div_Title>
              <Info_Div1 style={{ flexWrap: 'wrap' }}>
                {showOptionList()}
              </Info_Div1>
            </Info_Div1_Col>
          )}
          <Info_Div1_Col>
            <Info_Div_Title>위치 및 주변시설</Info_Div_Title>
            <div style={{ marginBottom: '30px' }}>
              {room.doro} {room.detail}
            </div>
            <MapN width="700px" height="400px" address={room.doro} />
          </Info_Div1_Col>
          <Info_Div1_Col>
            <Info_Div_Title>상세 설명</Info_Div_Title>
            <Info_Div_Bg>
              <div style={{ fontWeight: '700', marginBottom: '15px' }}>
                {room.title}
              </div>
              <div>{room.description}</div>
            </Info_Div_Bg>
          </Info_Div1_Col>
        </div>
        <Info_Div_Card>
          <div style={{ display: 'flex' }}>
            <Manage_Div_Id>매물번호 {room.id}</Manage_Div_Id>
          </div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'column',
              margin: '20px 0 30px 0',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '700' }}>
              {YEAR_MONTH_MAP[room.sType_id - 1]}
              {room.sType_id === 1
                ? room.deposit
                : room.deposit + '/' + room.fee}
            </div>
            <div
              style={{
                color: `${subColor_Dark}`,
              }}
            >
              매물 조회수 {room.views + 1} 회
            </div>
            <Card_Img_Container>
              <Card_Img_Wrapper>
                <Card_img src="/../public/icons/elevator.png" />
                {room.floor} 층
              </Card_Img_Wrapper>
              <Card_Img_Wrapper>
                <Card_img src="/../public/icons/house-design.png" />
                {room.area} 평
              </Card_Img_Wrapper>
              <Card_Img_Wrapper>
                <Card_img src="/../public/icons/bill.png" />
                {room.maintenance_fee} 만 원
              </Card_Img_Wrapper>
            </Card_Img_Container>
            <div style={{ display: 'flex' }}>
              <div style={{ fontWeight: '700', minWidth: '60px' }}>방 유형</div>
              <div>{CATEGORY_MAP[room.category_id - 1]}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontWeight: '700', minWidth: '60px' }}>위치</div>
              <div>{room.doro}</div>
            </div>
          </div>
          <Center2_Div>
            <Dark_Btn
              onClick={() => setCModal((prev) => !prev)}
              style={{ width: '130px', fontSize: '13px', height: '40px' }}
            >
              연락처 보기
            </Dark_Btn>
            <Upload_Btn_Outline style={{ width: '80px', marginLeft: 'auto' }}>
              <Center_Div style={{ fontSize: '16px' }}>
                <IconHeart
                  size={20}
                  stroke={1.5}
                  style={{ marginRight: '10px' }}
                />
                {room.wished}
              </Center_Div>
            </Upload_Btn_Outline>
          </Center2_Div>
          {cModal && <div style={{ display: 'flex', marginTop: '10px' }}>
              <div style={{ fontWeight: '700', minWidth: '60px' }}>연락처</div>
              <div>{room.contact}</div>
            </div>}
        </Info_Div_Card>
      </div>
    </Info_Div>
  )
}
const Card_img = ({ src }: { src: string }) => {
  return (
    <Image
      style={{ marginRight: '15px' }}
      alt={src}
      width={27}
      height={27}
      src={src}
    />
  )
}

const Card_Img_Wrapper = styled(Center2_Div)`
  width: 120px;
  font-size: 16px;
`
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
  font-size: 13px;
`
const Info_Div = styled.div`
  margin: 30px 0 30px 0;
  * {
    color: ${mainColor};
    font-size: 16px;
  }
  width: 1000px;
`
const Info_Div1 = styled.div`
  width: 670px;
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
const Info_Div_Bg = styled(Info_Div1)`
  padding: 40px 20px 40px 20px;
  background-color: ${subColor_lighter};
  white-space: pre;
  line-height: 180%;
  flex-flow: column;
`

const Info_Div2 = styled.div`
  display: flex;
  width: 520px;
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
const Info_Div_Option = styled(Center_Div)`
  width: 70px;
  flex-flow: column;
  margin: 10px 20px 20px 0;
`

const Info_Div_Card = styled.div`
  width: 300px;
  height: 400px;
  padding: 30px;
  border: 0.5px solid ${subColor_light};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  margin: 50px 0 0 30px;
  top: 80px;
  left: 30px;
  display: flex;
  flex-flow: column;
  * {
    font-size: 14px;
  }
`
export const Manage_Div_Id = styled(Center_Div)`
  border: 1px solid ${subColor_Dark};
  height: 20px;
  font-size: 12px;
  padding: 3px 6px 3px 6px;
  border-radius: 2px;
  color: ${subColor_Dark};
`

const Card_Img_Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 120px);
  grid-template-rows: repeat(2, 40px);
  margin: 15px 0 15px 0;
`
const Dark_Btn = styled.button`
  color: ${subColor_lighter};
  background-color: ${mainColor};
`
