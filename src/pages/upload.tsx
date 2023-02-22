import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Chip, FileButton, Loader, Modal } from '@mantine/core'
import { IconExclamationCircle, IconMapPin } from '@tabler/icons'
import Map from 'components/MapN'
import {
  HoverDiv,
  StyledImage,
  mainColor,
  subColor_Dark,
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
import { add, differenceInDays } from 'date-fns'
import CustomPagination from 'components/CustomPagination'

const DESCRIPTION_PLACEHOLDER = `[상세설명 작성 주의사항]
- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
- 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`

const DETAILADDR_PLACEHOLDER = `상세 주소
예) e편한세상 101동 1101호`

export interface RoomUploadData {
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
  type_id: number //전월세
  deposit: number
  fee: number
  doro: string
  detail: string
  area: number
}
export default function Upload() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [activePage, setActivePage] = useState(1) //page
  const MANAGED_ROOMS_TAKE: number = 5
  const MANAGED_ROOMS_COUNT_QUERY_KEY = 'api/room/get-ManagedRooms-Count'
  const MANAGED_ROOMS_QUERY_KEY = `api/room/get-ManagedRooms-Take?skip=${
    (activePage - 1) * MANAGED_ROOMS_TAKE
  }&take=${MANAGED_ROOMS_TAKE}`
  const USER_CONTACT_QUERY_KEY = 'api/user/get-Contact'

  const [isUploadPage, setIsUploadPage] = useState(true) //방 내놓기 or 내 방 관리
  useEffect(() => {
    //내 방 관리로 바로 이동
    router.query.isManagePage === 'true' && setIsUploadPage(false)
  }, [router.query.isManagePage])

  const chipStyles = {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    label: {
      display: 'flex',
      height: '35px',
      borderRadius: 0,
      border: `0.5px solid ${subColor_medium} !important`,
    },
  }

  //state
  const [category, setCategory] = useState<string>('1') //매물종류
  const [roomType, setRoomType] = useState<string>('1') //건물유형
  const [ym, setYm] = useState<string>('1') //전월세종류
  const [heat, setHeat] = useState<string>('1') //난방종류
  const depositRef = useRef<HTMLInputElement | null>(null) //보증금
  const [fee, setFee] = useState<string>('0') //월세
  const areaRef = useRef<HTMLInputElement | null>(null) //전용면적
  const supAreaRef = useRef<HTMLInputElement | null>(null) //공급면적
  const floorRef = useRef<HTMLInputElement | null>(null) //층
  const totalFloorRef = useRef<HTMLInputElement | null>(null) //건물층수
  const titleRef = useRef<HTMLInputElement | null>(null) //제목
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null) //상세설명
  const [images, setImages] = useState<string[]>([]) //사진
  const [moveIn, setMoveIn] = useState<Date | null>(new Date()) //입주가능일
  const [modal, setModal] = useState<boolean>(false) //캘린더 모달
  const [mChecked, setMChecked] = useState<boolean>(false) //관리비 없음 체크
  const [mFee, setMFee] = useState<string>('0') //관리비
  const [mOption, setMOption] = useState<string[]>([]) //관리비 항목
  const [elevator, setElevator] = useState<string>('0') //엘베 유무
  const [parking, setParking] = useState<string>('0') //주차가능한지
  const [pFee, setPFee] = useState<string>('0') //주차비
  const [option, setOption] = useState<string[]>([]) //옵션항목
  const [structure, setStructure] = useState<string[]>([]) //방구조
  const [contact, setContact] = useState<string>('')
  const [cChecked, setCChecked] = useState<boolean>(false)
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

  const { mutate: addRoom } = useMutation<
    unknown,
    unknown,
    RoomUploadData,
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
      onSuccess: async () => {
        queryClient.invalidateQueries([MANAGED_ROOMS_QUERY_KEY])
        setCategory('1')
        setYm('1')
        setRoomType('1')
        setHeat('1')
        setMoveIn(new Date())
        setMChecked(false)
        setCChecked(false)
        setMOption([])
        setMFee('0')
        setElevator('0')
        setParking('0')
        setPFee('0')
        setOption([])
        setStructure([])
        setImages([])
        setIsUploadPage(false)
      },
    }
  )

  const validate = (type: 'submit') => {
    mChecked && setMFee('0')
    ym === '1' && setFee('0')
    if (cChecked === false && contact !== '' && contact !== userContact) {
      if (confirm('해당 연락처를 기존 번호로 저장 하시겠습니까?')) {
        updateContact(contact)
      }
    }
    //todo
    if (type === 'submit') {
      addrRef.current?.value == ''
        ? alert('주소를 입력하세요.')
        : detailAddrRef.current?.value == ''
        ? alert('상세 주소를 입력하세요.')
        : depositRef.current?.value == ''
        ? alert('보증금을 입력하세요.')
        : ym === '2' && fee == '0'
        ? alert('가격을 입력하세요.')
        : supAreaRef.current?.value == ''
        ? alert('공급 면적을 입력하세요.')
        : areaRef.current?.value == ''
        ? alert('전용 면적을 입력하세요.')
        : totalFloorRef.current?.value == ''
        ? alert('건물 층수를 입력하세요.')
        : floorRef.current?.value == ''
        ? alert('해당 층수를 입력하세요.')
        : !mChecked && mFee == '0'
        ? alert('관리비를 입력해주세요. 없다면 관리비 없음을 체크해 주세요.')
        : !mChecked && mFee != '0' && mOption == null
        ? alert('관리비 항목을 선택해주세요.')
        : floorRef.current?.value == ''
        ? alert('관리비를 입력해주세요. 없다면 관리비 없음을 체크해 주세요.')
        : titleRef.current?.value == ''
        ? alert('제목을 입력하세요')
        : descriptionRef.current?.value == ''
        ? alert('상세 설명을 입력하세요.')
        : contact === ''
        ? alert('연락받을 번호를 입력해 주세요.')
        : images.length < 3 || images.length > 10
        ? alert('최소 3장, 최대 10장 이미지를 첨부해주세요')
        : moveIn &&
          addRoom({
            room: {
              category_id: Number(category),
              type_id: Number(roomType),
              title: String(titleRef.current?.value),
              description: String(descriptionRef.current?.value),
              images: images.join(','),
              contact: contact,
            },
            saleInfo: {
              type_id: Number(ym),
              deposit: Number(depositRef.current?.value),
              fee: Number(fee),
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
              maintenance_fee: Number(mFee),
              maintenance_ids: mOption.length === 0 ? null : mOption.join(','),
              elevator: Boolean(Number(elevator)),
              parking: Boolean(Number(parking)),
              parking_fee: parking === '0' ? 0 : Number(pFee),
              option_ids: option.length === 0 ? null : option.join(','),
              structure_ids:
                structure.length === 0 ? null : structure.join(','),
            },
          })
    }
  }

  const { data: userContact } = useQuery<
    { userContact: string },
    unknown,
    string
  >(
    [USER_CONTACT_QUERY_KEY],
    () =>
      fetch(USER_CONTACT_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onSuccess: async (userContact) => {
        userContact !== '' && (setCChecked(true), setContact(userContact))
      },
    }
  )

  const { data: rooms, isLoading: roomsLoading } = useQuery<
    { rooms: ManagedRoom[] },
    unknown,
    ManagedRoom[]
  >([MANAGED_ROOMS_QUERY_KEY], () =>
    fetch(MANAGED_ROOMS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const { data: total } = useQuery(
    // get total page
    [MANAGED_ROOMS_COUNT_QUERY_KEY],
    () =>
      fetch(MANAGED_ROOMS_COUNT_QUERY_KEY)
        .then((res) => res.json())
        .then((data) =>
          data.items === 0 ? 1 : Math.ceil(data.items / MANAGED_ROOMS_TAKE)
        ),
    {
      onSuccess: async () => {
        setActivePage(1)
      },
    }
  )

  const { mutate: updateContact } = useMutation<unknown, unknown, string, any>(
    (contact) =>
      fetch('/api/user/update-Contact', {
        method: 'POST',
        body: JSON.stringify(contact),
      })
        .then((data) => data.json())
        .then((res) => res.items)
  )

  const { mutate: deleteRoom } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/room/delete-Room', {
        method: 'POST',
        body: JSON.stringify(id),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries([MANAGED_ROOMS_QUERY_KEY])
        const previous = queryClient.getQueryData([MANAGED_ROOMS_QUERY_KEY])

        if (previous) {
          queryClient.setQueryData<ManagedRoom[]>(
            [MANAGED_ROOMS_QUERY_KEY],
            (olds) => olds?.filter((f) => f.id !== id)
          )
        }

        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([MANAGED_ROOMS_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([MANAGED_ROOMS_QUERY_KEY])
      },
    }
  )

  const { mutate: updateStatus } = useMutation<
    unknown,
    unknown,
    Pick<Room, 'id' | 'status_id'>,
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
        await queryClient.cancelQueries([MANAGED_ROOMS_QUERY_KEY])

        const previous = queryClient.getQueryData([MANAGED_ROOMS_QUERY_KEY])

        if (previous) {
          queryClient.setQueryData<ManagedRoom[]>(
            [MANAGED_ROOMS_QUERY_KEY],
            (olds) =>
              olds &&
              olds.map((old) =>
                old.id === items.id
                  ? { ...old, status_id: items.status_id }
                  : { ...old }
              )
          )
        }
        return { previous }
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([MANAGED_ROOMS_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([MANAGED_ROOMS_QUERY_KEY])
      },
    }
  )

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
                    value: String(idx + 1),
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
                    value: String(idx + 1),
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
                      type="text"
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
                    value: String(idx + 1),
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
                        onChange={(e) => setFee(e.target.value)}
                        onBlur={(e) => e.target.value === '' && setFee('0')}
                        value={fee}
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
              {moveIn && (
                <Center_Div2 style={{ marginLeft: '10px' }}>
                  {format(moveIn, 'yyyy년 MM월 dd일')}
                </Center_Div2>
              )}
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
                    disabled={mChecked}
                    onChange={(e) => setMFee(e.target.value)}
                    onBlur={(e) => e.target.value === '' && setMFee('0')}
                    value={mChecked ? '0' : mFee}
                  />{' '}
                  만원
                  <CustomCheckBox
                    label="관리비 없음"
                    checked={mChecked}
                    onChange={(e) => setMChecked(e.target.checked)}
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
                        styles={(theme) => chipStyles}
                        value={String(idx + 1)}
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
                {parking === '1' && (
                  <>
                    <Upload_Input4
                      type="number"
                      onChange={(e) => setPFee(e.target.value)}
                      onBlur={(e) => e.target.value === '' && setPFee('0')}
                      value={pFee}
                    />{' '}
                    만원
                  </>
                )}
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
                      styles={(theme) => chipStyles}
                      value={String(idx + 1)}
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
                      styles={(theme) => chipStyles}
                      value={String(idx + 1)}
                    >
                      {o.value}
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
            <Upload_Div_Title>연락처 정보</Upload_Div_Title>
            <Upload_Div_Bt>
              <Upload_Div_Sub_Title>연락 가능한 번호</Upload_Div_Sub_Title>
              <Upload_Div_Sub style={{ padding: '0 20px 0 20px' }}>
                <CustomCheckBox
                  label="기존 번호 사용"
                  checked={cChecked}
                  onChange={(e) =>
                    cChecked === false && userContact === ''
                      ? alert('등록된 번호가 없습니다.')
                      : cChecked === false && userContact !== '' && userContact
                      ? (setContact(userContact), setCChecked(e.target.checked))
                      : setCChecked(e.target.checked)
                  }
                />
                <Upload_Input
                  type="number"
                  disabled={cChecked}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{
                    width: '180px',
                    marginLeft: '20px',
                  }}
                  placeholder=" '-' 를 생략하고 입력해주세요"
                />
                {contact.match(/[^0-9.]/) && (
                  <Upload_Warning>숫자만 입력해주세요.</Upload_Warning>
                )}
              </Upload_Div_Sub>
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
                <div className="items-center mt-5 flex flex-wrap bg-zinc-100 pt-5 pb-5">
                  {images &&
                    images.length > 0 &&
                    images.map((image, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          width: '220px',
                          height: '165px',
                          margin: '10px',
                        }}
                      >
                        <Image alt={'img'} key={idx} src={image} fill />
                        <Img_Hover_Div onClick={() => handleImgDel(image)}>
                          X
                        </Img_Hover_Div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Center_Div2 className="m-3">
              <IconExclamationCircle size={18} className="mr-1" />
              <div style={{ fontSize: '13px' }}>
                허위 매물을 등록할 경우 MySpot에서 임의로 계정 및 매물 전체 삭제
                처리됩니다.
              </div>
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
            <>
              {rooms.map((room, idx) => (
                <Manage_Div key={idx}>
                  <Manage_Div_150>
                    <Manage_Div_idx>
                      {idx + 1 + (activePage - 1) * MANAGED_ROOMS_TAKE}
                    </Manage_Div_idx>
                    <Manage_Div_Id>매물번호 {room.id}</Manage_Div_Id>
                    <div>{STATUS_MAP[room.status_id - 1]}</div>
                    <div>
                      D-
                      {differenceInDays(
                        add(new Date(room.updatedAt), { days: 30 }),
                        new Date()
                      )}{' '}
                      일
                    </div>
                  </Manage_Div_150>
                  <StyledImage style={{ width: '300px', height: '225px' }}>
                    <Image
                      alt="thumbnail"
                      className="styled"
                      src={room.images.split(',')[0]}
                      fill
                      onClick={() => router.push(`/rooms/${room.id}`)}
                    ></Image>
                  </StyledImage>
                  <Manage_Div_350>
                    <Manage_Div_Bold>
                      {CATEGORY_MAP[room.category_id - 1]}{' '}
                      {YEAR_MONTH_MAP[room.type_id - 1]} {room.deposit}
                      {room.fee !== 0 && `/${room.fee}`}
                    </Manage_Div_Bold>
                    <div>{room.doro}</div>
                    <div>{room.detail}</div>
                    <div style={{ marginTop: '20px' }}>{room.title}</div>
                  </Manage_Div_350>
                  <Manage_Div_200>
                    <Manage_Div_160>
                      등록일 : {format(new Date(room.updatedAt), 'yyyy-MM-dd')}
                    </Manage_Div_160>
                    <Manage_Div_160 className="flex">
                      <Manage_Div_75>조회수: {room.views}</Manage_Div_75>
                      <Manage_Div_75
                        style={{
                          paddingLeft: '10px',
                          borderLeft: `1px solid ${subColor_light}`,
                        }}
                      >
                        찜: {room.wished}
                      </Manage_Div_75>
                    </Manage_Div_160>
                    <Manage_Btn_Wrapper>
                      <Manage_Btn
                        onClick={() => router.push(`rooms/${room.id}/edit`)}
                      >
                        수정
                      </Manage_Btn>
                      <Manage_Btn
                        onClick={() =>
                          confirm('해당 매물을 정말 삭제하시겠습니까?') &&
                          deleteRoom(room.id)
                        }
                      >
                        삭제
                      </Manage_Btn>
                      {room.status_id === 4 ? (
                        <Manage_Btn_Dark
                          onClick={() =>
                            updateStatus({ id: room.id, status_id: 1 })
                          }
                        >
                          숨김
                        </Manage_Btn_Dark>
                      ) : (
                        <Manage_Btn
                          onClick={() =>
                            updateStatus({ id: room.id, status_id: 4 })
                          }
                        >
                          숨김
                        </Manage_Btn>
                      )}
                      {room.status_id === 2 ? (
                        <Manage_Btn_Dark
                          onClick={() =>
                            updateStatus({ id: room.id, status_id: 1 })
                          }
                        >
                          거래완료
                        </Manage_Btn_Dark>
                      ) : (
                        <Manage_Btn
                          onClick={() =>
                            updateStatus({ id: room.id, status_id: 2 })
                          }
                        >
                          거래완료
                        </Manage_Btn>
                      )}
                    </Manage_Btn_Wrapper>
                  </Manage_Div_200>
                </Manage_Div>
              ))}
              {total && (
                <Center_Div style={{ margin: '30px 0 30px 0' }}>
                  <CustomPagination
                    page={activePage}
                    onChange={setActivePage}
                    total={total}
                  />
                </Center_Div>
              )}
            </>
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
  font-size: 12px;
`
const Upload_Btn_Dark = styled(Upload_Btn)`
  color: ${subColor_lighter};
  background-color: ${mainColor};
`
const Upload_Btn_Bright = styled(Upload_Btn)`
  color: ${mainColor};
  background-color: ${subColor_lighter};
`
export const Upload_Btn_Submit = styled(Upload_Btn_Medium)`
  color: ${subColor_lighter};
  background-color: ${mainColor};
`
export const Upload_Btn_Outline = styled(Upload_Btn_Medium)`
  color: ${mainColor};
  border: 0.5px solid ${subColor_medium};
`
const Upload_Btn_Outline1 = styled(Upload_Btn_Outline)`
  margin: 10px 10px 10px 20px;
`
const Manage_Btn = styled.button`
  width: 70px;
  height: 40px;
  padding: 10px 0 10px 0;
  margin: 0px 10px 10px 0;
  background-color: ${subColor_lighter};
  color: ${subColor_Dark};
  font-size: 12px;
`
const Manage_Btn_Dark = styled(Manage_Btn)`
  background-color: ${subColor_Dark};
  color: ${subColor_lighter};
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
  padding: 10px;
  margin: 10px;
`
const Upload_Input1 = styled(Upload_Input)`
  height: 40px;
  width: 330px;
  margin: 20px 10px 20px 0;
`
const Upload_Input2 = styled(Upload_Input)`
  height: 40px;
  width: 110px;
`

const Upload_Input3 = styled(Upload_Input)`
  height: 40px;
  min-width: 840px;
  margin: 5px;
`
const Upload_Input4 = styled(Upload_Input)`
  height: 40px;
  width: 60px;
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
const Manage_Div = styled(Upload_Div_B)`
  display: flex;
  padding: 10px 0px 10px 0px;
  * {
    font-size: 14px;
  }
`
const Manage_Div_150 = styled(Center_Div)`
  flex-flow: column;
  width: 150px;
`
const Manage_Div_idx = styled.div`
  border-bottom: 0.5px solid ${subColor_medium};
  padding: 0px 10px 5px 10px;
  margin-bottom: 20px;
  font-size: 16px;
`
const FlexCol_Div = styled.div`
  flex-flow: column;
  display: flex;
`
const Manage_Div_350 = styled(FlexCol_Div)`
  width: 350px;
  padding: 30px 0 30px 30px;
`
const Manage_Div_200 = styled(FlexCol_Div)`
  width: 200px;
  padding: 20px;
  border-left: 1px solid ${subColor_light};
`
const Manage_Div_160 = styled.div`
  width: 160px;
  margin-top: 10px;
  font-size: 13px;
`
const Manage_Div_75 = styled.div`
  width: 75px;
  font-size: 13px;
`
const Manage_Div_Bold = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
`
const Manage_Btn_Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 160px;
  margin-top: auto;
`
const Img_Hover_Div = styled(HoverDiv)`
  width: 18px;
  height: 18px;
  background-color: ${subColor_light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: absolute;
  top: 5px;
  right: 5px;
`

export const Manage_Div_Id = styled.div`
  border: 1px solid ${subColor_Dark};
  font-size: 12px;
  padding: 0 3px 0 3px;
  border-radius: 2px;
  margin-bottom: 10px;
  color: ${subColor_Dark};
`

const Upload_Warning = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: red;
`