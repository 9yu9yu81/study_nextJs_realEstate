import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishlists(user_id: string) {
  try {
    const response = await prisma.$queryRaw`
      select r.id, r.category_id, r.images, r.title,
            s.type_id as sType_id, s.deposit, s.fee,
            a.doro
            from Room as r, SaleInfo as s, AddressInfo as a, Wishlist as w
            where r.id=s.room_id 
              and r.id=a.room_id
              and r.id=w.room_id
              and w.user_id=${user_id}`

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
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }
  try {
    const items = await getWishlists(String(session.user?.id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
