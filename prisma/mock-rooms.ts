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
  '전북 전주시 덕진구 용산1길 6-2',
  '전북 전주시 덕진구 권삼득로 360',
  '전북 전주시 완산구 안터2길 28 서신빌101',
  '전북 전주시 완산구 전룡4길 6-3',
  '전북 전주시 완산구 메너머1길 26-17',
  '전북 전주시 완산구 서신천변9길 3-9',
  '전북 전주시 덕진구 금암6길 37',
  '전북 전주시 덕진구 매봉10길 14',
  '전북 전주시 완산구 영경3길 5-3',
  '전북 전주시 완산구 중산5길 4',
  '전북 전주시 완산구 중화산로 55-5',
  '전북 전주시 완산구 선너머4길 13-3',
  '전북 전주시 완산구 선너머4길 9-16',
  '전북 전주시 완산구 전라감영1길 9',
  '전북 전주시 완산구 풍남문3길 27-5',
  '전북 전주시 덕진구 안골2길 11-2',
  '전북 전주시 덕진구 도당산4길 53-10',
  '전북 전주시 덕진구 신기1길 6',
  '전북 전주시 완산구 한절길 67-25',
  '전북 전주시 덕진구 삼송3길 9-5',
  '전북 전주시 덕진구 매봉6길 10-4',
  '전북 전주시 덕진구 명륜2길 12-4',
  '전북 전주시 덕진구 삼송5길 10-17',
  '전북 전주시 덕진구 명륜2길 14',
  '전북 전주시 덕진구 권삼득로 219-9',
  '전북 전주시 덕진구 매봉5길 10',
  '전북 전주시 완산구 강당4길 6',
  '전북 전주시 덕진구 금암3길 17',
  '전북 전주시 완산구 메너머2길 25-12',
  '전북 전주시 덕진구 금암2길 7-10',
  '전북 전주시 덕진구 금암5길 35',
  '전북 전주시 덕진구 금암1길 6-5',
  '전북 전주시 완산구 서학3길 27',
  '전북 전주시 덕진구 금암5길 19-1',
  '전북 전주시 완산구 맏내3길 14-6',
  '전북 전주시 완산구 백마산길 50-4',
  '전북 전주시 덕진구 매봉2길 3',
  '전북 전주시 덕진구 모래내2길 10',
  '전북 전주시 덕진구 기린대로 400-13',
  '전북 전주시 덕진구 아중1길 6',
  '전북 전주시 완산구 감나무3길 8-4',
  '전북 전주시 완산구 전주객사2길 38-4',
  '전북 전주시 덕진구 산정1길 8',
  '전북 전주시 덕진구 명륜1길 13-1',
  '전북 전주시 완산구 평화11길 9-5',
  '전북 전주시 덕진구 우아8길 25',
  '전북 전주시 완산구 전주천서로 141-7',
  '전북 전주시 덕진구 신복5길 33-1',
  '전북 전주시 완산구 백마산길 63-5',
  '전북 전주시 완산구 서학2길 17',
  '전북 전주시 덕진구 기지로 77',
  '전북 전주시 덕진구 태진로 101',
  '전북 전주시 완산구 용머리로 135',
  '전북 전주시 완산구 양지2길 10',
  '전북 전주시 덕진구 붓내3길 29',
  '전북 전주시 덕진구 만성로 181',
  '전북 전주시 완산구 태진로 35',
  '전북 전주시 덕진구 솔내로 142',
  '전북 전주시 완산구 평화로 181',
  '전북 전주시 덕진구 세병로 136',
  '전북 전주시 완산구 효천중앙로 20',
  '전북 전주시 완산구 전주천서로 445',
  '전북 전주시 완산구 새터로 95',
  '전북 전주시 덕진구 무삼지로 40',
  '전북 전주시 덕진구 안덕원로 251',
  '전북 전주시 완산구 견훤왕궁1길 10',
  '전북 전주시 덕진구 세병로 210',
  '전북 전주시 덕진구 우아로 33',
  '전북 전주시 완산구 홍산로 390',
  '전북 전주시 덕진구 견훤로 333',
  '전북 전주시 완산구 홍산1길 7',
  '전북 전주시 완산구 용리로 165',
  '전북 전주시 덕진구 세병로 41',
  '전북 전주시 덕진구 만성로 180',
  '전북 전주시 완산구 효천중앙로 11',
  '전북 전주시 덕진구 거북바우3길 15',
  '전북 전주시 덕진구 석소로 55',
  '전북 전주시 덕진구 아중로 180',
  '전북 전주시 완산구 덕적골2길 11',
  '전북 전주시 덕진구 팔복1길 6',
]

const RoomMockData: Room[] = []
const AddressInfoMockData: AddressInfo[] = []
const BasicInfoMockData: BasicInfo[] = []
const SaleInfoMockData: SaleInfo[] = []
const MoreInfoMockData: MoreInfo[] = []

addrMockData.map((addr, idx) => {
  if (idx % 3 === 0) {
    RoomMockData.push({
      id: idx + 1,
      category_id: getIntRandom(1, 5),
      user_id: 'cldsik8e40000qjsvhgz5i629',
      status_id: 1,
      type_id: getIntRandom(1, 4),
      updatedAt: new Date(),
      title: `전주 살기 좋은 집. 9yu9yu81의 ${Math.ceil(
        (idx + 1) / 3
      )}번째 매물`,
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
        'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
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
      heat_id: getIntRandom(0, 2),
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
  }
  else if (idx % 3 === 1) {
    RoomMockData.push({
      id: idx + 1,
      category_id: getIntRandom(1, 5),
      user_id: 'cldilnelw0002qjlmfyp5uwvk',
      status_id: 1,
      type_id: getIntRandom(1, 4),
      updatedAt: new Date(),
      title: `전주 살기 좋은 집. 9yu9yu82의 ${Math.ceil(
        (idx + 1) / 3
      )}번째 매물`,
      description:
        `전주 살기 좋은 집. 9yu9yu82의 ${Math.ceil((idx + 1) / 3)}번째 매물` +
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
        'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      doro: addr,
      jibun: addr,
      detail: 'B아파트 B동 B호',
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
      heat_id: getIntRandom(0, 2),
    })
    SaleInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      type_id: 1,
      deposit: Math.round(getIntRandom(5000, 20000) / 1000) * 1000,
      fee: 0,
    })
    MoreInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      maintenance_fee: getIntRandom(1, 10),
      maintenance_ids: '1,3,5',
      elevator: Boolean(getIntRandom(0, 1)),
      parking: true,
      parking_fee: getIntRandom(0, 10),
      structure_ids: null,
      option_ids: '1,2,3,4,7,8,9,10,11,12',
    })
  } else {
    RoomMockData.push({
      id: idx + 1,
      category_id: getIntRandom(1, 5),
      user_id: 'cldilr5110007qjlmky221jqq',
      status_id: 1,
      type_id: getIntRandom(1, 4),
      updatedAt: new Date(),
      title: `전주 살기 좋은 집. 9yu9yu83의 ${Math.ceil(
        (idx + 1) / 3
      )}번째 매물`,
      description:
        `전주 살기 좋은 집. 9yu9yu83의 ${Math.ceil((idx + 1) / 3)}번째 매물` +
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
        'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
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
      heat_id: getIntRandom(0, 2),
    })
    SaleInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      type_id: 2,
      deposit: Math.round(getIntRandom(100, 1000) / 100) * 100,
      fee: getIntRandom(30, 60),
    })
    MoreInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      maintenance_fee: getIntRandom(1, 10),
      maintenance_ids: '2,3,5',
      elevator: Boolean(getIntRandom(0, 1)),
      parking: false,
      parking_fee: 0,
      structure_ids: '2',
      option_ids: '1,3,5,6,7,8,10',
    })
  }
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
