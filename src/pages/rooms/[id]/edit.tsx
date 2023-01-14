import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Button,
  FileButton,
  Input,
  SegmentedControl,
  Textarea,
} from '@mantine/core'
import {
  IconEdit,
  IconExclamationCircle,
  IconSlash,
  IconX,
} from '@tabler/icons'
import Map from 'components/Map'
import { CHoverDiv, CenteringDiv, HoverDiv } from 'components/styledComponent'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Room } from '@prisma/client'
import { ROOM_QUERY_KEY } from 'constants/querykey'
import {
  DESCRIPTION_PLACEHOLDER,
  DETAILADDR_PLACEHOLDER,
  ROOM_CATEGORY_MAP,
} from 'constants/upload'

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

export default function roomEdit(props: Room) {
  const queryClient = useQueryClient()

  const [category, setCategory] = useState<string>(props.category)
  const [ym, setYm] = useState<string>(props.ym)
  const depositRef = useRef<HTMLInputElement | null>(null)
  const priceRef = useRef<HTMLInputElement | null>(null)
  const areaRef = useRef<HTMLInputElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const [images, setImages] = useState<string[]>([])
  const addrRef = useRef<HTMLInputElement | null>(null)
  const [addr, setAddr] = useState<string>(props.address)
  const detailAddrRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    addrRef.current && (addrRef.current.value = props.address)
    detailAddrRef.current && (detailAddrRef.current.value = props.detailAddress)
    props.deposit &&
      depositRef.current &&
      (depositRef.current.value = String(props.deposit))
    priceRef.current && (priceRef.current.value = String(props.price))
    areaRef.current && (areaRef.current.value = String(props.area))
    titleRef.current && (titleRef.current.value = props.title)
    descriptionRef.current && (descriptionRef.current.value = props.description)
    setImages(props.images.split(','))
  }, [])

  //daum-postcode 띄우는 함수
  const loadLayout = () => {
    window.daum.postcode.load(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data: any) {
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            if (addrRef.current) {
              addrRef.current.value = data.roadAddress
              setAddr(addrRef.current.value)
            }
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            if (addrRef.current) {
              addrRef.current.value = data.jibunAddress
              setAddr(addrRef.current.value)
            }
          }
        },
      })
      postcode.open({
        q: addrRef.current?.value,
      })
    })
  }
  //위치 정보 주소 쓰는 input에서 enter 를 누르면 바로 '주소검색' 버튼이 눌리게 기능 구현
  const postcodeButtonRef = useRef<HTMLButtonElement | null>(null)
  const handleEnterKeypress = (e: any) => {
    if (e.keyCode == 13) {
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

  //todo update 로 변경
  //입력받은 room data POST
  const { mutate: updateRoom } = useMutation<
    unknown,
    unknown,
    Omit<Room, 'userId' | 'id' | 'updatedAt' | 'status' | 'views'>,
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
        queryClient.invalidateQueries([ROOM_QUERY_KEY])
      },
      onSuccess: async () => {
        setCategory('0')
        setYm('0')
        setImages([])
      },
    }
  )
  //todo update 로 변경
  const validate = (type: 'update') => {
    if (type === 'update') {
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
        : updateRoom({
            category: category,
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
  return (
    <div className="text-sm">
      <CenteringDiv className="text-2xl m-14 text-zinc-600">
        <IconEdit />
        수정하기
      </CenteringDiv>
      <>
        <CenteringDiv className="relative flex-col border border-zinc-400 mt-6">
          <div className="flex font-bold m-3">
            <span>매물 정보</span>
          </div>
          <div className="flex w-full border-t border-zinc-400 text-xs items-center">
            <CenteringDiv className="w-32">매물 종류</CenteringDiv>
            <CenteringDiv className="p-3  border-l border-zinc-400">
              <SegmentedControl
                value={category}
                onChange={setCategory}
                color={'gray'}
                styles={(theme) => ({
                  root: {
                    backgroundColor: 'white',
                  },
                  label: { marginRight: 10, marginLeft: 10 },
                  active: {
                    marginRight: 10,
                    marginLeft: 10,
                    backgroundColor: '#52525B',
                  },
                  control: { borderWidth: '0px !important' },
                })}
                transitionDuration={0}
                data={ROOM_CATEGORY_MAP.map((label, id) => ({
                  label: label,
                  value: String(id),
                }))}
              />
            </CenteringDiv>
          </div>
        </CenteringDiv>
        <CenteringDiv className="relative flex-col  border border-zinc-400 mt-6 ">
          <div className="flex font-bold m-3">
            <span>위치 정보</span>
            <div className="absolute right-5">
              <span className="text-zinc-400" style={{ fontSize: 12 }}>
                *등기부등본 상의 주소를 입력해 주세요.
              </span>
            </div>
          </div>
          <div className="flex items-center w-full border-t border-zinc-400 text-xs">
            <CenteringDiv className="w-32">주소</CenteringDiv>
            <div className="h-72 border-l border-zinc-400 pl-10 pt-14">
              <div className="flex items-center text-zinc-400 mb-3">
                <IconExclamationCircle className="mr-1" />
                <span>도로명, 건물명, 지번에 대해 통합검색이 가능합니다.</span>
              </div>
              <div className="flex mb-5">
                <Input
                  className="w-full"
                  id="input"
                  type={'text'}
                  placeholder="예) 번동 10-1, 강북구 번동"
                  ref={addrRef}
                  onKeyUp={handleEnterKeypress}
                />
                <Button
                  className="bg-zinc-600 text-zinc-100 ml-1"
                  radius={'sm'}
                  color={'gray'}
                  onClick={loadLayout}
                  ref={postcodeButtonRef}
                >
                  주소 검색
                </Button>
              </div>
              <Textarea
                className="w-full"
                minRows={4}
                placeholder={DETAILADDR_PLACEHOLDER}
                ref={detailAddrRef}
              />
            </div>
            <div className="ml-12 p-3">
              <Map width="330px" height="300px" address={addr} />
            </div>
          </div>
        </CenteringDiv>
        <CenteringDiv className="relative flex-col  border border-zinc-400 mt-6">
          <div className="flex font-bold m-3">
            <span>거래 정보</span>
          </div>
          <div className="flex w-full  border-t border-zinc-400 text-xs items-center">
            <div className="w-32 flex justify-center">거래 종류</div>
            <CenteringDiv className="p-3  border-l border-zinc-400">
              <SegmentedControl
                className="mr-5"
                value={ym}
                onChange={setYm}
                color={'gray'}
                styles={(theme) => ({
                  root: {
                    backgroundColor: 'white',
                  },
                  label: { marginRight: 10, marginLeft: 10 },
                  active: {
                    marginRight: 10,
                    marginLeft: 10,
                    backgroundColor: '#52525B',
                  },
                  control: { borderWidth: '0px !important' },
                })}
                transitionDuration={0}
                data={[
                  { label: '전세', value: '0' },
                  { label: '월세', value: '1' },
                ]}
              />
              {ym === '0' ? (
                <>
                  <CenteringDiv className="space-x-1">
                    <Input type="text" placeholder="전세" ref={priceRef} />
                    <span>만원</span>
                  </CenteringDiv>
                </>
              ) : (
                <>
                  <CenteringDiv className="space-x-1">
                    <Input type="text" placeholder="보증금" ref={depositRef} />
                    <IconSlash />
                    <Input type="text" placeholder="월세" ref={priceRef} />
                    <span>만원</span>
                  </CenteringDiv>
                </>
              )}
            </CenteringDiv>
          </div>
        </CenteringDiv>
        <CenteringDiv className="relative flex-col  border border-zinc-400 mt-6">
          <div className="flex font-bold m-3">
            <span>기본 정보</span>
          </div>
          <div className="flex w-full  border-t border-zinc-400 text-xs items-center">
            <div className="w-32 flex justify-center">건물 크기</div>
            <CenteringDiv className="p-3  border-l border-zinc-400">
              <div className="flex ">
                <Input type="text" placeholder="평" ref={areaRef} />
              </div>
            </CenteringDiv>
          </div>
        </CenteringDiv>
        <CenteringDiv className="relative flex-col border border-zinc-400 mt-6">
          <div className="flex font-bold m-3">
            <span>상세 정보</span>
          </div>
          <div className="flex flex-col w-full  border-t border-zinc-400 text-xs items-center">
            <div className="flex w-full items-center  border-b border-zinc-300">
              <div className="w-32 flex justify-center">제목</div>
              <div className="p-3  border-l border-zinc-400">
                <Input
                  style={{ width: '800px' }}
                  placeholder="예) 신논현역 도보 5분거리, 혼자 살기 좋은 방 입니다."
                  ref={titleRef}
                />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-32 flex justify-center">상세 설명</div>
              <div className="p-3  border-l border-zinc-400">
                <Textarea
                  style={{ width: '800px' }}
                  minRows={8}
                  wrap="hard"
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  ref={descriptionRef}
                />
              </div>
            </div>
          </div>
        </CenteringDiv>
        <div className="relative flex flex-col  border border-zinc-400 mt-6 items-center">
          <div className="flex font-bold m-3">
            <span>사진 등록</span>
          </div>
          <div className="flex flex-col w-full p-3  border-t border-zinc-400 text-xs items-center">
            <div className="p-3 w-full border border-zinc-300 text-zinc-500 text-xs leading-5">
              - 사진은 가로로 찍은 사진을 권장합니다.
              <br />- 사진 용량은 사진 한 장당 200KB 까지 등록 가능합니다.
              <br />- 사진은 최소 5장 이상 등록해야하며, 최대 10장까지 등록
              가능합니다.
            </div>
            <div>
              <div className="m-5 p-5 bg-zinc-100" style={{ width: '950px' }}>
                <div className="mb-5">
                  <FileButton accept="image/*" multiple onChange={setFiles}>
                    {(props) => (
                      <Button
                        {...props}
                        className="bg-zinc-600 text-zinc-100 ml-1"
                        radius={'sm'}
                        color={'gray'}
                      >
                        사진 추가하기
                      </Button>
                    )}
                  </FileButton>
                </div>
                <div className="grid grid-cols-4 items-center space-y-2">
                  {images &&
                    images.length > 0 &&
                    images.map((image, idx) => (
                      <div className="relative" key={idx}>
                        <Image
                          className="border border-zinc-400"
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
            <div
              className="flex items-center text-zinc-400 mr-auto"
              style={{ fontSize: '13px' }}
            >
              <IconExclamationCircle size={18} className="mr-1" />
              <span>
                허위 매물을 등록할 경우 MySpot에서 임의로 계정 및 매물 전체 삭제
                처리됩니다.
              </span>
            </div>
          </div>
        </div>
        <CenteringDiv className="m-5 space-x-5">
          <CHoverDiv
            className="p-2 bg-red-500 text-white font-normal"
            style={{ width: '140px' }}
          >
            <IconX size={18} />
            취소
          </CHoverDiv>
          <CHoverDiv
            className="p-2 bg-blue-400 text-white font-normal"
            style={{ width: '140px' }}
            onClick={() => {
              validate('update')
            }}
          >
            <IconEdit size={18} />
            수정하기
          </CHoverDiv>
        </CenteringDiv>
      </>
    </div>
  )
}
