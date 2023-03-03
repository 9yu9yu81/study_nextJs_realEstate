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

const addrMockData: { addr: string; X: number; Y: number }[] = [
  { addr: '전북 전주시 덕진구 기린대로 458-10', X: 127.127645, Y: 35.8417894 },
  { addr: '전북 전주시 덕진구 명륜3길 9', X: 127.127159, Y: 35.8422406 },
  { addr: '전북 전주시 덕진구 삼송1길 14', X: 127.133135, Y: 35.8416483 },
  {
    addr: '전북 전주시 덕진구 삼송1길 29 한별드림',
    X: 127.134299,
    Y: 35.8428007,
  },
  { addr: '전북 전주시 덕진구 삼송3길 30-7', X: 127.137013, Y: 35.8439422 },
  { addr: '전북 전주시 덕진구 삼송5길 10-4', X: 127.137431, Y: 35.8427701 },
  { addr: '전북 전주시 덕진구 삼송5길 9-6', X: 127.136203, Y: 35.8426994 },
  { addr: '전북 전주시 덕진구 금암5길 32', X: 127.135478, Y: 35.8398973 },
  { addr: '전북 전주시 덕진구 용산3길 6-3', X: 127.131809, Y: 35.8365217 },
  { addr: '전북 전주시 덕진구 용산1길 6-2', X: 127.129671, Y: 35.8353884 },
  { addr: '전북 전주시 덕진구 권삼득로 360', X: 127.124021, Y: 35.8463986 },
  {
    addr: '전북 전주시 완산구 안터2길 28 서신빌101',
    X: 127.117674,
    Y: 35.8282627,
  },
  { addr: '전북 전주시 완산구 전룡4길 6-3', X: 127.119939, Y: 35.8258902 },
  { addr: '전북 전주시 완산구 메너머1길 26-17', X: 127.119246, Y: 35.8212133 },
  { addr: '전북 전주시 완산구 서신천변9길 3-9', X: 127.113891, Y: 35.8291856 },
  { addr: '전북 전주시 덕진구 금암6길 37', X: 127.13694, Y: 35.8401751 },
  { addr: '전북 전주시 덕진구 매봉10길 14', X: 127.14005, Y: 35.8400634 },
  { addr: '전북 전주시 완산구 영경3길 5-3', X: 127.124629, Y: 35.8168549 },
  { addr: '전북 전주시 완산구 중산5길 4', X: 127.120666, Y: 35.8159486 },
  { addr: '전북 전주시 완산구 중화산로 55-5', X: 127.11771, Y: 35.8151043 },
  { addr: '전북 전주시 완산구 선너머4길 13-3', X: 127.13175, Y: 35.8139093 },
  { addr: '전북 전주시 완산구 선너머4길 9-16', X: 127.131695, Y: 35.8137651 },
  { addr: '전북 전주시 완산구 전라감영1길 9', X: 127.140515, Y: 35.815035 },
  { addr: '전북 전주시 완산구 풍남문3길 27-5', X: 127.146645, Y: 35.8148025 },
  { addr: '전북 전주시 덕진구 안골2길 11-2', X: 127.156995, Y: 35.8395289 },
  { addr: '전북 전주시 덕진구 도당산4길 53-10', X: 127.155811, Y: 35.845659 },
  { addr: '전북 전주시 덕진구 신기1길 6', X: 127.162159, Y: 35.848084 },
  { addr: '전북 전주시 완산구 한절길 67-25', X: 127.090233, Y: 35.8027805 },
  { addr: '전북 전주시 덕진구 삼송3길 9-5', X: 127.13473, Y: 35.8422054 },
  { addr: '전북 전주시 덕진구 매봉6길 10-4', X: 127.140019, Y: 35.8413342 },
  { addr: '전북 전주시 덕진구 명륜2길 12-4', X: 127.128718, Y: 35.8413557 },
  { addr: '전북 전주시 덕진구 삼송5길 10-17', X: 127.138085, Y: 35.8432561 },
  { addr: '전북 전주시 덕진구 명륜2길 14', X: 127.128807, Y: 35.841608 },
  { addr: '전북 전주시 덕진구 권삼득로 219-9', X: 127.134079, Y: 35.8370329 },
  { addr: '전북 전주시 덕진구 매봉5길 10', X: 127.141868, Y: 35.8413501 },
  { addr: '전북 전주시 완산구 강당4길 6', X: 127.133951, Y: 35.813267 },
  { addr: '전북 전주시 덕진구 금암3길 17', X: 127.137162, Y: 35.8408508 },
  { addr: '전북 전주시 완산구 메너머2길 25-12', X: 127.119701, Y: 35.8215013 },
  { addr: '전북 전주시 덕진구 금암2길 7-10', X: 127.135314, Y: 35.8407086 },
  { addr: '전북 전주시 덕진구 금암5길 35', X: 127.135036, Y: 35.8400961 },
  { addr: '전북 전주시 덕진구 금암1길 6-5', X: 127.133243, Y: 35.840008 },
  { addr: '전북 전주시 완산구 서학3길 27', X: 127.151509, Y: 35.8066401 },
  { addr: '전북 전주시 덕진구 금암5길 19-1', X: 127.135964, Y: 35.8389955 },
  { addr: '전북 전주시 완산구 맏내3길 14-6', X: 127.130389, Y: 35.7931818 },
  { addr: '전북 전주시 완산구 백마산길 50-4', X: 127.08808, Y: 35.8169138 },
  { addr: '전북 전주시 덕진구 매봉2길 3', X: 127.140319, Y: 35.8419827 },
  { addr: '전북 전주시 덕진구 모래내2길 10', X: 127.140605, Y: 35.8348715 },
  { addr: '전북 전주시 덕진구 기린대로 400-13', X: 127.131956, Y: 35.8385493 },
  { addr: '전북 전주시 덕진구 아중1길 6', X: 127.170563, Y: 35.8283531 },
  { addr: '전북 전주시 완산구 감나무3길 8-4', X: 127.121994, Y: 35.8309171 },
  { addr: '전북 전주시 완산구 전주객사2길 38-4', X: 127.140887, Y: 35.8184504 },
  { addr: '전북 전주시 덕진구 산정1길 8', X: 127.169021, Y: 35.8368991 },
  { addr: '전북 전주시 덕진구 명륜1길 13-1', X: 127.129548, Y: 35.8410574 },
  { addr: '전북 전주시 완산구 평화11길 9-5', X: 127.136567, Y: 35.7900927 },
  { addr: '전북 전주시 덕진구 우아8길 25', X: 127.158435, Y: 35.8514145 },
  { addr: '전북 전주시 완산구 전주천서로 141-7', X: 127.145587, Y: 35.8109734 },
  { addr: '전북 전주시 덕진구 신복5길 33-1', X: 127.106611, Y: 35.8559233 },
  { addr: '전북 전주시 완산구 백마산길 63-5', X: 127.086376, Y: 35.8166717 },
  { addr: '전북 전주시 완산구 서학2길 17', X: 127.150622, Y: 35.8056228 },
  { addr: '전북 전주시 덕진구 기지로 77', X: 127.05947, Y: 35.8390027 },
  { addr: '전북 전주시 덕진구 태진로 101', X: 127.134931, Y: 35.8303717 },
  { addr: '전북 전주시 완산구 용머리로 135', X: 127.12445, Y: 35.8083382 },
  { addr: '전북 전주시 완산구 양지2길 10', X: 127.121869, Y: 35.7916135 },
  { addr: '전북 전주시 덕진구 붓내3길 29', X: 127.125438, Y: 35.8673241 },
  { addr: '전북 전주시 덕진구 만성로 181', X: 127.078151, Y: 35.847437 },
  { addr: '전북 전주시 완산구 태진로 35', X: 127.135894, Y: 35.8240709 },
  { addr: '전북 전주시 덕진구 솔내로 142', X: 127.127988, Y: 35.8624637 },
  { addr: '전북 전주시 완산구 평화로 181', X: 127.134858, Y: 35.7930508 },
  { addr: '전북 전주시 덕진구 세병로 136', X: 127.136804, Y: 35.8776131 },
  { addr: '전북 전주시 완산구 효천중앙로 20', X: 127.104432, Y: 35.7974969 },
  { addr: '전북 전주시 완산구 전주천서로 445', X: 127.125858, Y: 35.8314089 },
  { addr: '전북 전주시 완산구 새터로 95', X: 127.117731, Y: 35.8365001 },
  { addr: '전북 전주시 덕진구 무삼지로 40', X: 127.164967, Y: 35.829947 },
  { addr: '전북 전주시 덕진구 안덕원로 251', X: 127.154181, Y: 35.8380274 },
  { addr: '전북 전주시 완산구 견훤왕궁1길 10', X: 127.150431, Y: 35.8277849 },
  { addr: '전북 전주시 덕진구 세병로 210', X: 127.129455, Y: 35.8801176 },
  { addr: '전북 전주시 덕진구 우아로 33', X: 127.154404, Y: 35.8507799 },
  { addr: '전북 전주시 완산구 홍산로 390', X: 127.107603, Y: 35.8277403 },
  { addr: '전북 전주시 덕진구 견훤로 333', X: 127.153634, Y: 35.8414349 },
  { addr: '전북 전주시 완산구 홍산1길 7', X: 127.108337, Y: 35.8142118 },
  { addr: '전북 전주시 완산구 용리로 165', X: 127.125851, Y: 35.7989907 },
  { addr: '전북 전주시 덕진구 세병로 41', X: 127.130033, Y: 35.8745563 },
  { addr: '전북 전주시 덕진구 만성로 180', X: 127.080053, Y: 35.8460749 },
  { addr: '전북 전주시 완산구 효천중앙로 11', X: 127.102497, Y: 35.7984628 },
  { addr: '전북 전주시 덕진구 거북바우3길 15', X: 127.139814, Y: 35.8377564 },
  { addr: '전북 전주시 덕진구 석소로 55', X: 127.166022, Y: 35.8317842 },
  { addr: '전북 전주시 덕진구 아중로 180', X: 127.169053, Y: 35.8261111 },
  { addr: '전북 전주시 완산구 덕적골2길 11', X: 127.142232, Y: 35.7968096 },
  { addr: '전북 전주시 덕진구 팔복1길 6', X: 127.104929, Y: 35.848183 },
]

const RoomMockData: Room[] = []
const AddressInfoMockData: AddressInfo[] = []
const BasicInfoMockData: BasicInfo[] = []
const SaleInfoMockData: SaleInfo[] = []
const MoreInfoMockData: MoreInfo[] = []

addrMockData.map((item, idx) => {
  if (idx % 3 === 0) {
    RoomMockData.push({
      contact: '01012345678',
      id: idx + 1,
      category_id: getIntRandom(1, 5),
      user_id: 'cldvorksx0000qjfaj6j692g0',
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
        'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      doro: item.addr,
      jibun: item.addr,
      detail: 'A아파트 A동 A호',
      lat: item.Y,
      lng: item.X,
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
  } else if (idx % 3 === 1) {
    RoomMockData.push({
      contact: '01012345678',
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
        'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      doro: item.addr,
      jibun: item.addr,
      detail: 'B아파트 B동 B호',
      lat: item.Y,
      lng: item.X,
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
      contact: '01012345678',
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
        'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994__480.jpg,https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg,https://cdn.pixabay.com/photo/2015/06/24/16/36/home-820389__480.jpg',
    })
    AddressInfoMockData.push({
      id: idx + 1,
      room_id: idx + 1,
      doro: item.addr,
      jibun: item.addr,
      detail: 'A아파트 A동 A호',
      lat: item.Y,
      lng: item.X,
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