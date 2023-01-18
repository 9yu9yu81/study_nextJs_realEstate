//todo 삭제버튼(하트버튼)
//todo pagination 구현

import { Loader, Pagination, SegmentedControl } from '@mantine/core'
import { Room } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  B,
  CBstyled,
  CHoverDiv,
  CenteringDiv,
  StyledImage,
} from 'components/styledComponent'
import { WISHLISTS_QUERY_KEY } from 'constants/querykey'
import { ROOM_CATEGORY_MAP, ROOM_YM_MAP, WISHLIST_TAKE } from 'constants/const'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import { IconHeart } from '@tabler/icons'
import { useSession } from 'next-auth/react'

//todo 하트 -> 관심 목록 추가 제거

export default function wishlist() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const session = useSession()
  const [activePage, setActivePage] = useState(1)
  const [category, setCategory] = useState<string>('-1')
  const [ym, setYm] = useState<string>('-1')

  //get wishlists per page
  const { data: wishlists, isLoading } = useQuery<
    { wishlists: Room[] },
    unknown,
    Room[]
  >(
    [
      `api/wishlist/get-Wishlists-page?skip=${
        (activePage - 1) * WISHLIST_TAKE
      }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
    ],
    () =>
      fetch(
        `api/wishlist/get-Wishlists-page?skip=${
          (activePage - 1) * WISHLIST_TAKE
        }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`
      )
        .then((res) => res.json())
        .then((data) => data.items)
  )
  //get total page
  const { data: total } = useQuery(
    [`api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`],
    () =>
      fetch(`api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`)
        .then((res) => res.json())
        .then((data) =>
          data.items === 0 ? 1 : Math.ceil(data.items / WISHLIST_TAKE)
        ),
    {
      onSuccess: async () => {
        setActivePage(1)
      },
    }
  )

  //delete wishlist
  const { mutate: updateWishlist } = useMutation<unknown, unknown, number, any>(
    (roomId) =>
      fetch('/api/wishlist/update-Wishlist', {
        method: 'POST',
        body: JSON.stringify(roomId),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (roomId) => {
        await queryClient.cancelQueries({ queryKey: [WISHLISTS_QUERY_KEY] })
        const previous = queryClient.getQueryData([WISHLISTS_QUERY_KEY])

        queryClient.setQueryData<Room[]>(
          [
            `api/wishlist/get-Wishlists-page?skip=${
              (activePage - 1) * WISHLIST_TAKE
            }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
          ],
          (olds) => olds?.filter((f) => f.id !== roomId)
        )

        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLISTS_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([
          `api/wishlist/get-Wishlists-page?skip=${
            (activePage - 1) * WISHLIST_TAKE
          }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
        ])
        queryClient.invalidateQueries([
          `api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`,
        ])
      },
    }
  )

  return session ? (
    isLoading ? (
      <CenteringDiv className="m-72">
        <Loader />
      </CenteringDiv>
    ) : wishlists ? (
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
            data={[
              {
                label: '전체',
                value: '-1',
              },
              ...ROOM_CATEGORY_MAP.map((label, id) => ({
                label: label,
                value: String(id),
              })),
            ]}
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
            data={[
              {
                label: '전체',
                value: '-1',
              },
              ...ROOM_YM_MAP.map((label, id) => ({
                label: label,
                value: String(id),
              })),
            ]}
          />
        </div>
        <div className="grid grid-cols-3 mt-5">
          {wishlists.map((wishlist, idx) => (
            <B key={idx} className="m-2 p-1 rounded-md">
              <CBstyled className="m-2">{wishlist.title}</CBstyled>
              <CenteringDiv className="relative">
                <StyledImage
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
                </StyledImage>
                <CHoverDiv>
                  <IconHeart
                    onClick={() => updateWishlist(wishlist.id)}
                    size={24}
                    color={'red'}
                    fill={'red'}
                    className="absolute right-5 top-5"
                  />
                </CHoverDiv>
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
        <CenteringDiv className="mt-10">
          {total && (
            <Pagination
              color={'gray'}
              page={activePage}
              onChange={setActivePage}
              total={total}
            />
          )}
        </CenteringDiv>
      </div>
    ) : (
      <CenteringDiv className="m-40">관심 목록이 비어있습니다.</CenteringDiv>
    )
  ) : (
    <CenteringDiv className="m-40">로그인이 필요합니다.</CenteringDiv>
  )
}
