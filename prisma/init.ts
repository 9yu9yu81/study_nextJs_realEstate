import {
  CATEGORY_MAP,
  HEAT_MAP,
  STATUS_MAP,
  STRUCTURE_MAP,
  TYPE_MAP,
  YEAR_MONTH_MAP,
} from './../src/constants/const'
import { Prisma, PrismaClient } from '@prisma/client'

const prismaRoomCategory: Prisma.RoomCategoryCreateInput[] = CATEGORY_MAP.map(
  (a, idx) => ({ id: idx + 1, name: a })
)
const prismaRoomStatus: Prisma.RoomStatusCreateInput[] = STATUS_MAP.map(
  (a, idx) => ({ id: idx + 1, name: a })
)
const prismaRoomType: Prisma.RoomTypeCreateInput[] = TYPE_MAP.map((a, idx) => ({
  id: idx + 1,
  name: a,
}))
const prismaRoomHeat: Prisma.RoomHeatCreateInput[] = HEAT_MAP.map((a, idx) => ({
  id: idx + 1,
  name: a,
}))
const prismaRoomStructure: Prisma.RoomStructureCreateInput[] =
  STRUCTURE_MAP.map((a, idx) => ({ id: idx + 1, name: a }))
const prismaSaleInfoType: Prisma.SaleInfoTypeCreateInput[] = YEAR_MONTH_MAP.map(
  (a, idx) => ({ id: idx + 1, name: a })
)

const prisma = new PrismaClient()

async function main() {
  await prisma.roomCategory.deleteMany({})
  await prisma.roomStatus.deleteMany({})
  await prisma.roomType.deleteMany({})
  await prisma.roomHeat.deleteMany({})
  await prisma.roomStructure.deleteMany({})
  await prisma.saleInfoType.deleteMany({})

  for (const i of prismaRoomCategory) {
    const item = await prisma.roomCategory.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
  }
  for (const i of prismaRoomStatus) {
    const item = await prisma.roomStatus.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
  }
  for (const i of prismaRoomType) {
    const item = await prisma.roomType.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
  }
  for (const i of prismaRoomHeat) {
    const item = await prisma.roomHeat.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
  }
  for (const i of prismaRoomStructure) {
    const item = await prisma.roomStructure.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
  }
  for (const i of prismaSaleInfoType) {
    const item = await prisma.saleInfoType.create({
      data: i,
    })
    console.log(`Created id: ${item.id}`)
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
