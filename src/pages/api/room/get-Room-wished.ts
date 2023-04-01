import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoomWished(room_id: string) {
  try {
    const response: any = await prisma.$queryRaw`
      select wished from Room where id = ${room_id}
    `
    // console.log(response[0])
    return response[0].wished
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
  const { id } = req.query

  if (id == null) {
    res.status(400).json({ message: 'no id' })
    return
  }

  try {
    const items = await getRoomWished(String(id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
