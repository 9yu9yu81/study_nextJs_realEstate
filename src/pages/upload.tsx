import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge, Button, Input, SegmentedControl, Textarea } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons'
import Map from 'components/Map'

export default function upload() {
  const placeholder = `[상세설명 작성 주의사항]
  - 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
  - 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

  위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`
  const [isUploadPage, setIsUploadPage] = useState(true)
  //todo segmentedControl value -> setCategory -> Room category
  //todo 주소검색 전에는 빈 지도를 보여주고 주소 검색 후에 그 주소가 지도에 보이게끔 하기
  //todo 거래 정보에서 월세, 전세 선택에 따라 보여지는 정보 다르게(월세: 보증금/월세 전세:전세)
  //todo 여유가 된다면 추가정보 및 디테일 들도 받을 수 있게 해보자
  //todo upload 데이터 받아서 db Room table create
  //todo 내 방관리에서는 올린 매물 보여주고 그 매물 정보 수정할 수도 있게 -> db updated

  const [category, setCategory] = useState<string>('0')
  const [ym, setYm] = useState<string>('0')
  return (
    <div>
      <div className="flex justify-center items-center">
        <Link href="/" className="flex">
          <Image
            className="mr-1"
            src="/../public/home.png"
            alt="logo"
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
              className="border-solid border border-zinc-400 bg-zinc-700 text-zinc-100"
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(true)}
            >
              방 내놓기
            </button>
            <button
              className="border-solid border border-zinc-400"
              style={{ width: '50vw', height: '5vh' }}
              onClick={() => setIsUploadPage(false)}
            >
              내 방 관리
            </button>
          </div>
          <div className="w-full mt-6 p-4 border-solid border border-zinc-300 text-zinc-500 text-xs">
            ∙ 전/월세 매물만 등록할 수 있습니다.
            <br />∙ 한 번에 1개의 매물만 등록 가능하며, 직거래로 표시됩니다.
            <br />∙ 등록한 매물은 30일 간 노출됩니다.
          </div>
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>매물 정보</span>
            </div>
            <div className="flex w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">매물 종류</div>
              <div className="flex justify items-center p-3 border-solid border-l border-zinc-400">
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
                      backgroundColor: '#52525A',
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
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>위치 정보</span>
              <div className="absolute right-5">
                <span className="text-zinc-400" style={{ fontSize: 12 }}>
                  *등기부등본 상의 주소를 입력해 주세요.
                </span>
              </div>
            </div>
            <div className="flex w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">주소</div>
              <div className="h-72 border-solid border-l border-zinc-400 pl-10 pt-14">
                <div className="flex items-center text-zinc-400 mb-3">
                  <IconExclamationCircle className="mr-1" />
                  <span>
                    도로명, 건물명, 지번에 대해 통합검색이 가능합니다.
                  </span>
                </div>
                <form className="flex mb-5">
                  <Input
                    className="w-full"
                    id="input-demo"
                    type={'text'}
                    placeholder="예) 번동 10-1, 강북구 번동"
                  />
                  <Button
                    className="bg-zinc-600 text-zinc-100 ml-1"
                    radius={'sm'}
                    type="submit"
                    color={'gray'}
                    onSubmit={() => {}}
                  >
                    주소 검색
                  </Button>
                </form>
                <Textarea
                  className="w-full"
                  minRows={4}
                  placeholder="상세 주소"
                />
              </div>
              <div className="ml-12 p-3">
                <Map width="330px" height="330px" />
              </div>
            </div>
          </div>
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>거래 정보</span>
            </div>
            <div className="flex w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">거래 종류</div>
              <div className="flex justify-center items-center p-3 border-solid border-l border-zinc-400">
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
                      backgroundColor: '#52525A',
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
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>기본 정보</span>
            </div>
            <div className="flex w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="w-32 flex justify-center">건물 크기</div>
              <div className="flex justify-center items-center p-3 border-solid border-l border-zinc-400">
                <div className="flex ">
                  <Input type="text" placeholder="평" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>상세 정보</span>
            </div>
            <div className="flex flex-col w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="flex w-full items-center border-solid border-b border-zinc-300">
                <div className="w-32 flex justify-center">제목</div>
                <div className="p-3 border-solid border-l border-zinc-400">
                  <Input
                    style={{ width: '78vw' }}
                    placeholder="예) 신논현역 도보 5분거리, 혼자 살기 좋은 방 입니다."
                  />
                </div>
              </div>
              <div className="flex w-full items-center">
                <div className="w-32 flex justify-center">상세 설명</div>
                <div className="p-3 border-solid border-l border-zinc-400">
                  <Textarea
                    style={{ width: '78vw' }}
                    minRows={8}
                    wrap="hard"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center mt-14 text-sm">
            <button
              className="border-solid border border-zinc-400"
              style={{ width: '45vw', height: '5vh' }}
              onClick={() => setIsUploadPage(true)}
            >
              방 내놓기
            </button>
            <button
              className="border-solid border border-zinc-400  bg-zinc-700 text-zinc-100"
              style={{ width: '45vw', height: '5vh' }}
              onClick={() => setIsUploadPage(false)}
            >
              내 방 관리
            </button>
          </div>
        </>
      )}
    </div>
  )
}
