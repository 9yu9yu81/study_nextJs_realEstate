export const CATEGORY_MAP = [
  '원룸',
  '투룸',
  '쓰리룸',
  '오피스텔 ∙ 도시형',
  '그 외',
]
export const YEAR_MONTH_MAP = ['전세', '월세']
export const STATUS_MAP = ['공개중', '거래완료', '기한만료', '숨김']
export const HEAT_MAP = ['중앙난방', '개별난방', '지역난방']
export const TYPE_MAP = [
  '단독주택',
  '다가구주택',
  '빌라/연립/다세대',
  '상가주택',
]
export const MAINTENENCE_MAP = [
  '인터넷',
  '유선TV',
  '청소비',
  '수도세',
  '도시가스',
  '전기세',
  '기타',
]
export const STRUCTURE_MAP = ['복층', '1.5룸/주방분리형']
export const OPTION_MAP = [
  '인덕션',
  '전자레인지',
  '에어컨',
  '세탁기',
  'TV',
  '옷장',
  '침대',
  '책상',
  '신발장',
  '비데',
  '가스레인지',
  '냉장고',
  '전자도어락',
]

export const WISHLIST_TAKE = 9
export const HOME_TAKE = 3
export const ROOM_TAKE = 8

export const FILTERS = [
  { label: '최신순', value: 'latest' },
  { label: '가격 높은 순', value: 'expensive' },
  { label: '가격 낮은 순', value: 'cheap' },
  { label: '조회수 순', value: 'mostViewed' },
  { label: '좋아요 순', value: 'mostWished' },
]

export const getOrderBy = (orderBy: string) => {
  return orderBy
    ? orderBy === 'latest'
      ? { orderBy: { updatedAt: 'desc' } }
      : orderBy === 'expensive'
      ? {
          orderBy: {
            fee: 'desc',
          },
        }
      : orderBy === 'cheap'
      ? {
          orderBy: {
            fee: 'asc',
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
