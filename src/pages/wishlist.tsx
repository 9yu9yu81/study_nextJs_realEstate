//todo 삭제버튼(하트버튼 -> )

import { Button, Center, Loader, SegmentedControl } from '@mantine/core'
import { Room } from '@prisma/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  B,
  CBstyled,
  CHoverDiv,
  Cb,
  CenteringDiv,
  StyledImage,
  mainColor,
} from 'components/styledComponent'
import { WISHLISTS_QUERY_KEY } from 'constants/querykey'
import { ROOM_CATEGORY_MAP, ROOM_YM_MAP } from 'constants/upload'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import { IconHeart } from '@tabler/icons'

//todo 하트 -> 관심 목록 추가 제거

export default function wishlist() {
  const router = useRouter()
  const { data: wishlists, isLoading } = useQuery<
    { wishlists: Room[] },
    unknown,
    Room[]
  >([WISHLISTS_QUERY_KEY], () =>
    fetch(WISHLISTS_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )
  const [category, setCategory] = useState('0')
  const [ym, setYm] = useState('0')

  return isLoading ? (
    <CenteringDiv className="m-72">
      <Loader />
    </CenteringDiv>
  ) : wishlists ? (
    <>
      <div className="p-3">
        <div className="flex flex-col">
          <SegmentedControl
            value={category}
            onChange={setCategory}
            color={'gray'}
            styles={(theme) => ({
              root: {
                backgroundColor: 'white',
              },
              label: {
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: '#F6F6F6',
              },
              labelActive: {
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: '#52525B',
              },
              active: {
                marginRight: 10,
                marginLeft: 10,
              },
              control: { borderWidth: '0px !important' },
            })}
            transitionDuration={0}
            data={ROOM_CATEGORY_MAP.map((label, id) => ({
              label: label,
              value: String(id),
            }))}
          />
          <SegmentedControl
            value={ym}
            onChange={setYm}
            color={'gray'}
            styles={(theme) => ({
              root: {
                backgroundColor: 'white',
              },
              label: {
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: '#F6F6F6',
              },
              labelActive: {
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: '#52525B',
              },
              active: {
                marginRight: 10,
                marginLeft: 10,
              },
              control: { borderWidth: '0px !important' },
            })}
            transitionDuration={0}
            data={ROOM_YM_MAP.map((label, id) => ({
              label: label,
              value: String(id),
            }))}
          />
        </div>
        <div className="grid grid-cols-3 mt-5">
          {wishlists.map((wishlist) => (
            <B className="m-2 p-1 rounded-md">
              <CenteringDiv>
                <StyledImage
                  className="relative"
                  onClick={() => router.push(`/rooms/${wishlist.id}`)}
                  style={{
                    width: '280px',
                    height: '210px',
                    margin: '10px',
                  }}
                >
                  <Image
                    className="styled"
                    src={wishlist.images.split(',')[0]}
                    alt={'thumbnail'}
                    fill
                  />
                  <CHoverDiv>
                    <IconHeart
                      size={20}
                      color={'red'}
                      fill={'red'}
                      className="absolute right-2 top-2"
                    />
                  </CHoverDiv>
                </StyledImage>
              </CenteringDiv>
              <CenteringDiv
                className="font-light text-zinc-600 text-xs
              "
              ></CenteringDiv>
              <div className="p-2 flex flex-col space-y-1">
                <CBstyled>{wishlist.address}</CBstyled>
                <div className="grid grid-cols-2 space-x-2">
                  <CBstyled>{ROOM_YM_MAP[Number(wishlist.ym)]}</CBstyled>
                  <CBstyled>
                    {ROOM_CATEGORY_MAP[Number(wishlist.categoryId)]}
                  </CBstyled>
                </div>
                <div className="grid grid-cols-2 space-x-2">
                  <CBstyled>
                    {wishlist.ym === '0'
                      ? `${wishlist.price}만원`
                      : `${wishlist.deposit} / ${wishlist.price}만원`}
                  </CBstyled>
                  <CBstyled>{wishlist.area}평</CBstyled>
                </div>
              </div>
            </B>
          ))}
        </div>
      </div>
    </>
  ) : (
    <>관심 목록이 비어있습니다.</>
  )
}
