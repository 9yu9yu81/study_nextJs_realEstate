import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Input, SegmentedControl, Textarea } from '@mantine/core'
import { IconExclamationCircle, IconMapPin } from '@tabler/icons'
import Map from 'components/Map'
import Postcode from 'components/Postcode'
import ImageUploader from 'components/ImageUploader'

const id = 'daum-postcode' // script가 이미 rending 되어 있는지 확인하기 위한 ID
const src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

export default function upload() {
  const placeholder = `[상세설명 작성 주의사항]
  - 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
  - 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

  위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`
  const [isUploadPage, setIsUploadPage] = useState(true)
  //todo segmentedControl value -> setCategory -> Room category

  //todo 거래 정보에서 월세, 전세 선택에 따라 보여지는 정보 다르게(월세: 보증금/월세 전세:전세)
  //todo 여유가 된다면 추가정보 및 디테일 들도 받을 수 있게 해보자
  //todo upload 데이터 받아서 db Room table create
  //todo 내 방관리에서는 올린 매물 보여주고 그 매물 정보 수정할 수도 있게 -> db updated

  //db에 올릴 state
  const [category, setCategory] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  //todo 등록하기 버튼 onClick => addr, detailAddr 합쳐서 address에 집어넣기
  const [address, setAddress] = useState<string>('')
  //todo 등록하기 버튼 => 건물크기, 제목, 상세설명, 이미지 state 받고 db Room 테이블에 추가

  //daum-postcode
  const addrRef = useRef<HTMLInputElement | null>(null)
  const [addr, setAddr] = useState<string>('')
  const detailAddrRef = useRef<HTMLTextAreaElement | null>(null)
  const [detailAddr, setDetailAddr] = useState<string>('')
  const [mapAddr, setMapAddr] = useState<string>('')
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
          if (addrRef.current?.value) {
            addrRef.current.value = addr
          }
          setMapAddr(data.address)
        },
      })
      postcode.open({
        q: addr,
      })
    })
  }
  //daum-postcode 를 위해 script문 생성
  useEffect(() => {
    const isAlready = document.getElementById(id)

    if (!isAlready) {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      document.body.append(script)
    }
  }, [])

  useMemo(() => {}, [])

  return (
    <div className="mt-10">
      <div className="flex justify-center items-center">
        <Link href="/" className="flex">
          <Image
            className="mr-1"
            src="/../public/images/home.png"
            alt="home"
            width={55}
            height={55}
          ></Image>
          <div className="text-3xl">MySpot</div>
        </Link>
      </div>
      {isUploadPage ? (
        <>
          <div className="flex justify-center items-center mt-14 text-sm">
            <button
              className=" border border-zinc-400 bg-zinc-600 text-zinc-100"
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(true)}
            >
              방 내놓기
            </button>
            <button
              className=" border border-zinc-400"
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(false)}
            >
              내 방 관리
            </button>
          </div>
          <div className="w-full mt-6 p-4  border border-zinc-300 text-zinc-500 text-xs leading-5">
            ∙ 전/월세 매물만 등록할 수 있습니다.
            <br />∙ 한 번에 1개의 매물만 등록 가능하며, 직거래로 표시됩니다.
            <br />∙ 등록한 매물은 30일 간 노출됩니다.
          </div>
          <div className="relative flex flex-col border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>매물 정보</span>
            </div>
            <div className="flex w-full border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">매물 종류</div>
              <div className="flex justify items-center p-3  border-l border-zinc-400">
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
                  data={[
                    { label: '원룸', value: '0' },
                    { label: '투룸', value: '1' },
                    { label: '쓰리룸', value: '2' },
                    { label: '그 외', value: '3' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="relative flex flex-col  border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>위치 정보</span>
              <div className="absolute right-5">
                <span className="text-zinc-400" style={{ fontSize: 12 }}>
                  *등기부등본 상의 주소를 입력해 주세요.
                </span>
              </div>
            </div>
            <div className="flex w-full  border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">주소</div>
              <div className="h-72  border-l border-zinc-400 pl-10 pt-14">
                <div className="flex items-center text-zinc-400 mb-3">
                  <IconExclamationCircle className="mr-1" />
                  <span>
                    도로명, 건물명, 지번에 대해 통합검색이 가능합니다.
                  </span>
                </div>
                <div className="flex mb-5">
                  <Input
                    className="w-full"
                    id="input"
                    type={'text'}
                    placeholder="예) 번동 10-1, 강북구 번동"
                    ref={addrRef}
                    value={addr}
                    disabled
                    onChange={() =>
                      addrRef.current?.value && setAddr(addrRef.current?.value)
                    }
                  />
                  <Button
                    className="bg-zinc-600 text-zinc-100 ml-1"
                    radius={'sm'}
                    color={'gray'}
                    onClick={loadLayout}
                  >
                    주소 검색
                  </Button>
                </div>
                <Textarea
                  className="w-full"
                  minRows={4}
                  placeholder="상세 주소) 동, 호수 등"
                  value={detailAddr}
                  ref={detailAddrRef}
                  onChange={() =>
                    detailAddrRef.current?.value &&
                    setDetailAddr(detailAddrRef.current?.value)
                  }
                />
              </div>
              <div className="ml-12 p-3">
                {addr !== '' ? (
                  <Map width="330px" height="300px" address={mapAddr} />
                ) : (
                  <div
                    className="border flex flex-col justify-center items-center text-zinc-400"
                    style={{ width: '330px', height: '300px' }}
                  >
                    <IconMapPin />
                    <div>주소 검색을 하시면</div>
                    <div>해당 위치가 지도에 표시됩니다.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col  border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>거래 정보</span>
            </div>
            <div className="flex w-full  border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">거래 종류</div>
              <div className="flex justify-center items-center p-3  border-l border-zinc-400">
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
                    <div className="flex">
                      <Input type="text" placeholder="전세" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Input type="text" placeholder="보증금" />
                      <Input type="text" placeholder="월세" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex flex-col  border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>기본 정보</span>
            </div>
            <div className="flex w-full  border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">건물 크기</div>
              <div className="flex justify-center items-center p-3  border-l border-zinc-400">
                <div className="flex ">
                  <Input type="text" placeholder="평" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col  border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>상세 정보</span>
            </div>
            <div className="flex flex-col w-full  border-t border-zinc-400 text-xs items-center">
              <div className="flex w-full items-center  border-b border-zinc-300">
                <div className="w-32 flex justify-center">제목</div>
                <div className="p-3  border-l border-zinc-400">
                  <Input
                    style={{ width: '800px' }}
                    placeholder="예) 신논현역 도보 5분거리, 혼자 살기 좋은 방 입니다."
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
                    placeholder={placeholder}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col  border border-zinc-400 mt-6 items-center">
            <div className="flex text-sm font-bold m-3">
              <span>사진 등록</span>
            </div>
            <div className="flex flex-col w-full p-3  border-t border-zinc-400 text-xs items-center">
              <div className="p-3 w-full border border-zinc-300 text-zinc-500 text-xs leading-5">
                - 사진은 가로로 찍은 사진을 권장합니다.
                <br />- 사진 용량은 사진 한 장당 200KB 까지 등록 가능합니다.
                <br />- 사진은 최소 3장 이상 등록해야하며, 최대 8장 까지
                권장합니다.
              </div>
              <div>
                <ImageUploader />
              </div>
              <div
                className="flex items-center text-zinc-400 mr-auto"
                style={{ fontSize: '13px' }}
              >
                <IconExclamationCircle size={18} className="mr-1" />
                <span>
                  허위 매물을 등록할 경우 MySpot에서 임의로 계정 및 매물 전체
                  삭제 처리됩니다.
                </span>
              </div>
            </div>
          </div>
          <div className="flex m-5 justify-center items-center space-x-5 text-sm">
            <button
              className=" border border-zinc-400 rounde"
              style={{ width: '120px', height: '50px' }}
            >
              취소
            </button>
            <button
              className=" border border-zinc-400 bg-zinc-600 text-zinc-100"
              style={{ width: '120px', height: '50px' }}
            >
              등록하기
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center mt-14 text-sm">
            <button
              className=" border border-zinc-400 "
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(true)}
            >
              방 내놓기
            </button>
            <button
              className=" border border-zinc-400 bg-zinc-600 text-zinc-100"
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(false)}
            >
              내 방 관리
            </button>
          </div>
          <div className="w-full mt-6 p-4  border border-zinc-300 text-zinc-500 text-xs leading-5">
            ∙ 전/월세 매물만 등록할 수 있습니다.
            <br />∙ 한 번에 1개의 매물만 등록 가능하며, 직거래로 표시됩니다.
            <br />∙ 등록한 매물은 30일 간 노출됩니다.
            <br />∙ 공개중 : 내가 등록한 매물이 공개중인 상태
            <br />∙ 거래완료 : 등록한 매물이 거래완료된 상태
          </div>
          <div className="flex justify-center items-center mt-40 mb-40 text-sm">
            <div>등록된 매물이 없습니다.</div>
          </div>
        </>
      )}
    </div>
  )
}
