export const DESCRIPTION_PLACEHOLDER = `[상세설명 작성 주의사항]
- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.
- 매물등록 규정에 위반되는 금칙어는 입력할 수 없습니다.

위 주의사항 위반시 임의로 매물 삭제 혹은 서비스 이용이 제한될 수 있습니다.`

export const DETAILADDR_PLACEHOLDER = `상세 주소
예) e편한세상 101동 1101호`

export const ROOM_CATEGORY_MAP = ['원룸', '투룸', '쓰리룸', '그 외']
export const ROOM_YM_MAP = ['전세', '월세']
export const ROOM_STATUS_MAP = ['공개중', '거래완료', '기한만료']

export const WISHLIST_TAKE = 9
export const HOME_TAKE = 3

export const getOrderBy = (orderBy: string) => {
  return orderBy
    ? orderBy === 'latest'
      ? { orderBy: { createdAt: 'desc' } }
      : orderBy === 'expensive'
      ? {
          orderBy: {
            price: 'desc',
          },
        }
      : orderBy === 'cheap'
      ? {
          orderBy: {
            price: 'asc',
          },
        }
      : orderBy === 'mostViewed'
      ? {
          orderBy: {
            views: 'desc',
          },
        }
      : orderBy === 'mostWished'
      ? {
          orderBy: {
            wished: 'desc',
          },
        }
      : undefined
    : undefined
}
