import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateStatus(id: number, status: number) {
  try {
    const response = await prisma.room.update({
      where: {
        id: id,
      },
      data: { status: status },
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
  const items = JSON.parse(req.body)

  try {
    const room = await updateStatus(Number(items.id), Number(items.status))
    res.status(200).json({ items: room, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
