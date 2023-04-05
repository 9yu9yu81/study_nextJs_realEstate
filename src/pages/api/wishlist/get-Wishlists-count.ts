import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishlistsCount(user_id: string) {
  try {
    const response: any = await prisma.$queryRaw` 
      select count(*) as count
            from Wishlist as w, Room as r
              where r.id=w.room_id
              and w.user_id=${user_id}`
    // console.log(Number(response[0].count))
    return Number(response[0].count)
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
  try {
    const items = await getWishlistsCount(String(session.user?.id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
