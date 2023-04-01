import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import sub from 'date-fns/sub'

const prisma = new PrismaClient()

async function updateExpiredRooms() {
  try {
    const ExpiredDate = sub(new Date(), { days: 30 }) // today - 30days
    await prisma.$queryRaw`
      update Room set status_id = 3 where updatedAt < ${ExpiredDate} and status_id != 2
    `
    return
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}
export default async function handler(_: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const rooms = await updateExpiredRooms()
    res.status(200).json({ items: rooms, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
