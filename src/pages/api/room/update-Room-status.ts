import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateStatus(id: number, status_id: number) {
  try {
    const response = await prisma.room.update({
      where: {
        id: id,
      },
      data: { status_id: status_id },
    })
    console.log(response.id)
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
    const items = await updateStatus(Number(item.id), Number(item.status_id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
