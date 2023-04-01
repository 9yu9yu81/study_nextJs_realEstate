import { Loader, SegmentedControl } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Center_Div,
  StyledImage,
  mainColor,
  subColor_light,
} from 'components/styledComponent'
import { CATEGORY_MAP, YEAR_MONTH_MAP } from 'constants/const'
import { useState } from 'react'
import Image from 'next/image'
import { IconHeart } from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { RoomAllData } from './rooms/[id]'
import styled from '@emotion/styled'
import CustomPagination from 'components/CustomPagination'
import { useRouter } from 'next/router'

interface WishedRoom {
  id: number
  category_id: number
  sType_id: number
  deposit: number
  fee: number
  doro: string
  title: string
  images: string
}

const scStyles = () => ({
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

export default function wishlist() {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const router = useRouter()

  const WISHLIST_TAKE = 9
  const [activePage, setActivePage] = useState<number>(1)
  const [ym, setYm] = useState<string>('0')
  const [category, setCategory] = useState<string>('0')

  const WISHLIST_QUERY_KEY = `api/wishlist/get-Wishlists-Take?skip=${
    (activePage - 1) * WISHLIST_TAKE
  }&take=${WISHLIST_TAKE}&category_id=${category}&sType_id=${ym}`
  const WISHLIST_COUNT_QUERY_KEY = `api/wishlist/get-Wishlists-Count`
  const WISHLIST_TOTAL_QUERY_KEY = `api/wishlist/get-Wishlists-Total?category_id=${category}&sType_id=${ym}`

  const { data: wishlists, isLoading } = useQuery<
    { wishlists: WishedRoom[] },
    unknown,
    RoomAllData[]
  >([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )
  const { data: count, isLoading: countLoading } = useQuery<
    { count: number },
    unknown,
    number
  >([WISHLIST_COUNT_QUERY_KEY], () =>
    fetch(WISHLIST_COUNT_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )
  const { data: total } = useQuery<{ total: number }, unknown, number>(
    [WISHLIST_TOTAL_QUERY_KEY],
    () =>
      fetch(WISHLIST_TOTAL_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => (data.items === 0 ? 1 : data.items)),
    {
      onSuccess: async () => {
        setActivePage(1)
      },
    }
  )

  const { mutate: updateIsWished } = useMutation<unknown, unknown, number, any>(
    (room_id) =>
      fetch('api/wishlist/update-IsWished', {
        method: 'POST',
        body: JSON.stringify(room_id),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (room_id) => {
        await queryClient.cancelQueries({ queryKey: [WISHLIST_QUERY_KEY] })
        const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY])

        queryClient.setQueryData<WishedRoom[]>([WISHLIST_QUERY_KEY], (olds) =>
          olds?.filter((f) => f.id !== room_id)
        )
        queryClient.setQueryData<number>([WISHLIST_TOTAL_QUERY_KEY], (old) =>
          old ? old - 1 : undefined
        )
        queryClient.setQueryData<number>([WISHLIST_COUNT_QUERY_KEY], (old) =>
          old ? old - 1 : undefined
        )
        return previous
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
        queryClient.invalidateQueries([WISHLIST_TOTAL_QUERY_KEY])
        queryClient.invalidateQueries([WISHLIST_COUNT_QUERY_KEY])
      },
    }
  )

  const delWishlist = (room_id: number) => {
    if (confirm('해당 매물을 관심목록에서 삭제하시겠습니까?')) {
      updateIsWished(room_id)
    }
  }

  return status === 'authenticated' ? (
    <div style={{ width: '1000px' }}>
      <div
        style={{ margin: '40px 0 20px 0', fontSize: '17px', display: 'flex' }}
      >
        관심 매물
        {countLoading ? (
          <Center_Div style={{ margin: '0 10px 0 10px' }}>
            <Loader color="dark" size={15} />
          </Center_Div>
        ) : (
          <div style={{ fontWeight: '700', margin: '0 10px 0 10px' }}>
            {count}
          </div>
        )}
        개
      </div>
      <div
        style={{ display: 'flex', flexFlow: 'column', margin: '0 0 30px 0' }}
      >
        <SegmentedControl
          value={category}
          onChange={setCategory}
          styles={scStyles}
          transitionDuration={0}
          data={[
            {
              label: '전체',
              value: '0',
            },
            ...CATEGORY_MAP.map((label, id) => ({
              label: label,
              value: String(id + 1),
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
              value: '0',
            },
            ...YEAR_MONTH_MAP.map((label, id) => ({
              label: label,
              value: String(id + 1),
            })),
          ]}
        />
      </div>
      {isLoading ? (
        <Center_Div style={{ margin: '100px 0 100px 0' }}>
          <Loader color="dark" />
        </Center_Div>
      ) : wishlists ? (
        <div>
          <WishContainer>
            {wishlists.map((wishlist, idx) => (
              <WishWrapper key={idx}>
                <StyledImage style={{ width: '313px', height: '234px' }}>
                  <Image
                    priority
                    sizes="313px"
                    className="styled"
                    alt="img"
                    src={wishlist.images.split(',')[0]}
                    fill
                    onClick={() => router.push(`/rooms/${wishlist.id}`)}
                  />
                </StyledImage>
                <div className="main">
                  {CATEGORY_MAP[wishlist.category_id - 1]}{' '}
                  {YEAR_MONTH_MAP[wishlist.sType_id - 1]} {wishlist.deposit}
                  {wishlist.sType_id !== 1 && '/' + wishlist.fee}
                  <div className="heart">
                    <IconHeart
                      color="red"
                      fill="red"
                      onClick={() => delWishlist(wishlist.id)}
                    />
                  </div>
                </div>
                <div>{wishlist.doro}</div>
                <div>{wishlist.title}</div>
              </WishWrapper>
            ))}
          </WishContainer>
          {total && (
            <Center_Div style={{ margin: '30px 0 30px 0' }}>
              <CustomPagination
                page={activePage}
                onChange={setActivePage}
                total={total === 0 ? 1 : Math.ceil(total / WISHLIST_TAKE)}
              />
            </Center_Div>
          )}
        </div>
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
  width: 313px;
  height: 330px;
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .main {
    margin: 10px 5px 0 5px;
    display: flex;
    font-size: 20px;
    font-weight: 700;
    align-items: center;
  }
  .sub {
    display: flex;
    flex-flow: column;
  }
  .heart {
    margin-left: auto;
    :hover {
      cursor: pointer;
    }
  }
`