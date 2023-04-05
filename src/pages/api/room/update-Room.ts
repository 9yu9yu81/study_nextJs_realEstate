import type { NextApiRequest, NextApiResponse } from 'next'
import {
  AddressInfo,
  BasicInfo,
  MoreInfo,
  PrismaClient,
  Room,
  SaleInfo,
} from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

async function addRoom(
  user_id: string,
  room: Omit<Room, 'user_id' | 'updatedAt' | 'status_id' | 'views' | 'wished'>,
  saleInfo: Omit<SaleInfo, 'id' | 'room_id'>,
  basicInfo: Omit<BasicInfo, 'id' | 'room_id'>,
  addressInfo: Omit<AddressInfo, 'id' | 'room_id'>,
  moreInfo: Omit<MoreInfo, 'id' | 'room_id'>
) {
  try {
    const user: any = await prisma.$queryRaw`
      select user_id from Room as r where r.id = ${room.id}
    `
    if (user[0].user_id === user_id) {
      await prisma.room.update({
        where: { id: room.id },
        data: { ...room },
      })
      await prisma.saleInfo.update({
        where: { room_id: room.id },
        data: { ...saleInfo },
      })
      await prisma.basicInfo.update({
        where: { room_id: room.id },
        data: { ...basicInfo },
      })
      await prisma.addressInfo.update({
        where: { room_id: room.id },
        data: { ...addressInfo },
      })
      await prisma.moreInfo.update({
        where: { room_id: room.id },
        data: { ...moreInfo },
      })
      return { message: 'update success' }
    } else return { message: 'update fail' }
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions)
  const roomAllData = JSON.parse(req.body)

  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }

  try {
    const items = await addRoom(
      String(session.user?.id),
      roomAllData.room,
      roomAllData.saleInfo,
      roomAllData.basicInfo,
      roomAllData.addressInfo,
      roomAllData.moreInfo
    )
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
