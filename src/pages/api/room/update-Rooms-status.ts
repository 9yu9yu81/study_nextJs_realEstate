import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { add, compareAsc } from 'date-fns'

const prisma = new PrismaClient()

async function updateStatus2() {
  try {
    const rooms = await prisma.room.findMany({})
    rooms.map(async (room) => {
      if (
        compareAsc(add(new Date(room.updatedAt), { days: 30 }), new Date()) ===
        -1 //기한 30일
      ) {
        const response = await prisma.room.update({
          where: { id: room.id },
          data: { status: 2 },
        })
        console.log(response)
        return response
      }
    })
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
  try {
    const rooms = await updateStatus2()
    res.status(200).json({ items: rooms, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
