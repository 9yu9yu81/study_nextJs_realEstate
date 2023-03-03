import { Input, Loader, Menu } from '@mantine/core'
import {
  IconArrowDown,
  IconCheckbox,
  IconHeart,
  IconSearch,
  IconSortDescending,
} from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CHoverDiv, Center_Div, StyledImage } from 'components/styledComponent'
import { FILTERS, CATEGORY_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Map from 'components/MapN'
import { useRef } from 'react'

//todo myspot analytics 에 어떤 내용 들어갈지도 생각 해봐야함

export default function Rooms() {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const router = useRouter()
  const [category, setCategory] = useState<string>('-1')
  const [ym, setYm] = useState<string>('-1')
  const [activePage, setActivePage] = useState<number>(1)
  const mainKeyword = router.query.mainKeyword
  const searchRef = useRef<HTMLInputElement | null>(null)
  //home으로부터 받은 검색어 값을 받는 state
  const [keyword, setKeyword] = useState(mainKeyword)
  //정렬 기준 받는
  const [filter, setFilter] = useState<string>(FILTERS[0].value)

  const handleEnterKeypress = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      searchRef && setKeyword(searchRef.current?.value)
      router.push(`/rooms?mainKeyword=${searchRef.current?.value}`)
    }
  }

  return (
    <div className="text-zinc-600">
      <div className="font-semibold text-xl m-3"> {keyword}</div>
      <Map width="1000px" height="500px" address={String(keyword)} />
      <div className="grid grid-cols-6 items-center m-5 text-xs">
        <Center_Div className="col-span-2">
          <Input
            className="w-full"
            icon={<IconSearch size={16} />}
            placeholder="지역을 입력하세요"
            ref={searchRef}
            onKeyUp={handleEnterKeypress}
          />
        </Center_Div>
        <Center_Div>
          <Menu width={130}>
            <Menu.Target>
              <CHoverDiv>
                매물 종류
                <IconArrowDown size={15} />
              </CHoverDiv>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item value={'-1'} onClick={() => setCategory('-1')}>
                <Center_Div>전체</Center_Div>
              </Menu.Item>
              {CATEGORY_MAP.map((cat, idx) => (
                <Menu.Item value={idx} onClick={() => setCategory(String(idx))}>
                  <Center_Div>{cat}</Center_Div>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Center_Div>
        <Center_Div>
          <Menu width={130}>
            <Menu.Target>
              <CHoverDiv>
                전세/월세
                <IconArrowDown size={15} />
              </CHoverDiv>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item value={-1} onClick={() => setYm('-1')}>
                <Center_Div>전체</Center_Div>
              </Menu.Item>
              {YEAR_MONTH_MAP.map((cat, idx) => (
                <Menu.Item value={idx} onClick={() => setYm(String(idx))}>
                  <Center_Div>{cat}</Center_Div>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Center_Div>{' '}
        <Center_Div>
          <Menu>
            <Menu.Target>
              <CHoverDiv>
                세부 사항
                <IconCheckbox size={15} />
              </CHoverDiv>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>checkbox modal</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Center_Div>
        <Center_Div>
          <Menu width={130}>
            <Menu.Target>
              <CHoverDiv>
                정렬 기준
                <IconSortDescending size={15} />
              </CHoverDiv>
            </Menu.Target>
            <Menu.Dropdown>
              {FILTERS.map((filter) => (
                <Menu.Item
                  value={filter.value}
                  onClick={() => setFilter(filter.value)}
                >
                  <Center_Div>{filter.label}</Center_Div>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Center_Div>
      </div>
      {status === 'authenticated' ? (
        <Center_Div className="m-40">
          <Loader />
        </Center_Div>
      ) : (
        <div className="flex flex-col space-y-3 mt-3 text-sm font-light text-zinc-500">
          test
          {/* {rooms &&
            (rooms.length === 0 ? (
              <>
                <Center_Div className="mt-40 mb-40 text-xl font-bold">
                  {keyword} 에 <br />
                  해당하는 매물이 존재하지 않습니다.
                </Center_Div>
              </>
            ) : (
              <>
                {rooms.map((room, idx) => (
                  <div className="border-b p-3" key={idx}>
                    <div className="flex">
                      <Center_Div className="relative">
                        <StyledImage
                          onClick={() => router.push(`/rooms/${room.id}`)}
                          style={{
                            width: '280px',
                            height: '210px',
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
                        {session ? (
                          <CHoverDiv className="absolute left-4 top-4">
                            {wishLoading ? (
                              <Loader size={15} />
                            ) : isWished(room.id) ? (
                              <IconHeart
                                onClick={() => {
                                  updateWishlist(room.id)
                                }}
                                size={25}
                                color={'red'}
                                fill={'red'}
                              />
                            ) : (
                              <IconHeartBroken
                                onClick={() => {
                                  updateWishlist(room.id)
                                }}
                                size={25}
                                stroke={1.5}
                              />
                            )}
                          </CHoverDiv>
                        ) : (
                          <>
                            <CHoverDiv>
                              <IconHeartbeat
                                onClick={() => {
                                  router.push('/auth/login')
                                }}
                                size={25}
                                stroke={1.5}
                                className="absolute left-4 top-4"
                              />
                            </CHoverDiv>
                          </>
                        )}
                      </Center_Div>
                      <div className="p-3 w-full">
                        <div className="flex mb-1">
                          {room.title}
                          <Center_Div className="ml-auto text-xs">
                            <IconEye size={15} />
                            {room.views}
                            <IconHeart size={15} className="ml-1" />
                            {room.wished}
                          </Center_Div>
                        </div>
                        <div className="flex space-x-3">
                          <CBbstyled>매물 정보</CBbstyled>
                          <Cstyled>-</Cstyled>
                          <CBbstyled>
                            매물 종류 : {CATEGORY_MAP[Number(room.categoryId)]}
                          </CBbstyled>
                        </div>
                        <div className="flex space-x-3">
                          <CBbstyled>위치 정보</CBbstyled>
                          <Cstyled>-</Cstyled>
                          <CBbstyled>주소 : {room.address} </CBbstyled>
                          <CBbstyled>상세 : {room.detailAddress} </CBbstyled>
                        </div>
                        <div className="flex space-x-3">
                          <CBbstyled>거래 정보</CBbstyled>
                          <Cstyled>-</Cstyled>
                          {room.ym === '0' ? (
                            <>
                              <CBbstyled>전세 : {room.price} 만원</CBbstyled>
                            </>
                          ) : (
                            <>
                              <CBbstyled>
                                보증금 : {room.deposit} 만원
                              </CBbstyled>
                              <CBbstyled>월세 : {room.price} 만원</CBbstyled>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <CBbstyled>기본 정보</CBbstyled>
                          <Cstyled>-</Cstyled>
                          <CBbstyled>크기 : {room.area} 평 </CBbstyled>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Center_Div className="mt-10">
                  {total && (
                    <Pagination
                      color={'gray'}
                      page={activePage}
                      onChange={setActivePage}
                      total={total}
                    />
                  )}
                </Center_Div>
              </>
            ))} */}
        </div>
      )}
    </div>
  )
}
