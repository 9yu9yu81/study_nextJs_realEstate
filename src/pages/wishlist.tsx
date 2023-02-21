import { Loader, SegmentedControl } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Center_Div,
  StyledImage,
  mainColor,
  subColor_light,
} from 'components/styledComponent'
import { CATEGORY_MAP, YEAR_MONTH_MAP, WISHLIST_TAKE } from 'constants/const'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import { IconHeart } from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { RoomAllData } from './rooms/[id]'
import styled from '@emotion/styled'

//todo 하트 -> 관심 목록 추가 제거

export default function wishlist() {
  const scStyles = (themes: any) => ({
    root: {
      backgroundColor: 'white',
    },
    label: {
      marginRight: '10px',
      marginLeft: '10px',
      backgroundColor: `${subColor_light}`,
    },
    labelActive: {
      marginRight: '10px',
      marginLeft: '10px',
      color: `${subColor_light} !important`,
      backgroundColor: `${mainColor}`,
    },
    active: {
      marginRight: '10px',
      marginLeft: '10px',
    },
    control: { borderWidth: '0px !important' },
  })
  const WISHLIST_QUERY_KEY = `api/wishlist/get-Wishlists`
  const router = useRouter()
  const queryClient = useQueryClient()
  const { status } = useSession()
  // const [activePage, setActivePage] = useState(1)
  const [ym, setYm] = useState<string>('-1')
  const [category, setCategory] = useState<string>('-1')

  const { data: wishlists, isLoading } = useQuery<
    { wishlists: RoomAllData[] },
    unknown,
    RoomAllData[]
  >([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  // const { data: wishlists, isLoading } = useQuery<
  //   { wishlists: Room[] },
  //   unknown,
  //   Room[]
  // >(
  //   [
  //     `api/wishlist/get-Wishlists-take?skip=${
  //       (activePage - 1) * WISHLIST_TAKE
  //     }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
  //   ],
  //   () =>
  //     fetch(
  //       `api/wishlist/get-Wishlists-take?skip=${
  //         (activePage - 1) * WISHLIST_TAKE
  //       }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => data.items)
  // )
  // const { data: total } = useQuery(
  //   [`api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`],
  //   () =>
  //     fetch(`api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`)
  //       .then((res) => res.json())
  //       .then((data) =>
  //         data.items === 0 ? 1 : Math.ceil(data.items / WISHLIST_TAKE)
  //       ),
  //   {
  //     onSuccess: async () => {
  //       setActivePage(1)
  //     },
  //   }
  // )

  //delete wishlist
  // const { mutate: updateWishlist } = useMutation<unknown, unknown, number, any>(
  //   (roomId) =>
  //     fetch('/api/wishlist/update-Wishlist', {
  //       method: 'POST',
  //       body: JSON.stringify(roomId),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => res.items),
  //   {
  //     onMutate: async (roomId) => {
  //       await queryClient.cancelQueries({ queryKey: [WISHLISTS_QUERY_KEY] })
  //       const previous = queryClient.getQueryData([WISHLISTS_QUERY_KEY])

  //       queryClient.setQueryData<Room[]>(
  //         [
  //           `api/wishlist/get-Wishlists-take?skip=${
  //             (activePage - 1) * WISHLIST_TAKE
  //           }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
  //         ],
  //         (olds) => olds?.filter((f) => f.id !== roomId)
  //       )

  //       return previous
  //     },
  //     onError: (__, _, context) => {
  //       queryClient.setQueryData([WISHLISTS_QUERY_KEY], context.previous)
  //     },
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries([
  //         `api/wishlist/get-Wishlists-take?skip=${
  //           (activePage - 1) * WISHLIST_TAKE
  //         }&take=${WISHLIST_TAKE}&category=${category}&ym=${ym}`,
  //       ])
  //       queryClient.invalidateQueries([
  //         `api/wishlist/get-Wishlists-count?category=${category}&ym=${ym}`,
  //       ])
  //     },
  //   }
  // )

  return status === 'authenticated' ? (
    <div style={{ width: '1000px' }}>
      <div
        style={{ margin: '40px 0 20px 0', fontSize: '17px', display: 'flex' }}
      >
        관심 매물
        {isLoading ? (
          <Center_Div style={{ margin: '0 10px 0 10px' }}>
            <Loader color="dark" size={15} />
          </Center_Div>
        ) : (
          <div style={{ fontWeight: '700', margin: '0 10px 0 10px' }}>
            {wishlists?.length}
          </div>
        )}
        개
      </div>
      <div
        style={{ display: 'flex', flexFlow: 'column', margin: '0 0 20px 0' }}
      >
        <SegmentedControl
          value={category}
          onChange={setCategory}
          styles={scStyles}
          transitionDuration={0}
          data={[
            {
              label: '전체',
              value: '-1',
            },
            ...CATEGORY_MAP.map((label, id) => ({
              label: label,
              value: String(id),
            })),
          ]}
        />
        <SegmentedControl
          value={ym}
          onChange={setYm}
          styles={scStyles}
          transitionDuration={0}
          data={[
            {
              label: '전체',
              value: '-1',
            },
            ...YEAR_MONTH_MAP.map((label, id) => ({
              label: label,
              value: String(id),
            })),
          ]}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : wishlists ? (
        <WishContainer>
          {wishlists.map((wishlist, idx) => (
            <WishWrapper key={idx}>
              <StyledImage style={{ width: '313px', height: '234px' }}>
                <Image
                  className="styled"
                  alt="img"
                  src={wishlist.images.split(',')[0]}
                  fill
                />
              </StyledImage>
              <div style={{ margin: '10px 10px 0 10px' }}>test</div>
            </WishWrapper>
          ))}
        </WishContainer>
      ) : (
        <Center_Div>관심 목록이 비어있습니다.</Center_Div>
      )}
    </div>
  ) : (
    <Center_Div className="m-40">로그인이 필요합니다.</Center_Div>
  )
}

const WishContainer = styled.div`
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-row-gap: 30px;
  grid-column-gap: 30px;
  * {
    font-size: 15px;
  }
`
const WishWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 350px;
`
