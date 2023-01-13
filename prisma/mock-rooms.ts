import { Prisma, PrismaClient, Room } from '@prisma/client'

//지정 범위 정수 난수 생성
const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
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
]

const roomMockData: Omit<Room, 'id' | 'status' | 'updatedAt'>[] = []

addrMockData.map((addr, idx) => {
  roomMockData.push({
    category: `${getRandom(0, 3)}`,
    ym: '1',
    deposit: getRandom(200, 500),
    address: `${addr}`,
    detailAddress: 'A동 101호',
    price: getRandom(25, 45),
    area: getRandom(7, 12),
    title: `ROOM${idx + 1} 입니다.`,
    description:
      `${addr} 에 위치한 ROOM${idx + 1}입니다.\n` +
      '상세 설명 입니다.\n' +
      '상세 설명 입니다.\n' +
      '상세 설명 입니다.\n',
    images:
      'https://cdn.pixabay.com/photo/2019/05/06/17/46/bed-4183710_1280.png,https://cdn.pixabay.com/photo/2018/03/01/17/36/room-3191241_1280.jpg',
    views: getRandom(0, 100),
    userId: 'clchojlw50000qjoixw2b0pen',
  })
})

const prismaRoomMockData: Prisma.RoomCreateInput[] = [...roomMockData]

const prisma = new PrismaClient()

async function main() {
  await prisma.room.deleteMany({})

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
