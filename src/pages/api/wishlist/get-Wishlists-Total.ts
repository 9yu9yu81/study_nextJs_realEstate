import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getWishlistsTotal(
  user_id: string,
  category_id: number,
  sType_id: number
) {
  try {
    const validCategory = category_id === 0 ? '%' : category_id
    const validSType = sType_id === 0 ? '%' : sType_id

    const response: any = await prisma.$queryRaw` 
      select count(*) as count
            from Wishlist as w, Room as r, SaleInfo as s
              where r.id=w.room_id
              and w.user_id=${user_id}
              and r.id=s.room_id
              and r.category_id like ${validCategory}
              and s.type_id like ${validSType}
              `
    console.log(Number(response[0].count))

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
  const session = await getSession({ req })
  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }
  const { category_id, sType_id } = req.query
  try {
    const items = await getWishlistsTotal(
      String(session.user?.id),
      Number(category_id),
      Number(sType_id)
    )
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
