import {
  AddressInfo,
  BasicInfo,
  MoreInfo,
  Prisma,
  PrismaClient,
  Room,
  SaleInfo,
} from '@prisma/client'

//지정 범위 정수 난수 생성
const getIntRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
//난수 생성
const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min + 1) + min
}

const addrMockData = [
  '전북 전주시 덕진구 기린대로 458-10',
  '전북 전주시 덕진구 명륜3길 9',
  '전북 전주시 덕진구 삼송1길 14',
  '전북 전주시 덕진구 삼송1길 29 한별드림',
  '전북 전주시 덕진구 삼송3길 30-7',
  '전북 전주시 덕진구 삼송5길 10-4',
  '전북 전주시 덕진구 삼송5길 9-6',
  '전북 전주시 덕진구 금암5길 32',
  '전북 전주시 덕진구 용산3길 6-3',
  // '전북 전주시 덕진구 용산1길 6-2',
  // '전북 전주시 덕진구 권삼득로 360',
  // '전북 전주시 완산구 안터2길 28 서신빌101',
  // '전북 전주시 완산구 전룡4길 6-3',
  // '전북 전주시 완산구 메너머1길 26-17',
  // '전북 전주시 완산구 서신천변9길 3-9',
  // '전북 전주시 덕진구 금암6길 37',
  // '전북 전주시 덕진구 매봉10길 14',
  // '전북 전주시 완산구 영경3길 5-3',
  // '전북 전주시 완산구 중산5길 4',
  // '전북 전주시 완산구 중화산로 55-5',
  // '전북 전주시 완산구 선너머4길 13-3',
  // '전북 전주시 완산구 선너머4길 9-16',
  // '전북 전주시 완산구 전라감영1길 9',
  // '전북 전주시 완산구 풍남문3길 27-5',
  // '전북 전주시 덕진구 안골2길 11-2',
  // '전북 전주시 덕진구 도당산4길 53-10',
  // '전북 전주시 덕진구 신기1길 6',
  // '전북 전주시 완산구 한절길 67-25',
  // '전북 전주시 덕진구 삼송3길 9-5',
]

const RoomMockData: Room[] = []
const AddressInfoMockData: AddressInfo[] = []
const BasicInfoMockData: BasicInfo[] = []
const SaleInfoMockData: SaleInfo[] = []
const MoreInfoMockData: MoreInfo[] = []

addrMockData.map((addr, idx) => {
  RoomMockData.push({
    contact: '01012345678',
    id: idx + 1,
    category_id: getIntRandom(1, 5),
    user_id: 'cldvorksx0000qjfaj6j692g0',
    status_id: 3,
    type_id: getIntRandom(1, 4),
    updatedAt: new Date(2023, 0, 2),
    title: `전주 살기 좋은 집. 9yu9yu81의 ${Math.ceil((idx + 1) / 3)}번째 매물`,
    description:
      `전주 살기 좋은 집. 9yu9yu81의 ${Math.ceil((idx + 1) / 3)}번째 매물` +
      '전주 월세.\n' +
      `9yu9yu81의 ${Math.ceil((idx + 1) / 3)}번째 매물.\n` +
      '해당 방의 상세설명 입니다.\n' +
      '해당 방의 상세설명 입니다.\n' +
      '해당 방의 상세설명 입니다.\n' +
      '해당 방의 상세설명 입니다.\n' +
      '해당 방의 상세설명 입니다.\n',
    views: getIntRandom(0, 1000),
    wished: 0,
    images:
      'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
  })
  AddressInfoMockData.push({
    name: 'name',
    id: idx + 1,
    room_id: idx + 1,
    doro: addr,
    jibun: addr,
    detail: 'A아파트 A동 A호',
    lat: getRandom(126.7, 127.3),
    lng: getRandom(35.4, 36.2),
  })
  BasicInfoMockData.push({
    id: idx + 1,
    room_id: idx + 1,
    supply_area: getIntRandom(15, 19),
    area: getIntRandom(6, 14),
    total_floor: getIntRandom(6, 10),
    floor: getIntRandom(1, 6),
    move_in: new Date(),
    heat_id: getIntRandom(1, 3),
  })
  SaleInfoMockData.push({
    id: idx + 1,
    room_id: idx + 1,
    type_id: 2,
    deposit: Math.round(getIntRandom(200, 2000) / 100) * 100,
    fee: getIntRandom(25, 50),
  })
  MoreInfoMockData.push({
    id: idx + 1,
    room_id: idx + 1,
    maintenance_fee: getIntRandom(1, 10),
    maintenance_ids: '1,2,3,5,6',
    elevator: Boolean(getIntRandom(0, 1)),
    parking: true,
    parking_fee: getIntRandom(0, 10),
    structure_ids: '1,2',
    option_ids: '1,2,3,4,5,6,7,8,9,10,11,12,13',
  })
})

const prisma = new PrismaClient()
const roomMockData: Prisma.RoomUncheckedCreateInput[] = RoomMockData
const addressInfoMockData: Prisma.AddressInfoUncheckedCreateInput[] =
  AddressInfoMockData
const basicInfoMockData: Prisma.BasicInfoUncheckedCreateInput[] =
  BasicInfoMockData
const saleInfoMockData: Prisma.SaleInfoUncheckedCreateInput[] = SaleInfoMockData
const moreInfoMockData: Prisma.MoreInfoUncheckedCreateInput[] = MoreInfoMockData

async function main() {
  await prisma.room.deleteMany({})

  for (const r of roomMockData) {
    const room = await prisma.room.create({
      data: r,
    })
    console.log(`Created id: ${room.id}`)
  }
  for (const a of addressInfoMockData) {
    const addressInfo = await prisma.addressInfo.create({
      data: a,
    })
    console.log(`Created id: ${addressInfo.id}`)
  }
  for (const s of saleInfoMockData) {
    const saleInfo = await prisma.saleInfo.create({
      data: s,
    })
    console.log(`Created id: ${saleInfo.id}`)
  }
  for (const b of basicInfoMockData) {
    const basicInfo = await prisma.basicInfo.create({
      data: b,
    })
    console.log(`Created id: ${basicInfo.id}`)
  }
  for (const m of moreInfoMockData) {
    const moreInfo = await prisma.moreInfo.create({
      data: m,
    })
    console.log(`Created id: ${moreInfo.id}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
