import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getIsWished(user_id: string, room_id: number) {
  try {
    const response: any = await prisma.$queryRaw`
      select exists(
        select * from Wishlist as w
        where w.user_id = ${user_id} and w.room_id = ${room_id}
      ) as isWished`

    console.log(response[0])
    return Boolean(response[0].isWished)
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

  if (session == null) {
    res.status(200).json({ items: false, message: 'no Session' })
    return
  }

  const { room_id } = req.query
  try {
    const items = await getIsWished(String(session.user?.id), Number(room_id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
