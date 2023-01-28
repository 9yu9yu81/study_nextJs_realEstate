import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Badge,
  Button,
  FileButton,
  Input,
  Loader,
  Modal,
  Textarea,
} from '@mantine/core'
import {
  IconCheck,
  IconEdit,
  IconExclamationCircle,
  IconEyeCheck,
  IconHeart,
  IconMapPin,
  IconX,
} from '@tabler/icons'
import Map from 'components/MapN'
import {
  CHoverDiv,
  Center2_Div,
  Center_Div,
  HoverDiv,
  StyledImage,
  mainColor,
  subColor_light,
  subColor_lighter,
  subColor_medium,
} from 'components/styledComponent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Room } from '@prisma/client'
import { ROOMS_QUERY_KEY } from 'constants/querykey'
import { useSession } from 'next-auth/react'
import {
  CATEGORY_MAP,
  STATUS_MAP,
  YEAR_MONTH_MAP,
  TYPE_MAP,
  HEAT_MAP,
} from 'constants/const'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import HomeLogo from 'components/home/HomeLogo'
import UploadCaveats from 'components/upload/UploadCaveats'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import styled from '@emotion/styled'
import { Calendar } from '@mantine/dates'

export const DESCRIPTION_PLACEHOLDER = `[상세설명 작성 주의사항]
- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
- 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`

export const DETAILADDR_PLACEHOLDER = `상세 주소
예) e편한세상 101동 1101호`

export default function upload() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  //방 내놓기인지 내 방관리인지 확인하는 state
  const [isUploadPage, setIsUploadPage] = useState(true)
  //내 방 관리로 바로 이동하게끔 함
  useEffect(() => {
    router.query.isManagePage === 'true' && setIsUploadPage(false)
  }, [router.query.isManagePage])
  //state
  const [category, setCategory] = useState<string>('0')
  const [type, setType] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  const [heat, setHeat] = useState<string>('0')
  const depositRef = useRef<HTMLInputElement | null>(null)
  const priceRef = useRef<HTMLInputElement | null>(null)
  const areaRef = useRef<HTMLInputElement | null>(null)
  const supAreaRef = useRef<HTMLInputElement | null>(null)
  const floorRef = useRef<HTMLInputElement | null>(null)
  const totalFloorRef = useRef<HTMLInputElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [moveIn, setMoveIn] = useState<Date | null>(new Date())
  const [modal, setModal] = useState<boolean>(false)
  //daum-postcode
  const addrRef = useRef<HTMLInputElement | null>(null)
  // const [addr, setAddr] = useState<string>('')
  const detailAddrRef = useRef<HTMLTextAreaElement | null>(null)
  // const [detailAddr, setDetailAddr] = useState<string>('')
  //주소 검색을 눌렀는지 확인하는 state
  const [addrSearchComplete, setAddrSearchComplete] = useState<boolean>(false)
  //daum-postcode 띄우는 함수
  const loadLayout = () => {
    window.daum.postcode.load(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data: any) {
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            if (addrRef.current) {
              addrRef.current.value = data.roadAddress
            }
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            if (addrRef.current) {
              addrRef.current.value = data.jibunAddress
            }
          }
          setAddrSearchComplete(true) //주소 검색이 되었는지 확인
        },
      })
      postcode.open({
        q: addrRef.current?.value,
      })
    })
  }
  //위치 정보 주소 쓰는 input에서 enter 를 누르면 바로 '주소검색' 버튼이 눌리게 기능 구현
  const postcodeButtonRef = useRef<HTMLButtonElement | null>(null)
  const handleEnterKeypress = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      if (postcodeButtonRef.current) {
        postcodeButtonRef.current.click()
      }
    }
  }

  //Image Uploader
  const [files, setFiles] = useState<File[]>([])
  useEffect(() => {
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData()

        fd.append('image', files[i], files[i].name)
        fetch(
          'https://api.imgbb.com/1/upload?expiration=600&key=340eff97531848cc7ed74f9ea0a716de',
          { method: 'POST', body: fd }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data)

            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url)))
            )
          })
          .catch((error) => console.log(error))
      }
    }
  }, [files])
  // 업로드된 image delete
  const handleImgDel = (delImage: string) => {
    setImages(images.filter((image) => image != delImage))
  }

  //입력받은 room data POST
  const { mutate: addRoom } = useMutation<
    unknown,
    unknown,
    Omit<Room, 'userId' | 'id' | 'updatedAt' | 'status' | 'views' | 'wished'>,
    any
  >(
    (room) =>
      fetch('/api/room/add-Room', {
        method: 'POST',
        body: JSON.stringify(room),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ROOMS_QUERY_KEY])
      },
      onSuccess: async () => {
        setCategory('0')
        setYm('0')
        setImages([])
        setIsUploadPage(false)
      },
    }
  )
  //올린 매물 삭제
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
        queryClient.invalidateQueries([ROOMS_QUERY_KEY])
      },
    }
  )

  //매물 상태 변경(-> 거래 완료)
  const { mutate: updateStatus } = useMutation<
    unknown,
    unknown,
    Pick<Room, 'id' | 'status'>,
    any
  >(
    (items) =>
      fetch('/api/room/update-Room-status', {
        method: 'POST',
        body: JSON.stringify(items),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (items) => {
        await queryClient.cancelQueries([ROOMS_QUERY_KEY])

        const previous = queryClient.getQueryData([ROOMS_QUERY_KEY])

        if (previous) {
          queryClient.setQueryData<Room[]>(
            [ROOMS_QUERY_KEY],
            (olds) =>
              olds &&
              olds.map((old) =>
                old.id === items.id
                  ? { ...old, status: items.status }
                  : { ...old }
              )
          )
        }

        // 이전 값 리턴
        return { previous }
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([ROOMS_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([ROOMS_QUERY_KEY])
      },
    }
  )

  const validate = (type: 'submit') => {
    if (type === 'submit') {
      addrRef.current?.value == ''
        ? alert('주소를 입력하세요.')
        : detailAddrRef.current?.value == ''
        ? alert('상세 주소를 입력하세요.')
        : ym === '1' && depositRef.current?.value == ''
        ? alert('보증금을 입력하세요.')
        : priceRef.current?.value == ''
        ? alert('가격을 입력하세요.')
        : areaRef.current?.value == ''
        ? alert('건물 크기를 입력하세요.')
        : titleRef.current?.value == ''
        ? alert('제목을 입력하세요')
        : descriptionRef.current?.value == ''
        ? alert('상세 설명을 입력하세요.')
        : images.length < 6 || images.length > 10
        ? alert('최소 5장, 최대 10장 이미지를 첨부해주세요')
        : addRoom({
            category_id: Number(category),
            ym: ym,
            address: String(addrRef.current?.value),
            detailAddress: String(detailAddrRef.current?.value),
            area: Number(areaRef.current?.value),
            price: Number(priceRef.current?.value),
            deposit: Number(depositRef.current?.value),
            images: images.join(','),
            title: String(titleRef.current?.value),
            description: String(descriptionRef.current?.value),
          })
    }
  }
  // get Rooms data
  const { data: rooms, isLoading } = useQuery<
    { rooms: Room[] },
    unknown,
    Room[]
  >([ROOMS_QUERY_KEY], () =>
    fetch(ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  return session ? (
    <div>
      <HomeLogo size={50} margin={100} />
      {isUploadPage ? (
        <>
          <Center2_Div className="mb-5">
            <Upload_Btn_Dark onClick={() => setIsUploadPage(true)}>
              방 내놓기
            </Upload_Btn_Dark>
            <Upload_Btn_Bright onClick={() => setIsUploadPage(false)}>
              내 방 관리
            </Upload_Btn_Bright>
          </Center2_Div>
          <UploadCaveats />
          <Upload_Div_B>
            <Upload_Div_Title>매물 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>매물 종류</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={String(category)}
                onChange={setCategory}
                data={CATEGORY_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                }))}
              />
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>건물 유형</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={String(type)}
                onChange={setType}
                data={TYPE_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                }))}
              />
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B className="relative">
            <Upload_Div_Absolute className="right-3">
              *등기부등본 상의 주소를 입력해 주세요.
            </Upload_Div_Absolute>
            <Upload_Div_Title>위치 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>주소</Upload_Div_Sub_Title>
              <Upload_Div_Sub>
                <div>
                  <Center2_Div className="font-light">
                    <IconExclamationCircle
                      className="mr-1"
                      size={18}
                      stroke={1.5}
                    />
                    도로명, 건물명, 지번에 대해 통합검색이 가능합니다.
                  </Center2_Div>
                  <Center2_Div>
                    <Upload_Input
                      type={'text'}
                      placeholder="예) 번동 10-1, 강북구 번동"
                      ref={addrRef}
                      onKeyUp={handleEnterKeypress}
                    />
                    <Upload_Btn_Submit
                      onClick={loadLayout}
                      ref={postcodeButtonRef}
                    >
                      주소 검색
                    </Upload_Btn_Submit>
                  </Center2_Div>
                  <Upload_Textarea
                    placeholder={DETAILADDR_PLACEHOLDER}
                    ref={detailAddrRef}
                  />
                </div>
                <div className="ml-auto">
                  {addrSearchComplete && addrRef.current?.value !== '' ? (
                    <Map
                      width="300px"
                      height="280px"
                      address={addrRef.current?.value}
                    />
                  ) : (
                    <Center_Div
                      className="border flex-col font-light"
                      style={{ width: '300px', height: '280px' }}
                    >
                      <IconMapPin size={20} stroke={1.5} />
                      <div>주소 검색을 하시면</div>
                      <div>해당 위치가 지도에 표시됩니다.</div>
                    </Center_Div>
                  )}
                </div>
              </Upload_Div_Sub>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>거래 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>거래 종류</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={ym}
                onChange={setYm}
                data={YEAR_MONTH_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                }))}
              />
              <Upload_Div_Sub_Title>가격</Upload_Div_Sub_Title>
              {ym === '0' ? (
                <Upload_Div_Sub3>
                  <Upload_Input2
                    type="text"
                    placeholder="전세"
                    ref={priceRef}
                  />{' '}
                  만원
                </Upload_Div_Sub3>
              ) : (
                <>
                  <Upload_Div_Sub3>
                    <Upload_Input2
                      type="text"
                      placeholder="보증금"
                      ref={depositRef}
                    />{' '}
                    /
                    <Upload_Input2
                      type="text"
                      placeholder="월세"
                      ref={priceRef}
                    />{' '}
                    만원
                  </Upload_Div_Sub3>
                </>
              )}
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>기본 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 크기</div>
                <div>(1평=3.3058㎡)</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub2 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  공급 면적
                  <Upload_Input2 type="text" ref={supAreaRef} /> 평
                </Upload_Div_Sub3>
                <Upload_Div_Sub3 className="border-b">
                  전용 면적
                  <Upload_Input2 type="text" ref={areaRef} /> 평
                </Upload_Div_Sub3>
              </Upload_Div_Sub2>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 층수</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub2 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  건물 층수
                  <Upload_Input2 type="text" ref={totalFloorRef} /> 층
                </Upload_Div_Sub3>
                <Upload_Div_Sub3 className="border-b">
                  해당 층수
                  <Upload_Input2 type="text" ref={floorRef} /> 층
                </Upload_Div_Sub3>
              </Upload_Div_Sub2>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>난방 종류</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={heat}
                onChange={setHeat}
                data={HEAT_MAP.map((label, id) => ({
                  label: label,
                  value: id,
                }))}
              />
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>입주 가능일</Upload_Div_Sub_Title>
              <Modal
                withCloseButton={false}
                opened={modal}
                onClose={() => setModal(false)}
                centered
                size={'auto'}
              >
                <Center_Div className="flex-col">
                  <Calendar value={moveIn} onChange={setMoveIn} />
                  <Upload_Btn_Calendar onClick={() => setModal(false)}>
                    선택 완료
                  </Upload_Btn_Calendar>
                </Center_Div>
              </Modal>
              <Upload_Btn_Calendar onClick={() => setModal(true)}>
                날짜 선택
              </Upload_Btn_Calendar>
              <Upload_Text>
                {moveIn && format(moveIn, 'yyyy년 MM월 dd일')}
              </Upload_Text>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>기본 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 크기</div>
                <div>(1평=3.3058㎡)</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub2 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  공급 면적
                  <Upload_Input2 type="text" ref={supAreaRef} /> 평
                </Upload_Div_Sub3>
                <Upload_Div_Sub3 className="border-b">
                  전용 면적
                  <Upload_Input2 type="text" ref={areaRef} /> 평
                </Upload_Div_Sub3>
              </Upload_Div_Sub2>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 층수</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub2 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  건물 층수
                  <Upload_Input2 type="text" ref={totalFloorRef} /> 층
                </Upload_Div_Sub3>
                <Upload_Div_Sub3 className="border-b">
                  해당 층수
                  <Upload_Input2 type="text" ref={floorRef} /> 층
                </Upload_Div_Sub3>
              </Upload_Div_Sub2>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>난방 종류</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={heat}
                onChange={setHeat}
                data={HEAT_MAP.map((label, id) => ({
                  label: label,
                  value: id,
                }))}
              />
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>입주 가능일</Upload_Div_Sub_Title>
              <Modal
                withCloseButton={false}
                opened={modal}
                onClose={() => setModal(false)}
                centered
                size={'auto'}
              >
                <Center_Div className="flex-col">
                  <Calendar value={moveIn} onChange={setMoveIn} />
                  <Upload_Btn_Calendar onClick={() => setModal(false)}>
                    선택 완료
                  </Upload_Btn_Calendar>
                </Center_Div>
              </Modal>
              <Upload_Btn_Calendar onClick={() => setModal(true)}>
                날짜 선택
              </Upload_Btn_Calendar>
              <Upload_Text>
                {moveIn && format(moveIn, 'yyyy년 MM월 dd일')}
              </Upload_Text>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>상세 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>제목</Upload_Div_Sub_Title>
              <Upload_Input3
                placeholder="예) 신논현역 도보 5분거리, 혼자 살기 좋은 방 입니다."
                ref={titleRef}
              />
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>상세 설명</Upload_Div_Sub_Title>
              <Upload_Textarea2
                wrap="hard"
                placeholder={DESCRIPTION_PLACEHOLDER}
                ref={descriptionRef}
              />
            </Upload_Div_Bt>
          </Upload_Div_B>

          <Upload_Div_B>
            <Upload_Div_Title>사진 등록</Upload_Div_Title>
            <UploadCaveats picture={true} />
            <div>
              <div style={{ minWidth: '1000px', padding: '20px' }}>
                <FileButton accept="image/*" multiple onChange={setFiles}>
                  {(props) => (
                    <Upload_Btn_Submit {...props}>
                      사진 추가하기
                    </Upload_Btn_Submit>
                  )}
                </FileButton>
                <div className="grid grid-cols-4 items-center space-y-2 mt-5">
                  {images &&
                    images.length > 0 &&
                    images.map((image, idx) => (
                      <div className="relative" key={idx}>
                        <Image
                          alt={'img'}
                          key={idx}
                          src={image}
                          width={200}
                          height={200}
                        />
                        <HoverDiv
                          className="absolute top-0 right-5"
                          onClick={() => handleImgDel(image)}
                        >
                          <IconX color="red" size={18} stroke={1.5} />
                        </HoverDiv>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Center2_Div className="m-3">
              <IconExclamationCircle size={18} className="mr-1" />
              <span style={{ fontSize: '13px' }}>
                허위 매물을 등록할 경우 MySpot에서 임의로 계정 및 매물 전체 삭제
                처리됩니다.
              </span>
            </Center2_Div>
          </Upload_Div_B>
          <Center_Div className="m-5 space-x-5">
            <button
              className=" border border-zinc-400 rounde"
              style={{ width: '120px', height: '50px' }}
            >
              취소
            </button>
            <button
              className=" border border-zinc-400 bg-zinc-600 text-zinc-100"
              style={{ width: '120px', height: '50px' }}
              onClick={() => {
                validate('submit')
              }}
            >
              등록하기
            </button>
          </Center_Div>
        </>
      ) : (
        <>
          <Center2_Div className="mb-5">
            <Upload_Btn_Bright onClick={() => setIsUploadPage(true)}>
              방 내놓기
            </Upload_Btn_Bright>
            <Upload_Btn_Dark onClick={() => setIsUploadPage(false)}>
              내 방 관리
            </Upload_Btn_Dark>
          </Center2_Div>
          <UploadCaveats manage={true} />
          {isLoading ? (
            <Center_Div className="m-72">
              <Loader />
            </Center_Div>
          ) : rooms ? (
            rooms.map((room, idx) => (
              <>
                <div
                  className="relative flex-col  border border-zinc-400 mt-6 font-light text-zinc-600"
                  style={{ fontSize: '13px' }}
                >
                  <Center_Div className="border-zinc-400 border-b">
                    <Center_Div
                      className="border-r border-zinc-400 p-2 bg-zinc-500 text-white font-normal"
                      style={{ width: '100px' }}
                    >
                      {idx + 1}
                    </Center_Div>
                    <div className="w-full p-2 text-sm font-">
                      <Badge
                        className="mr-3"
                        color={
                          room.status === 0
                            ? 'blue'
                            : room.status === 1
                            ? 'green'
                            : 'red'
                        }
                      >
                        {STATUS_MAP[room.status]}
                      </Badge>
                      {room.title}
                    </div>
                    <Cbl className="p-2" style={{ width: '80px' }}>
                      <IconEyeCheck size={18} stroke={1} />
                      {room.views}
                    </Cbl>
                    <Cbl className="p-2" style={{ width: '80px' }}>
                      <IconHeart color="red" fill="red" size={18} stroke={1} />
                      {room.wished}
                    </Cbl>
                    <CHoverDiv
                      onClick={() => updateStatus({ id: room.id, status: 1 })}
                      className="p-2 bg-green-500 text-white font-normal"
                      style={{ width: '140px' }}
                    >
                      <IconCheck size={18} stroke={1} />
                      거래완료
                    </CHoverDiv>
                    <CHoverDiv
                      onClick={() => router.push(`/rooms/${room.id}/edit`)}
                      className="p-2 bg-blue-400 text-white font-normal"
                      style={{ width: '140px' }}
                    >
                      <IconEdit size={18} stroke={1} />
                      수정하기
                    </CHoverDiv>
                    <CHoverDiv
                      onClick={() => deleteRoom(room.id)}
                      className="p-2 bg-red-500 text-white font-normal"
                      style={{ width: '140px' }}
                    >
                      <IconX size={18} stroke={1} />
                      매물삭제
                    </CHoverDiv>
                  </Center_Div>
                  <div className="flex relative">
                    <div className="absolute right-3 top-2">
                      게시일: {format(new Date(room.updatedAt), 'yyyy/MM/dd')}
                    </div>
                    <StyledImage
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      style={{
                        width: '260px',
                        height: '200px',
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
                    <Center_Div>
                      <div className="p-3">
                        <div className="border border-zinc-400">
                          <Center_Div className="border p-2">
                            매물정보
                          </Center_Div>
                          <Center_Div>
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              매물종류
                            </Center_Div>
                            <div className="p-1">
                              {CATEGORY_MAP[Number(room.categoryId)]}
                            </div>
                          </Center_Div>
                        </div>
                      </div>
                      <div className="p-3" style={{ maxWidth: '270px' }}>
                        <div className="border border-zinc-400">
                          <Center_Div className="border-b p-2">
                            위치정보
                          </Center_Div>
                          <Center_Div className="border-b">
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              주소
                            </Center_Div>
                            <div className="p-1 mr-auto">{room.address}</div>
                          </Center_Div>
                          <Center_Div>
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              상세주소
                            </Center_Div>
                            <div className="p-1 mr-auto">
                              {room.detailAddress}
                            </div>
                          </Center_Div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="border border-zinc-400">
                          <Center_Div className="border p-2">
                            거래정보
                          </Center_Div>
                          <Center_Div className="border-b">
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              거래종류
                            </Center_Div>
                            <div className="p-1 mr-auto">
                              {YEAR_MONTH_MAP[Number(room.ym)]}
                            </div>
                          </Center_Div>
                          <Center_Div>
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              가격
                            </Center_Div>
                            <div className="p-1 mr-auto">
                              {room.ym == '0' ? (
                                <>{room.price}만원</>
                              ) : (
                                <>
                                  {room.deposit}/{room.price}만원
                                </>
                              )}
                            </div>
                          </Center_Div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="border border-zinc-400">
                          <Center_Div className="border p-2">
                            기본정보
                          </Center_Div>
                          <Center_Div>
                            <Center_Div
                              className="border-r"
                              style={{ width: '60px' }}
                            >
                              건물크기
                            </Center_Div>
                            <div className="p-1">{room.area}평</div>
                          </Center_Div>
                        </div>
                      </div>
                    </Center_Div>
                  </div>
                </div>
              </>
            ))
          ) : (
            <Center_Div className="m-40">등록된 매물이 없습니다</Center_Div>
          )}
        </>
      )}
    </div>
  ) : (
    <Center_Div className="m-40">로그인 해주시기 바랍니다.</Center_Div>
  )
}

const fontsize: number = 14
const Upload_Btn_Dark = styled.button`
  color: ${subColor_lighter};
  background-color: ${mainColor};
  border: 0.5px solid ${subColor_lighter};
  min-width: 500px;
  width: 500px;
  height: 60px;
  font-size: ${fontsize}px;
`

const Upload_Btn_Bright = styled.button`
  color: ${mainColor};
  background-color: ${subColor_lighter};
  border: 0.5px solid ${subColor_lighter};
  min-width: 500px;
  width: 500px;
  height: 60px;
  font-size: ${fontsize}px;
`

const Upload_Input = styled.input`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 2}px;
  height: 36px;
  width: 330px;
  padding: 10px;
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`
const Upload_Input2 = styled.input`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 2}px;
  height: 40px;
  width: 110px;
  padding: 10px;
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin: 10px;
`
const Upload_Input3 = styled.input`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 1}px;
  height: 40px;
  min-width: 840px;
  padding: 10px;
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin: 5px;
`
const Upload_Text = styled.text`
  border: 0.5px solid ${subColor_medium};
  padding: 10px;
  font-size: 12px;
  color: ${subColor_medium};
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin: 10px;
  resize: none;
`

const Upload_Textarea = styled.textarea`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 2}px;
  height: 100px;
  width: 440px;
  padding: 10px;
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin-right: 10px;
  resize: none;
`
const Upload_Textarea2 = styled.textarea`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 1}px;
  min-height: 500px;
  min-width: 840px;
  padding: 10px;
  :hover {
    border: 0.5px solid ${mainColor};
  }
  :active {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  :focus {
    outline: none !important;
    border: 1px solid ${mainColor};
  }
  margin: 5px;
  resize: none;
`

const Upload_Btn_Submit = styled.button`
  color: ${subColor_lighter};
  background-color: ${mainColor};
  width: 100px;
  height: 36px;
  font-size: ${fontsize - 2}px;
`

const Upload_Btn_Calendar = styled.button`
  color: ${mainColor};
  border: 0.5px solid ${subColor_medium};
  width: 86px;
  height: 40px;
  font-size: ${fontsize - 2}px;
  margin: 10px;
  margin-left: 20px;
  border-radius: 4px;
`

const Upload_Div_B = styled.div`
  border: 0.5px solid ${subColor_medium};
  margin-top: 30px;
  min-width: 1000px;
  * {
    color: ${mainColor};
  }
`

const Upload_Div_Absolute = styled.div`
  font-size: ${fontsize - 3}px;
  position: absolute;
  right: 10px;
  top: 20px;
  color: ${subColor_medium};
`

const Upload_Div_Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
  width: 100%;
  border-bottom: 0.5px solid ${subColor_medium};
`
const Upload_Div_Sub_Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  font-size: ${fontsize}px;
  background-color: ${subColor_lighter};
`

const Upload_Div_Bt = styled.div`
  width: 100%;
  display: flex;
  font-size: ${fontsize}px;
  border-top: 1px solid ${subColor_light};
`
const Upload_Div_Sub = styled.div`
  padding: 35px;
  display: flex;
  width: 850px;
  align-items: center;
`
const Upload_Div_Sub2 = styled.div`
  display: flex;
  min-width: 350px;
`

const Upload_Div_Sub3 = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${subColor_light};
`
