import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

async function deleteRoom(user_id: string, id: number) {
  try {
    const response = await prisma.room.delete({
      where: {
        id: id,
      },
    })
    if (response.user_id !== user_id) return { message: 'not a valid sesseion' }
    else return response
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
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }
  const id = JSON.parse(req.body)
  try {
    const items = await deleteRoom(String(session.user?.id), Number(id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
