import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateExpiredRoomRenew(id: number) {
  try {
    const response = await prisma.room.update({
      where: {
        id: id,
      },
      data: { updatedAt: new Date(), status_id: 1 },
    })
    console.log(response)
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
  const item = JSON.parse(req.body)

  try {
    const items = await updateExpiredRoomRenew(Number(item))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
