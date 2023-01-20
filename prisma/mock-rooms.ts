import { Prisma, PrismaClient, Room } from '@prisma/client'

//지정 범위 정수 난수 생성
const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const addrMockData1 = [
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
]

const addrMockData2 = [
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

const addrMockData3 = [
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
]

const roomMockData1: Omit<Room, 'id' | 'status' | 'updatedAt' | 'wished'>[] = []
const roomMockData2: Omit<
  Room,
  'id' | 'status' | 'updatedAt' | 'wished' | 'deposit'
>[] = []

addrMockData1.map((addr, idx) => {
  roomMockData1.push({
    categoryId: `${getRandom(0, 3)}`,
    ym: '1',
    deposit: Math.round(getRandom(200, 2000) / 100) * 100,
    address: `${addr}`,
    detailAddress: 'A동 101호',
    price: getRandom(25, 45),
    area: getRandom(7, 12),
    title: `규규81 의 ROOM${idx + 1} 입니다.`,
    description:
      `${addr} 에 위치한 ROOM${idx + 1}입니다.\n` +
      '월세 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다. ',
    images:
      'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    views: getRandom(0, 1000),
    userId: 'clchojlw50000qjoixw2b0pen',
  })
})

addrMockData2.map((addr, idx) => {
  roomMockData2.push({
    categoryId: `${getRandom(0, 3)}`,
    ym: '0',
    address: `${addr}`,
    detailAddress: '103동 1001호',
    price: Math.round(getRandom(5000, 30000) / 1000) * 1000,
    area: getRandom(18, 45),
    title: `규규82 의 ROOM${idx + 1} 입니다.`,
    description:
      `${addr} 에 위치한 ROOM${idx + 1}입니다.\n` +
      '전세 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다. ',
    images:
      'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    views: getRandom(0, 1000),
    userId: 'cld46nwio0000qj745rme2x1g',
  })
})

addrMockData3.map((addr, idx) => {
  roomMockData1.push({
    categoryId: `${getRandom(0, 3)}`,
    ym: '1',
    deposit: Math.round(getRandom(200, 2000) / 100) * 100,
    address: `${addr}`,
    detailAddress: 'B동 201호',
    price: getRandom(25, 60),
    area: getRandom(7, 18),
    title: `규규83 의 ROOM${idx + 1} 입니다.`,
    description:
      `${addr} 에 위치한 ROOM${idx + 1}입니다.\n` +
      '월세 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다.\n' +
      '상세 설명 입니다. 상세 설명 입니다. 상세 설명 입니다. ',
    images:
      'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    views: getRandom(0, 1000),
    userId: 'cld46plhj0004qj749tv7lumt',
  })
})
const prismaRoomMockData: Prisma.RoomCreateInput[] = [
  ...roomMockData1,
  ...roomMockData2,
]

const prisma = new PrismaClient()

async function main() {
  await prisma.room.deleteMany({})
  await prisma.wishlist.deleteMany({})

  for (const r of prismaRoomMockData) {
    const room = await prisma.room.create({
      data: r,
    })
    console.log(`Created id: ${room.id}`)
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
