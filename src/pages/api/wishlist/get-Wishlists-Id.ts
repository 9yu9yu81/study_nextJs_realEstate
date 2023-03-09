import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getWishlists(user_id: string) {
  try {
    const response: any = await prisma.$queryRaw`
      select room_id
            from Wishlist as w
            where w.user_id=${user_id}`

    // console.log(response.map((item: any) => item.room_id))
    return response.map((item: any) => item.room_id)
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
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }
  try {
    const items = await getWishlists(String(session.user?.id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
