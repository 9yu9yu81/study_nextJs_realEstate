import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge, Button, Input, SegmentedControl } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons'
import Map from 'components/Map'

export default function upload() {
  const [isUploadPage, setIsUploadPage] = useState(true)
  //todo segmentedControl value -> setCategory -> Room category
  //todo 주소검색 전에는 빈 지도를 보여주고 주소 검색 후에 그 주소가 지도에 보이게끔 하기
  //todo 거래 정보에서 월세, 전세 선택에 따라 보여지는 정보 다르게(월세: 보증금/월세 전세:전세)
  //todo 여유가 된다면 추가정보도 받을 수 있게 해보자

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
              <div className="pr-10 pl-10">매물 종류</div>
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
              <div className="pr-10 pl-10">주소</div>
              <div className="w-96 h-80 border-solid border-l border-zinc-400 p-5 pt-24">
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
                <Input
                  className="w-full"
                  id="input-demo"
                  type={'text'}
                  placeholder="상세주소"
                />
              </div>
              <div className="p-4">
                <Map width="350px" height="350px" />
              </div>
            </div>
          </div>
          <div className="relative flex flex-col border-solid border border-zinc-400 mt-6 justify-center items-center">
            <div className="flex text-sm font-bold m-3">
              <span>거래 정보</span>
              <div className="absolute right-5">
                <span className="text-zinc-400" style={{ fontSize: 12 }}>
                  *등기부등본 상의 주소를 입력해 주세요.
                </span>
              </div>
            </div>
            <div className="flex w-full border-solid border-t border-zinc-400 text-xs items-center">
              <div className="pr-10 pl-10">거래 종류</div>
              <div className="flex justify items-center p-3 border-solid border-l border-zinc-400">
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
