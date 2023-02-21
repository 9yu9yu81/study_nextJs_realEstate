import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Chip, FileButton, Modal } from '@mantine/core'
import { IconExclamationCircle, IconMapPin } from '@tabler/icons'
import Map from 'components/MapN'
import {
  HoverDiv,
  mainColor,
  subColor_Dark,
  subColor_light,
  subColor_lighter,
  subColor_medium,
} from 'components/styledComponent'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  YEAR_MONTH_MAP,
  TYPE_MAP,
  HEAT_MAP,
  MAINTENENCE_MAP,
  STRUCTURE_MAP,
  OPTION_MAP,
} from 'constants/const'
import format from 'date-fns/format'
import UploadCaveats from 'components/upload/UploadCaveats'
import CustomSegmentedControl from 'components/CustomSegmentedControl'
import styled from '@emotion/styled'
import { Calendar } from '@mantine/dates'
import CustomCheckBox from 'components/CustomCheckBox'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'

const DESCRIPTION_PLACEHOLDER = `[상세설명 작성 주의사항]
- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
- 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`

const DETAILADDR_PLACEHOLDER = `상세 주소
예) e편한세상 101동 1101호`

export interface RoomUploadData {
  room: Omit<Room, 'user_id' | 'updatedAt' | 'status_id' | 'views' | 'wished'>
  saleInfo: Omit<SaleInfo, 'id' | 'room_id'>
  basicInfo: Omit<BasicInfo, 'id' | 'room_id'>
  addressInfo: Omit<AddressInfo, 'id' | 'room_id'>
  moreInfo: Omit<MoreInfo, 'id' | 'room_id'>
}
type RoomAllData = Room &
  Omit<SaleInfo, 'id' | 'room_id' | 'type_id'> & { sType_id: number } & Omit<
    BasicInfo,
    'id' | 'room_id'
  > &
  Omit<AddressInfo, 'id' | 'room_id'> &
  Omit<MoreInfo, 'id' | 'room_id'>

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

export default function RoomEdit(room: RoomAllData) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const USER_CONTACT_QUERY_KEY = '/../api/user/get-Contact'
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

  const [category, setCategory] = useState<string>(String(room.category_id)) //매물종류
  const [roomType, setRoomType] = useState<string>(String(room.type_id)) //건물유형
  const [ym, setYm] = useState<string>(String(room.sType_id)) //전월세종류
  const [heat, setHeat] = useState<string>(String(room.heat_id)) //난방종류
  const [deposit, setDeposit] = useState<string>(String(room.deposit)) //보증금
  const [fee, setFee] = useState<string>(String(room.fee)) //월세
  const [area, setArea] = useState<string>(String(room.area)) //전용면적
  const [supArea, setSupArea] = useState<string>(String(room.supply_area)) //공급면적
  const [floor, setFloor] = useState<string>(String(room.floor)) //층
  const [tFloor, setTFloor] = useState<string>(String(room.total_floor)) //건물 층수
  const [title, setTitle] = useState<string>(room.title) //제목
  const [description, setDescription] = useState<string>(room.description) //상세설명
  const [images, setImages] = useState<string[]>(room.images.split(',')) //사진
  const [moveIn, setMoveIn] = useState<Date | null>(room.move_in) //입주가능일
  const [modal, setModal] = useState<boolean>(false) //캘린더 모달
  const [mChecked, setMChecked] = useState<boolean>(false) //관리비 없음 체크
  const [mFee, setMFee] = useState<string>(String(room.maintenance_fee)) //관리비
  const [mOption, setMOption] = useState<string[] | undefined>(
    room.maintenance_ids?.split(',')
  ) //관리비 항목
  const [elevator, setElevator] = useState<string>(String(room.elevator)) //엘베 유무
  const [parking, setParking] = useState<string>(String(room.parking)) //주차가능한지
  const [pFee, setPFee] = useState<string>(String(room.parking_fee)) //주차비
  const [option, setOption] = useState<string[] | undefined>(
    room.option_ids?.split(',')
  ) //옵션항목
  const [structure, setStructure] = useState<string[] | undefined>(
    room.structure_ids?.split(',')
  ) //방구조
  const [contact, setContact] = useState<string>(room.contact) //연락처
  const [cChecked, setCChecked] = useState<boolean>(false) //기존 연락처 사용할지
  //daum-postcode
  const [doro, setDoro] = useState<string>(room.doro)
  const [jibun, setJibun] = useState<string>(room.jibun)
  const [lat, setLat] = useState<number>(room.lat)
  const [lng, setLng] = useState<number>(room.lng)
  const [addr, setAddr] = useState<string>(room.doro)
  const [detailAddr, setDetailAddr] = useState<string>(room.detail)

  //daum-postcode 띄우는 함수
  const loadLayout = () => {
    window.daum.postcode.load(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data: any) {
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            setAddr(data.roadAddress)
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            setAddr(data.jibunAddress)
          }
          setDoro(data.roadAddress)
          setJibun(data.jibunAddress)
        },
      })
      postcode.open({
        q: addr,
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
      addrConverter(addr)
    })
  }
  useEffect(() => {
    onLoadKakaoMap()
  }, [addr])

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

  const { mutate: updateRoom } = useMutation<
    unknown,
    unknown,
    RoomUploadData,
    any
  >(
    (room) =>
      fetch('/api/room/update-Room', {
        method: 'POST',
        body: JSON.stringify(room),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onSuccess: async () => {
        router.push(`/rooms/${room.id}`)
      },
    }
  )

  const validate = (type: 'submit') => {
    if (cChecked === false && contact !== '' && contact !== userContact) {
      if (confirm('해당 연락처를 기존 번호로 저장 하시겠습니까?')) {
        updateContact(contact)
      }
    }
    if (type === 'submit') {
      addr === ''
        ? alert('주소를 입력하세요.')
        : detailAddr === ''
        ? alert('상세 주소를 입력하세요.')
        : deposit === ''
        ? alert('보증금을 입력하세요.')
        : ym === '2' && fee === '0'
        ? alert('월세를 입력하세요.')
        : supArea === ''
        ? alert('공급 면적을 입력하세요.')
        : area === ''
        ? alert('전용 면적을 입력하세요.')
        : tFloor === ''
        ? alert('건물 층수를 입력하세요.')
        : floor === ''
        ? alert('층수를 입력하세요.')
        : !mChecked && mFee == '0'
        ? alert('관리비를 입력해주세요. 없다면 관리비 없음을 체크해 주세요.')
        : !mChecked && mFee != '0' && mOption == null
        ? alert('관리비 항목을 선택해주세요.')
        : title === ''
        ? alert('제목을 입력하세요')
        : description === ''
        ? alert('상세 설명을 입력하세요.')
        : contact === ''
        ? alert('연락받을 번호를 입력해 주세요.')
        : images.length < 3 || images.length > 10
        ? alert('최소 3장, 최대 10장 이미지를 첨부해주세요')
        : moveIn &&
          updateRoom({
            room: {
              id: room.id,
              category_id: Number(category),
              type_id: Number(roomType),
              title: title,
              description: description,
              images: images.join(','),
              contact: contact,
            },
            saleInfo: {
              type_id: Number(ym),
              deposit: Number(deposit),
              fee: ym === '1' ? 0 : Number(fee),
            },
            basicInfo: {
              supply_area: Number(supArea),
              area: Number(area),
              total_floor: Number(tFloor),
              floor: Number(floor),
              move_in: moveIn,
              heat_id: Number(heat),
            },
            addressInfo: {
              doro: doro,
              jibun: jibun,
              detail: detailAddr,
              lat: lat,
              lng: lng,
            },
            moreInfo: {
              maintenance_fee: mChecked ? 0 : Number(mFee),
              maintenance_ids:
                mOption && mOption.length !== 0 ? mOption.join(',') : null,
              elevator: Boolean(Number(elevator)),
              parking: Boolean(Number(parking)),
              parking_fee: parking === '0' ? 0 : Number(pFee),
              option_ids:
                option && option.length !== 0 ? option.join(',') : null,
              structure_ids:
                structure && structure.length !== 0
                  ? structure.join(',')
                  : null,
            },
          })
    }
  }

  const { data: userContact } = useQuery<
    { userContact: string },
    unknown,
    string
  >([USER_CONTACT_QUERY_KEY], () =>
    fetch(USER_CONTACT_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
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

  return session && status === 'authenticated' ? (
    <div>
      <div
        style={{
          width: '1000px',
          height: '100px',
          backgroundColor: `${mainColor}`,
          color: `${subColor_light}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          margin: '120px 0 40px 0',
          fontWeight: '600',
        }}
      >
        수정하기
      </div>
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
                  onKeyUp={handleEnterKeypress}
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                />
                <Upload_Btn_Submit onClick={loadLayout} ref={postcodeButtonRef}>
                  주소 검색
                </Upload_Btn_Submit>
              </Center_Div2>
              <Upload_Textarea1
                placeholder={DETAILADDR_PLACEHOLDER}
                value={detailAddr}
                onChange={(e) => setDetailAddr(e.target.value)}
              />
            </div>
            <div className="ml-auto">
              {addr !== '' ? (
                <Map width="300px" height="280px" address={addr} />
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
                  placeholder="전세"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />{' '}
                만원
              </Upload_Div_Sub3>
            ) : (
              <>
                <Upload_Div_Sub3>
                  <Upload_Input2
                    placeholder="보증금"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                  />{' '}
                  /
                  <Upload_Input2
                    placeholder="월세"
                    onChange={(e) => setFee(e.target.value)}
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
              <Upload_Input2
                type="number"
                value={supArea}
                onChange={(e) => setSupArea(e.target.value)}
              />{' '}
              평
            </Upload_Div_Sub3>
            <Upload_Div_Sub3>
              전용 면적
              <Upload_Input2
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />{' '}
              평
            </Upload_Div_Sub3>
          </Upload_Div_Sub1>
          <Upload_Div_Sub_Title className="flex-col">
            <div>건물 층수</div>
          </Upload_Div_Sub_Title>
          <Upload_Div_Sub1 className="flex-col">
            <Upload_Div_Sub3 className="border-b">
              건물 층수
              <Upload_Input2
                type="number"
                value={tFloor}
                onChange={(e) => setTFloor(e.target.value)}
              />{' '}
              층
            </Upload_Div_Sub3>
            <Upload_Div_Sub3>
              해당 층수
              <Upload_Input2
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />{' '}
              층
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
              {format(new Date(moveIn), 'yyyy년 MM월 dd일')}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Upload_Div_Bt>
        <Upload_Div_Bt>
          <Upload_Div_Sub_Title>상세 설명</Upload_Div_Sub_Title>
          <Upload_Textarea2
            wrap="hard"
            placeholder={DESCRIPTION_PLACEHOLDER}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            {}
            <Upload_Input
              type="number"
              disabled={cChecked}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{
                width: '180px',
                marginLeft: '20px',
              }}
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
                <Upload_Btn_Submit {...props}>사진 추가하기</Upload_Btn_Submit>
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
        <Upload_Btn_Outline onClick={() => router.back()}>
          취소
        </Upload_Btn_Outline>
        <Upload_Btn_Submit
          onClick={() => {
            validate('submit')
          }}
        >
          수정하기
        </Upload_Btn_Submit>
      </Center_Div>
    </div>
  ) : (
    <Center_Div className="m-40">로그인 해주시기 바랍니다.</Center_Div>
  )
}

const fontsize: number = 14
const Upload_Btn_Medium = styled.button`
  width: 100px;
  height: 40px;
  font-size: 12px;
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
