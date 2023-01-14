import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteRoom(id: number) {
  try {
    const response = await prisma.room.delete({
      where: {
        id: id,
      },
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
  const id = JSON.parse(req.body)
  try {
    const room = await deleteRoom(Number(id))
    res.status(200).json({ items: room, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
