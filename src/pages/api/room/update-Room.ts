import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Room } from '@prisma/client'


const prisma = new PrismaClient()

async function updateRoom(
  room: Omit<Room, 'userId' | 'updatedAt' | 'status' | 'views' | 'wished'>
) {
  try {
    const response = await prisma.room.update({
      where: {
        id: room.id,
      },
      data: { ...room },
    })
    // console.log(response)
    return response
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
  const items = JSON.parse(req.body)

  try {
    const room = await updateRoom(items)
    res.status(200).json({ items: room, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
