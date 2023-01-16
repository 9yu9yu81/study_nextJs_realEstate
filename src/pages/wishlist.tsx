//todos
// wishlist
// 방에 하트 버튼 -> wishlist에 추가 (로그인 필요)
// upsert 로 wishlist table 에 추가
// 삭제버튼도 만들어야함
// 하나의 userid 에서도 여러개의 wish가 있을 수 있음 -> room Id 를 여러개 받게 -> roomIds => 각각 id  join(',')

import { Room } from '@prisma/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { WISHLIST_QUERY_KEY } from 'constants/querykey'



export default function wishlist() {
  // get Wishlist data
  const queryClient = useQueryClient()
  const { data: wishlists, isLoading } = useQuery<
    { wishlists: Room[] },
    unknown,
    Room[]
  >([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )
  return <div>{wishlists?.map((wishlist) => wishlist.title)}</div>
}
