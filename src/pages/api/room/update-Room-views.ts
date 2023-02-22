import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateView(id: number, views: number) {
  try {
    const response = await prisma.room.update({
      where: {
        id: id,
      },
      data: { views: views },
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
  const item = JSON.parse(req.body)

  try {
    const items = await updateView(Number(item.id), Number(item.views))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
