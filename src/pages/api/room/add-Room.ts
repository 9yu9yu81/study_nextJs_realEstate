import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Room } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function addRoom(
  userId: string,
  room: Omit<
    Room,
    'userId' | 'id' | 'updatedAt' | 'status' | 'views' | 'wished'
  >
) {
  try {
    const response = await prisma.room.create({
      data: { ...room, userId: userId },
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
  const session = await getSession({ req })

  const items = JSON.parse(req.body)
  console.log(items)

  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }

  try {
    const room = await addRoom(String(session.user?.id), items)
    res.status(200).json({ items: room, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
