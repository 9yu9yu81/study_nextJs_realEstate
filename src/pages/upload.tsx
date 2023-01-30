import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Badge, Chip, FileButton, Loader, Modal } from '@mantine/core'
import {
  IconExclamationCircle,
  IconHeart,
  IconEye,
  IconMapPin,
  IconX,
} from '@tabler/icons'
import Map from 'components/MapN'
import {
  HoverDiv,
  StyledImage,
  mainColor,
  subColor_light,
  subColor_lighter,
  subColor_medium,
} from 'components/styledComponent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AddressInfo,
  BasicInfo,
  MoreInfo,
  Room,
  SaleInfo,
} from '@prisma/client'
import { useSession } from 'next-auth/react'
import {
  CATEGORY_MAP,
  STATUS_MAP,
  YEAR_MONTH_MAP,
  TYPE_MAP,
  HEAT_MAP,
  MAINTENENCE_MAP,
  STRUCTURE_MAP,
  OPTION_MAP,
} from 'constants/const'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import HomeLogo from 'components/home/HomeLogo'
import UploadCaveats from 'components/upload/UploadCaveats'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import styled from '@emotion/styled'
import { Calendar } from '@mantine/dates'
import CustomCheckBox from 'components/CustomCheckBox'

const DESCRIPTION_PLACEHOLDER = `[상세설명 작성 주의사항]
- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
- 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`

const DETAILADDR_PLACEHOLDER = `상세 주소
예) e편한세상 101동 1101호`

const ROOMS_QUERY_KEY = 'api/room/get-ManagedRooms'

export interface roomAllData {
  room: Omit<
    Room,
    'user_id' | 'id' | 'updatedAt' | 'status_id' | 'views' | 'wished'
  >
  saleInfo: Omit<SaleInfo, 'id' | 'room_id'>
  basicInfo: Omit<BasicInfo, 'id' | 'room_id'>
  addressInfo: Omit<AddressInfo, 'id' | 'room_id'>
  moreInfo: Omit<MoreInfo, 'id' | 'room_id'>
}
interface ManagedRoom extends Omit<Room, 'user_id' | 'description'> {
  ym: number
  deposit?: number
  price: number
  doro: string
  detailAddr: string
  area: number
  mFee: number
}

export default function upload() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [isUploadPage, setIsUploadPage] = useState(true) //방 내놓기 or 내 방 관리
  useEffect(() => {
    //내 방 관리로 바로 이동
    router.query.isManagePage === 'true' && setIsUploadPage(false)
  }, [router.query.isManagePage])

  //state
  const [category, setCategory] = useState<string>('1') //매물종류
  const [roomType, setRoomType] = useState<string>('1') //건물유형
  const [ym, setYm] = useState<string>('1') //전월세
  const [heat, setHeat] = useState<string>('1') //난방종류
  const depositRef = useRef<HTMLInputElement | null>(null) //보증금
  const priceRef = useRef<HTMLInputElement | null>(null) //세
  const areaRef = useRef<HTMLInputElement | null>(null) //전용면적
  const supAreaRef = useRef<HTMLInputElement | null>(null) //공급면적
  const floorRef = useRef<HTMLInputElement | null>(null) //층
  const totalFloorRef = useRef<HTMLInputElement | null>(null) //건물층수
  const titleRef = useRef<HTMLInputElement | null>(null) //제목
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null) //상세설명
  const [images, setImages] = useState<string[]>([]) //사진
  const [moveIn, setMoveIn] = useState<Date | null>(new Date()) //입주가능일
  const [modal, setModal] = useState<boolean>(false) //캘린더 모달
  const [checked, setChecked] = useState<boolean>(false) //관리비 없음 체크
  const mFeeRef = useRef<HTMLInputElement | null>(null) //관리비
  const [mOption, setMOption] = useState<string[]>([]) //관리비 항목
  const [elevator, setElevator] = useState<string>('0') //엘베 유무
  const [parking, setParking] = useState<string>('0') //주차가능한지
  const [option, setOption] = useState<string[]>([]) //옵션항목
  const [structure, setStructure] = useState<string[]>([]) //방구조

  //daum-postcode
  const [doro, setDoro] = useState<string>('')
  const [jibun, setJibun] = useState<string>('')
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const addrRef = useRef<HTMLInputElement | null>(null)
  const detailAddrRef = useRef<HTMLTextAreaElement | null>(null)
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
          setDoro(data.roadAddress)
          setJibun(data.jibunAddress)
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
  //주소 좌표
  const onLoadKakaoMap = () => {
    kakao.maps.load(() => {
      //주소 변환 객체
      const geocoder = new kakao.maps.services.Geocoder()
      const addrConverter = (address: string) => {
        // 주소로 좌표를 검색
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setLng(Number(result[0].x))
            setLat(Number(result[0].y))
          }
        })
      }
      addrRef.current?.value && addrConverter(addrRef.current.value)
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  }, [addrRef.current?.value])

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

  const { mutate: addRoom } = useMutation<unknown, unknown, roomAllData, any>(
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
        setCategory('1')
        setYm('1')
        setRoomType('1')
        setHeat('1')
        setMoveIn(new Date())
        setChecked(false)
        setMOption([])
        setElevator('0')
        setParking('0')
        setOption([])
        setStructure([])
        setImages([])
        setIsUploadPage(false)
      },
    }
  )

  const validate = (type: 'submit') => {
    //add room
    //todo checking: checked && maintenence fee = 0
    if (type === 'submit') {
      addrRef.current?.value == ''
        ? alert('주소를 입력하세요.')
        : detailAddrRef.current?.value == ''
        ? alert('상세 주소를 입력하세요.')
        : depositRef.current?.value == ''
        ? alert('보증금을 입력하세요.')
        : ym === '2' && priceRef.current?.value == ''
        ? alert('가격을 입력하세요.')
        : supAreaRef.current?.value == ''
        ? alert('공급 면적을 입력하세요.')
        : areaRef.current?.value == ''
        ? alert('전용 면적을 입력하세요.')
        : totalFloorRef.current?.value == ''
        ? alert('건물 층수를 입력하세요.')
        : floorRef.current?.value == ''
        ? alert('해당 층수를 입력하세요.')
        : mFeeRef.current?.value == ''
        ? alert('관리비를 입력해주세요. 없다면 관리비 없음을 체크해 주세요.')
        : mFeeRef.current?.value != '0' && mOption == null
        ? alert('관리비 항목을 선택해주세요.')
        : floorRef.current?.value == ''
        ? alert('관리비를 입력해주세요. 없다면 관리비 없음을 체크해 주세요.')
        : titleRef.current?.value == ''
        ? alert('제목을 입력하세요')
        : descriptionRef.current?.value == ''
        ? alert('상세 설명을 입력하세요.')
        : images.length < 3 || images.length > 10
        ? alert('최소 5장, 최대 10장 이미지를 첨부해주세요')
        : moveIn &&
          addRoom({
            room: {
              category_id: Number(category),
              type_id: Number(roomType),
              title: String(titleRef.current?.value),
              description: String(descriptionRef.current?.value),
              images: images.join(','),
            },
            saleInfo: {
              type_id: Number(ym),
              deposit: Number(depositRef.current?.value),
              price: Number(priceRef.current?.value),
            },
            basicInfo: {
              supply_area: Number(supAreaRef.current?.value),
              area: Number(areaRef.current?.value),
              total_floor: Number(totalFloorRef.current?.value),
              floor: Number(floorRef.current?.value),
              move_in: moveIn,
              heat_id: Number(heat),
            },
            addressInfo: {
              doro: doro,
              jibun: jibun,
              detail: String(detailAddrRef.current?.value),
              lat: lat,
              lng: lng,
            },
            moreInfo: {
              maintenance_fee: Number(mFeeRef.current?.value),
              maintenance_ids: mOption?.join(','),
              elevator: Boolean(Number(elevator)),
              parking: Boolean(Number(elevator)),
              option_ids: option?.join(','),
              structure_ids: structure?.join(','),
            },
          })
    }
  }

  const { data: rooms, isLoading: roomsLoading } = useQuery<
    { rooms: ManagedRoom[] },
    unknown,
    ManagedRoom[]
  >([ROOMS_QUERY_KEY], () =>
    fetch(ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

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
  //       queryClient.invalidateQueries([ROOMS_QUERY_KEY])
  //     },
  //   }
  // )

  // 매물 상태 변경(-> 거래 완료)
  // const { mutate: updateStatus } = useMutation<
  //   unknown,
  //   unknown,
  //   Pick<Room, 'id' | 'status_id'>,
  //   any
  // >(
  //   (items) =>
  //     fetch('/api/room/update-Room-status', {
  //       method: 'POST',
  //       body: JSON.stringify(items),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => res.items),
  //   {
  //     onMutate: async (items) => {
  //       await queryClient.cancelQueries([ROOMS_QUERY_KEY])

  //       const previous = queryClient.getQueryData([ROOMS_QUERY_KEY])

  //       if (previous) {
  //         queryClient.setQueryData<Room[]>(
  //           [ROOMS_QUERY_KEY],
  //           (olds) =>
  //             olds &&
  //             olds.map((old) =>
  //               old.id === items.id
  //                 ? { ...old, status: items.status_id }
  //                 : { ...old }
  //             )
  //         )
  //       }
  //       return { previous }
  //     },
  //     onError: (__, _, context) => {
  //       queryClient.setQueryData([ROOMS_QUERY_KEY], context.previous)
  //     },
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries([ROOMS_QUERY_KEY])
  //     },
  //   }
  // )

  return session ? (
    <div>
      <HomeLogo size={50} margin={100} />
      {isUploadPage ? (
        <>
          <Center_Div2 className="mb-5">
            <Upload_Btn_Dark onClick={() => setIsUploadPage(true)}>
              방 내놓기
            </Upload_Btn_Dark>
            <Upload_Btn_Bright onClick={() => setIsUploadPage(false)}>
              내 방 관리
            </Upload_Btn_Bright>
          </Center_Div2>
          <UploadCaveats />
          <Upload_Div_B>
            <Upload_Div_Title>매물 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>매물 종류</Upload_Div_Sub_Title>
              <Upload_Div_Sub>
                <CustomSegmentedControl
                  value={String(category)}
                  onChange={setCategory}
                  data={CATEGORY_MAP.map((label, idx) => ({
                    label: label,
                    value: String(idx+1),
                  }))}
                />
              </Upload_Div_Sub>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>건물 유형</Upload_Div_Sub_Title>
              <Upload_Div_Sub>
                <CustomSegmentedControl
                  value={String(roomType)}
                  onChange={setRoomType}
                  data={TYPE_MAP.map((label, idx) => ({
                    label: label,
                    value: String(idx+1),
                  }))}
                />
              </Upload_Div_Sub>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B className="relative">
            <Upload_Div_Absolute className="right-3">
              *등기부등본 상의 주소를 입력해 주세요.
            </Upload_Div_Absolute>
            <Upload_Div_Title>위치 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>주소</Upload_Div_Sub_Title>
              <Upload_Div_Sub style={{ padding: '35px' }}>
                <div>
                  <Center_Div2 className="font-light">
                    <IconExclamationCircle
                      className="mr-1"
                      size={18}
                      stroke={1.5}
                    />
                    도로명, 건물명, 지번에 대해 통합검색이 가능합니다.
                  </Center_Div2>
                  <Center_Div2>
                    <Upload_Input1
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
                  </Center_Div2>
                  <Upload_Textarea1
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
                      style={{
                        flexFlow: 'column',
                        width: '300px',
                        height: '280px',
                        border: `0.5px solid ${subColor_medium}`,
                      }}
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
              <Upload_Div_Sub1>
                <CustomSegmentedControl
                  value={ym}
                  onChange={setYm}
                  data={YEAR_MONTH_MAP.map((label, idx) => ({
                    label: label,
                    value: String(idx+1),
                  }))}
                />
              </Upload_Div_Sub1>
              <Upload_Div_Sub_Title>가격</Upload_Div_Sub_Title>
              <Upload_Div_Sub1>
                {ym === '1' ? (
                  <Upload_Div_Sub3>
                    <Upload_Input2
                      type="number"
                      placeholder="전세"
                      ref={depositRef}
                    />{' '}
                    만원
                  </Upload_Div_Sub3>
                ) : (
                  <>
                    <Upload_Div_Sub3>
                      <Upload_Input2
                        type="number"
                        placeholder="보증금"
                        ref={depositRef}
                      />{' '}
                      /
                      <Upload_Input2
                        type="number"
                        placeholder="월세"
                        ref={priceRef}
                      />{' '}
                      만원
                    </Upload_Div_Sub3>
                  </>
                )}
              </Upload_Div_Sub1>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>기본 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 크기</div>
                <div>(1평=3.3058㎡)</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub1 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  공급 면적
                  <Upload_Input2 type="number" ref={supAreaRef} /> 평
                </Upload_Div_Sub3>
                <Upload_Div_Sub3>
                  전용 면적
                  <Upload_Input2 type="number" ref={areaRef} /> 평
                </Upload_Div_Sub3>
              </Upload_Div_Sub1>
              <Upload_Div_Sub_Title className="flex-col">
                <div>건물 층수</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub1 className="flex-col">
                <Upload_Div_Sub3 className="border-b">
                  건물 층수
                  <Upload_Input2 type="number" ref={totalFloorRef} /> 층
                </Upload_Div_Sub3>
                <Upload_Div_Sub3>
                  해당 층수
                  <Upload_Input2 type="number" ref={floorRef} /> 층
                </Upload_Div_Sub3>
              </Upload_Div_Sub1>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>난방 종류</Upload_Div_Sub_Title>
              <CustomSegmentedControl
                value={heat}
                onChange={setHeat}
                data={HEAT_MAP.map((label, idx) => ({
                  label: label,
                  value: String(idx + 1),
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
                overlayOpacity={0.1}
              >
                <Center_Div className="flex-col">
                  <Calendar value={moveIn} onChange={setMoveIn} />
                  <Upload_Btn_Outline onClick={() => setModal(false)}>
                    선택 완료
                  </Upload_Btn_Outline>
                </Center_Div>
              </Modal>
              <Upload_Btn_Outline1 onClick={() => setModal(true)}>
                날짜 선택
              </Upload_Btn_Outline1>
              <Upload_Text>
                {moveIn && format(moveIn, 'yyyy년 MM월 dd일')}
              </Upload_Text>
            </Upload_Div_Bt>
          </Upload_Div_B>
          <Upload_Div_B>
            <Upload_Div_Title>추가 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>관리비</Upload_Div_Sub_Title>
              <Upload_Div_Sub className="flex-col">
                <Upload_Div_Sub3 className="border-b space-x-5">
                  <Upload_Input2
                    type="number"
                    disabled={checked}
                    ref={mFeeRef}
                    value={checked ? '0' : undefined}
                  />{' '}
                  만원
                  <CustomCheckBox
                    label="관리비 없음"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </Upload_Div_Sub3>
                <Upload_Div_Sub3>
                  <Center_Div
                    className="flex-col"
                    style={{ minWidth: '80px', margin: '10px 20px 10px 0' }}
                  >
                    <div>관리비 항목</div>
                    <div>(다중선택가능)</div>
                  </Center_Div>
                  <Chip.Group
                    position="center"
                    multiple
                    value={mOption}
                    onChange={setMOption}
                    color={'dark'}
                  >
                    {MAINTENENCE_MAP.map((m, idx) => (
                      <Chip
                        key={idx}
                        color={'dark'}
                        styles={(theme) => ({
                          label: {
                            borderRadius: 0,
                            border: `0.5px solid ${subColor_medium} !important`,
                          },
                        })}
                        value={String(idx)}
                      >
                        {m}
                      </Chip>
                    ))}
                  </Chip.Group>
                </Upload_Div_Sub3>
              </Upload_Div_Sub>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>
                <div>엘리베이터</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub1>
                <CustomSegmentedControl
                  value={elevator}
                  onChange={setElevator}
                  data={[
                    { value: '0', label: '불가능' },
                    { value: '1', label: '가능' },
                  ]}
                />
              </Upload_Div_Sub1>
              <Upload_Div_Sub_Title>
                <div>주차여부</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub1>
                <CustomSegmentedControl
                  value={parking}
                  onChange={setParking}
                  data={[
                    { value: '0', label: '불가능' },
                    { value: '1', label: '가능' },
                  ]}
                />
              </Upload_Div_Sub1>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>
                <div>구조</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub>
                <Chip.Group
                  style={{ padding: '10px 20px 10px 20px' }}
                  multiple
                  value={structure}
                  onChange={setStructure}
                  color={'dark'}
                >
                  {STRUCTURE_MAP.map((s, idx) => (
                    <Chip
                      key={idx}
                      color={'dark'}
                      styles={(theme) => ({
                        label: {
                          borderRadius: 0,
                          border: `0.5px solid ${subColor_medium} !important`,
                        },
                      })}
                      value={String(idx)}
                    >
                      {s}
                    </Chip>
                  ))}
                </Chip.Group>
              </Upload_Div_Sub>
            </Upload_Div_Bt>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>
                <div>옵션항목</div>
              </Upload_Div_Sub_Title>
              <Upload_Div_Sub>
                <Chip.Group
                  style={{ padding: '10px 20px 10px 20px' }}
                  multiple
                  value={option}
                  onChange={setOption}
                  color={'dark'}
                >
                  {OPTION_MAP.map((o, idx) => (
                    <Chip
                      key={idx}
                      color={'dark'}
                      styles={(theme) => ({
                        label: {
                          borderRadius: 0,
                          border: `0.5px solid ${subColor_medium} !important`,
                        },
                      })}
                      value={String(idx)}
                    >
                      {o}
                    </Chip>
                  ))}
                </Chip.Group>
              </Upload_Div_Sub>
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
            <Center_Div2 className="m-3">
              <IconExclamationCircle size={18} className="mr-1" />
              <span style={{ fontSize: '13px' }}>
                허위 매물을 등록할 경우 MySpot에서 임의로 계정 및 매물 전체 삭제
                처리됩니다.
              </span>
            </Center_Div2>
          </Upload_Div_B>
          <Center_Div
            className="space-x-5"
            style={{ minWidth: '1000px', margin: '30px 0 30px 0' }}
          >
            <Upload_Btn_Outline>취소</Upload_Btn_Outline>
            <Upload_Btn_Submit
              onClick={() => {
                validate('submit')
              }}
            >
              등록하기
            </Upload_Btn_Submit>
          </Center_Div>
        </>
      ) : (
        <>
          <Center_Div2 className="mb-5">
            <Upload_Btn_Bright onClick={() => setIsUploadPage(true)}>
              방 내놓기
            </Upload_Btn_Bright>
            <Upload_Btn_Dark onClick={() => setIsUploadPage(false)}>
              내 방 관리
            </Upload_Btn_Dark>
          </Center_Div2>
          <UploadCaveats manage={true} />
          {roomsLoading ? (
            <Center_Div className="m-72">
              <Loader />
            </Center_Div>
          ) : rooms ? (
            rooms.map((room, idx) => <></>)
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
//button
const Upload_Btn = styled.button`
  min-width: 500px;
  width: 500px;
  height: 60px;
  font-size: ${fontsize}px;
  border: 0.5px solid ${subColor_lighter};
`
const Upload_Btn_Medium = styled.button`
  width: 100px;
  height: 40px;
  font-size: ${fontsize - 2}px;
`
const Upload_Btn_Dark = styled(Upload_Btn)`
  color: ${subColor_lighter};
  background-color: ${mainColor};
`
const Upload_Btn_Bright = styled(Upload_Btn)`
  color: ${mainColor};
  background-color: ${subColor_lighter};
`
const Upload_Btn_Submit = styled(Upload_Btn_Medium)`
  color: ${subColor_lighter};
  background-color: ${mainColor};
`
const Upload_Btn_Outline = styled(Upload_Btn_Medium)`
  color: ${mainColor};
  border: 0.5px solid ${subColor_medium};
`
const Upload_Btn_Outline1 = styled(Upload_Btn_Outline)`
  margin: 10px 10px 10px 20px;
`
//input
const Upload_Input = styled.input`
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
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 1}px;
`
const Upload_Input1 = styled(Upload_Input)`
  height: 40px;
  width: 330px;
  padding: 10px;
  margin: 20px 10px 20px 0;
`
const Upload_Input2 = styled(Upload_Input)`
  height: 40px;
  width: 110px;
  padding: 10px;
  margin: 10px;
`

const Upload_Input3 = styled(Upload_Input)`
  height: 40px;
  min-width: 840px;
  padding: 10px;
  margin: 5px;
`

//text
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
//textarea
const Upload_Textarea = styled.textarea`
  border: 0.5px solid ${subColor_medium};
  font-size: ${fontsize - 1}px;
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
  resize: none;
`
const Upload_Textarea1 = styled(Upload_Textarea)`
  height: 100px;
  width: 440px;
  padding: 10px;
  margin-right: 10px;
`
const Upload_Textarea2 = styled(Upload_Textarea)`
  min-height: 500px;
  min-width: 840px;
  padding: 10px;
  margin: 5px;
`
//div
const Center_Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Center_Div2 = styled.div`
  display: flex;
  align-items: center;
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
const Upload_Div_Title = styled(Center_Div)`
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
  width: 100%;
  border-bottom: 0.5px solid ${subColor_medium};
`
const Upload_Div_Sub_Title = styled(Center_Div)`
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
const Upload_Div_Sub = styled(Center_Div2)`
  width: 850px;
`
const Upload_Div_Sub1 = styled(Center_Div2)`
  width: 350px;
`
const Upload_Div_Sub3 = styled(Center_Div2)`
  padding-left: 20px;
  width: 100%;
`
